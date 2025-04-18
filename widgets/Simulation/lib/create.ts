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
    // Фильтр категорий для оптимизации коллизий
    filterCategoryBits: 0x0001, // Категория для асфальта
    filterMaskBits: 0xFFFF,     // Сталкивается со всеми категориями
  });
  logDebug('Asphalt created at position:', asphaltBody.getPosition());
  
  // Создаем песок
  createSand(world);
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

// Функция для создания декоративных элементов
export const createDecorations = (
  world: planck.World,
  vehicleType: VehicleType,
  wheelType: WheelType,
  vehicleBodyRef: RefObject<planck.Body | null>,
  decorationsRef: RefObject<planck.Body[]>,
  decorationJointsRef: RefObject<planck.Joint[]>,
) => {
  if (!vehicleBodyRef.current) {
    logError('Cannot create decorations: vehicle body is null');
    return;
  }

  // Проверяем, есть ли декоративные элементы для данного типа колес
  const wheelConfig = CONFIG.wheel[wheelType];
  if (!wheelConfig.decoration || wheelConfig.decoration.length === 0) {
    logDebug('No decorations defined for wheel type:', wheelType);
    return;
  }

  logDebug(
    'Creating decorations for vehicle type:',
    vehicleType,
    'and wheel type:',
    wheelType,
  );

  // Получаем размеры транспорта
  const vehicleConfig = CONFIG.vehicle[vehicleType];
  const vehicleWidth = vehicleConfig.width / vehicleConfig.scale;
  const vehicleHeight = vehicleConfig.height / vehicleConfig.scale;

  // Очищаем предыдущие декорации, если они были
  if (decorationsRef.current.length > 0) {
    logDebug('Cleaning up previous decorations');

    // Удаляем соединения
    decorationJointsRef.current.forEach((joint, index) => {
      logDebug(`Destroying decoration joint ${index}`);
      world.destroyJoint(joint);
    });

    // Удаляем тела декораций
    decorationsRef.current.forEach((decoration, index) => {
      logDebug(`Destroying decoration ${index}`);
      world.destroyBody(decoration);
    });

    // Очищаем массивы
    decorationJointsRef.current = [];
    decorationsRef.current = [];
  }

  // Создаем новые декорации
  wheelConfig.decoration.forEach((item, index) => {
    // Пропускаем элементы с пустым путем к изображению или нулевыми размерами
    if (!item.image || item.w <= 0 || item.h <= 0) {
      return;
    }

    logDebug(`Creating decoration ${index} with image: ${item.image}`);

    // Вычисляем абсолютную позицию декорации относительно центра транспорта
    const posX =
      vehicleBodyRef.current!.getPosition().x + item.x * vehicleWidth;
    const posY =
      vehicleBodyRef.current!.getPosition().y + item.y * vehicleHeight;

    // Создаем тело для декорации
    const decorationBody = world.createBody({
      type: 'dynamic',
      position: planck.Vec2(posX, posY),
      angle: item.angle || 0,
    });

    // Создаем форму для декорации (прямоугольник)
    const decorationShape = planck.Box(item.w / 2, item.h / 2);

    // Добавляем фикстуру к телу
    decorationBody.createFixture({
      shape: decorationShape,
      density: 0.1, // Низкая плотность, чтобы не влиять на физику
      friction: 0.1,
      restitution: 0.1,
      isSensor: true, // Делаем сенсором, чтобы не влиять на коллизии
    });

    // Добавляем декорацию в список
    decorationsRef.current.push(decorationBody);

    // Создаем жесткое соединение между транспортом и декорацией
    try {
      const joint = planck.WeldJoint(
        {},
        vehicleBodyRef.current!,
        decorationBody,
        decorationBody.getPosition(),
      );

      // Добавляем соединение в мир
      const createdJoint = world.createJoint(joint);
      if (createdJoint) {
        decorationJointsRef.current.push(createdJoint);
        logDebug(`Decoration joint ${index} created successfully`);
      } else {
        logError(`Failed to create joint for decoration ${index}`);
      }
    } catch (e) {
      logError(`Error creating joint for decoration ${index}:`, e);
    }

    logDebug(
      `Decoration ${index} created at position:`,
      decorationBody.getPosition(),
    );
  });

  logDebug('Total decorations created:', decorationsRef.current.length);
  logDebug(
    'Total decoration joints created:',
    decorationJointsRef.current.length,
  );
};

// Создание частиц песка
export const createSand = (world: planck.World) => {
  const sandConfig = CONFIG.terrain.sand;

  logDebug('Creating sand particles');

  // Определяем область для размещения песка
  const startX = sandConfig.positionX;
  const endX = startX + sandConfig.width;
  const startY = sandConfig.positionY;
  const endY = startY + sandConfig.depth;

  // Создаем частицы песка
  for (let i = 0; i < sandConfig.particleCount; i++) {
    // Случайная позиция в пределах области
    const x = startX + Math.random() * sandConfig.width;
    const y = startY + Math.random() * sandConfig.depth;

    // Случайный радиус (для разнообразия)
    const radius = sandConfig.particleRadius * (0.8 + Math.random() * 0.4);

    // Создаем тело для частицы
    const sandParticle = world.createBody({
      type: 'dynamic',
      position: planck.Vec2(x, y),
      // Добавляем небольшое затухание для более реалистичного поведения
      linearDamping: 0.5,
      angularDamping: 0.5,
    });

    // Создаем форму для частицы (круг)
    const sandShape = planck.Circle(radius);

    // Добавляем фикстуру к частице
    sandParticle.createFixture({
      shape: sandShape,
      density: sandConfig.density,
      friction: sandConfig.friction,
      restitution: sandConfig.restitution,
      // Фильтр категорий для оптимизации коллизий
      filterCategoryBits: 0x0002, // Категория для песка
      filterMaskBits: 0xffff, // Сталкивается со всеми категориями
    });

    // Устанавливаем пользовательские данные для идентификации частиц песка
    sandParticle.setUserData({ type: 'sand' });
  }

  logDebug(`Created ${sandConfig.particleCount} sand particles`);
};
