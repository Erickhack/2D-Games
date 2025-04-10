import type { RefObject } from 'react';
import { CONFIG, type VehicleType, type WheelType } from '../model';
import { logDebug, logError } from '../ui/tractor';
import * as planck from 'planck-js';

// Создание поверхностей
export const createTerrain = (world: planck.World) => {
  const canvasWidth = CONFIG.canvas.width;

  logDebug('Creating terrain');

  // Создаем асфальт
  const asphaltBody = world.createBody({
    type: 'static',
    position: planck.Vec2(canvasWidth / 4, CONFIG.terrain.asphalt.positionY),
  });

  const asphaltShape = planck.Box(
    canvasWidth,
    CONFIG.terrain.asphalt.height / 2,
  );
  asphaltBody.createFixture({
    shape: asphaltShape,
    friction: CONFIG.terrain.asphalt.friction,
  });
  logDebug('Asphalt created at position:', asphaltBody.getPosition());
};

// Создание транспортного средства
export const createVehicle = (
  world: planck.World,
  type: VehicleType,
  vehicleBodyRef: RefObject<planck.Body | null>,
) => {
  const vehicleConfig = CONFIG.vehicle[type];
  const canvasWidth = CONFIG.canvas.width;

  logDebug('Creating vehicle:', type);
  logDebug('Vehicle config:', vehicleConfig);

  // Размеры тела
  const width = vehicleConfig.width / vehicleConfig.scale;
  const height = vehicleConfig.height / vehicleConfig.scale;
  logDebug('Vehicle dimensions:', { width, height });

  // Вычисляем правильную позицию Y для транспорта
  // Располагаем транспорт прямо над поверхностью
  const vehicleY =
    CONFIG.terrain.asphalt.positionY -
    CONFIG.terrain.asphalt.height / 2 -
    height / 2 -
    50; // 5 пикселей запаса

  // Создаем тело
  const vehicleBody = world.createBody({
    type: 'dynamic',
    position: planck.Vec2(vehicleConfig.position.x * canvasWidth, vehicleY),
    angularDamping: 0.5, // Добавляем затухание вращения,
  });

  // Создаем форму
  const vehicleShape = planck.Box(width / 2, height / 2);

  // Добавляем фикстуру к телу
  vehicleBody.createFixture({
    shape: vehicleShape,
    density: vehicleConfig.density,
    friction: vehicleConfig.friction,
    restitution: vehicleConfig.restitution,
  });

  vehicleBodyRef.current = vehicleBody;
  logDebug('Vehicle created at position:', vehicleBody.getPosition());
  logDebug('Vehicle fixture properties:', {
    density: vehicleConfig.density,
    friction: vehicleConfig.friction,
    restitution: vehicleConfig.restitution,
  });

  if (vehicleBodyRef.current) {
    logDebug('Vehicle Y position vs terrain Y position:', {
      vehicleY: vehicleBody.getPosition().y,
      asphaltY: CONFIG.terrain.asphalt.positionY,
      terrainTopY:
        CONFIG.terrain.asphalt.positionY - CONFIG.terrain.asphalt.height / 2,
      distanceToGround:
        vehicleBody.getPosition().y -
        (CONFIG.terrain.asphalt.positionY - CONFIG.terrain.asphalt.height / 2),
    });
  }
};

// Создание колес
export const createWheels = (
  world: planck.World,
  type: WheelType,
  vehicleType: VehicleType,
  vehicleBodyRef: RefObject<planck.Body | null>,
  wheelsRef: RefObject<planck.Body[]>,
  jointsRef: RefObject<planck.Joint[]>,
  motorJointsRef: RefObject<any[]>,
) => {
  if (!vehicleBodyRef.current) {
    logError('Cannot create wheels: vehicle body is null');
    return;
  }

  const wheelConfig = CONFIG.wheel[type];
  const vehicleConfig = CONFIG.vehicle[vehicleType];

  logDebug('Creating wheels:', type);
  logDebug('Wheel config:', wheelConfig);

  // Размеры транспорта
  const vehicleWidth = vehicleConfig.width / vehicleConfig.scale;
  const vehicleHeight = vehicleConfig.height / vehicleConfig.scale;

  // Радиус колеса
  const wheelRadius = wheelConfig.radius / wheelConfig.scale;
  logDebug('Wheel radius:', wheelRadius);

  // Создаем колеса в указанных позициях
  wheelConfig.positions.forEach((pos, index) => {
    // Позиция колеса относительно центра транспорта
    const wheelPos = planck.Vec2(pos.x * vehicleWidth, pos.y * vehicleHeight);
    logDebug(`Wheel ${index} relative position:`, wheelPos);

    // Создаем тело колеса
    const wheelBody = world.createBody({
      type: 'dynamic',
      position: planck.Vec2(
        vehicleBodyRef.current!.getPosition().x + wheelPos.x,
        vehicleBodyRef.current!.getPosition().y + wheelPos.y,
      ),
    });

    // Создаем форму колеса (круг)
    const wheelShape = planck.Circle(wheelRadius);

    // Добавляем фикстуру к колесу
    wheelBody.createFixture({
      shape: wheelShape,
      density: wheelConfig.density,
      friction: wheelConfig.friction,
      restitution: wheelConfig.restitution,
    });

    // Добавляем колесо в список
    wheelsRef.current.push(wheelBody);

    logDebug(`Wheel ${index} created at position:`, wheelBody.getPosition());
    logDebug(`Wheel ${index} fixture properties:`, {
      density: wheelConfig.density,
      friction: wheelConfig.friction,
      restitution: wheelConfig.restitution,
    });

    // Создаем соединение между транспортом и колесом
    try {
      const jointDef = {
        motorSpeed: 0, // Начальная скорость мотора
        maxMotorTorque: wheelConfig.motorTorque,
        enableMotor: true,
      };

      logDebug(`Creating joint ${index} with properties:`, jointDef);

      const joint = planck.RevoluteJoint(
        jointDef,
        vehicleBodyRef.current!,
        wheelBody,
        wheelBody.getPosition(),
      );

      // Добавляем соединение в мир
      const createdJoint = world.createJoint(joint);

      if (createdJoint) {
        jointsRef.current.push(createdJoint);
        motorJointsRef.current.push(createdJoint);

        // Проверяем, есть ли метод isMotorEnabled
        let motorEnabled = false;
        try {
          motorEnabled = createdJoint.isMotorEnabled();
        } catch (e) {
          logError(`Error calling isMotorEnabled on joint ${index}:`, e);
        }

        logDebug(`Joint ${index} created successfully`);
        logDebug(`Joint ${index} motor enabled:`, motorEnabled);
        logDebug(`Joint ${index} max motor torque:`, wheelConfig.motorTorque);

        // Проверяем, есть ли метод getMotorSpeed
        try {
          const motorSpeed = createdJoint.getMotorSpeed();
          logDebug(`Joint ${index} initial motor speed:`, motorSpeed);
        } catch (e) {
          logError(`Error calling getMotorSpeed on joint ${index}:`, e);
        }

        // Проверяем доступные методы
        const methods = [];
        for (const p in createdJoint) {
          const prop = p as keyof typeof createdJoint;
          if (typeof createdJoint[prop] === 'function') {
            methods.push(prop);
          }
        }
        logDebug(`Joint ${index} available methods:`, methods);
      } else {
        logError(`Failed to create joint ${index}`);
      }
    } catch (e) {
      logError(`Error creating joint for wheel ${index}:`, e);
    }
  });

  logDebug('Total wheels created:', wheelsRef.current.length);
  logDebug('Total joints created:', jointsRef.current.length);
  logDebug('Total motor joints created:', motorJointsRef.current.length);
};
