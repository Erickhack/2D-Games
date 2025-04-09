import React, { useEffect, useRef, useState } from 'react';
import * as planck from 'planck-js';
import {
  CONFIG,
  type VehicleType,
  type WheelType,
  type TerrainType,
} from '../model';
import { TractorController } from './TractorController';

interface Tractor {}

const Tractor: React.FC<Tractor> = () => {
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [wheelType, setWheelType] = useState<WheelType>('normal');
  const [terrainType, setTerrainType] = useState<TerrainType>('asphalt');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<planck.World | null>(null);
  const vehicleBodyRef = useRef<planck.Body | null>(null);
  const wheelsRef = useRef<planck.Body[]>([]);
  const jointsRef = useRef<planck.Joint[]>([]);
  const motorJointsRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  const switchTransport = () => {
    setVehicleType((prev) => (prev === 'car' ? 'truck' : 'car'));
    setWheelType((prev) => (prev === 'normal' ? 'caterpillar' : 'normal'));
  };

  // Логирование
  const logDebug = (message: string, ...args: any[]) => {
    console.log(`[DEBUG] ${message}`, ...args);
  };

  const logError = (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  };

  // Проверка контактов колес с поверхностью
  const checkWheelsOnGround = () => {
    let wheelsOnGround = 0;

    wheelsRef.current.forEach((wheel) => {
      try {
        // Получаем список контактных ребер
        const contactList = wheel.getContactList();
        let hasContact = false;

        // Проверяем все контакты колеса
        for (let ce = contactList; ce; ce = ce.next) {
          // Проверяем, что контакт существует, включен и активен
          if (ce.contact && ce.contact.isEnabled() && ce.contact.isTouching()) {
            hasContact = true;
            break;
          }
        }

        if (hasContact) {
          wheelsOnGround++;
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    });

    return wheelsOnGround;
  };

  // Загрузка изображений
  useEffect(() => {
    logDebug(
      'Loading images for vehicle:',
      vehicleType,
      'and wheel:',
      wheelType,
    );

    const imagesToLoad = [
      { key: 'vehicle', path: CONFIG.vehicle[vehicleType].imagePath },
      { key: 'wheel', path: CONFIG.wheel[wheelType].imagePath },
      { key: 'background', path: CONFIG.canvas.backgroundImage },
    ];

    let loadedCount = 0;

    imagesToLoad.forEach(({ key, path }) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        logDebug(
          `Image loaded: ${key} (${loadedCount}/${imagesToLoad.length})`,
        );
        if (loadedCount === imagesToLoad.length) {
          logDebug('All images loaded successfully');
          setImagesLoaded(true);
        }
      };
      img.onerror = (err) => {
        logError(`Failed to load image: ${key} (${path})`, err);
      };
      img.src = path;
      imagesRef.current[key] = img;
    });

    return () => {
      // Очистка
      imagesToLoad.forEach(({ key }) => {
        if (imagesRef.current[key]) {
          imagesRef.current[key].onload = null;
        }
      });
    };
  }, [vehicleType, wheelType]);

  // Инициализация физического мира
  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded) {
      logDebug('Canvas or images not ready yet');
      return;
    }

    logDebug('Initializing physics world');

    // Очистка предыдущего мира и объектов
    if (worldRef.current) {
      logDebug('Cleaning up previous world');

      // Удаляем соединения
      jointsRef.current.forEach((joint, index) => {
        logDebug(`Destroying joint ${index}`);
        worldRef.current!.destroyJoint(joint);
      });

      // Удаляем тела колес
      wheelsRef.current.forEach((wheel, index) => {
        logDebug(`Destroying wheel ${index}`);
        worldRef.current!.destroyBody(wheel);
      });

      // Удаляем тело транспорта
      if (vehicleBodyRef.current) {
        logDebug('Destroying vehicle body');
        worldRef.current!.destroyBody(vehicleBodyRef.current);
      }

      // Очищаем массивы
      jointsRef.current = [];
      motorJointsRef.current = [];
      wheelsRef.current = [];
      vehicleBodyRef.current = null;
    }

    // Создаем мир
    const world = planck.World({
      gravity: planck.Vec2(0, CONFIG.physics.gravity),
    });
    worldRef.current = world;
    logDebug('World created with gravity:', CONFIG.physics.gravity);

    // Создаем поверхности
    createTerrain(world);

    // Создаем тело транспорта
    createVehicle(world, vehicleType);

    // Создаем колеса
    createWheels(world, wheelType);

    // Запускаем анимацию
    startSimulation();

    return () => {
      // Очистка при размонтировании
      logDebug('Component unmounting, cleaning up');
      cancelAnimationFrame(requestRef.current);

      // Удаляем соединения
      jointsRef.current.forEach((joint) => {
        world.destroyJoint(joint);
      });

      // Удаляем тела
      if (vehicleBodyRef.current) {
        world.destroyBody(vehicleBodyRef.current);
      }

      wheelsRef.current.forEach((wheel) => {
        world.destroyBody(wheel);
      });

      // Очищаем массивы соединений
      jointsRef.current = [];
      motorJointsRef.current = [];
      wheelsRef.current = [];
      vehicleBodyRef.current = null;
    };
  }, [imagesLoaded, vehicleType, wheelType]);

  // Создание поверхностей
  const createTerrain = (world: planck.World) => {
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
  const createVehicle = (world: planck.World, type: VehicleType) => {
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
          (CONFIG.terrain.asphalt.positionY -
            CONFIG.terrain.asphalt.height / 2),
      });
    }
  };

  // Создание колес
  const createWheels = (world: planck.World, type: WheelType) => {
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

  // Запуск симуляции
  const startSimulation = () => {
    if (!worldRef.current) {
      logError('Cannot start simulation: world is null');
      return;
    }

    logDebug('Starting simulation');

    const animate = () => {
      if (!worldRef.current || !canvasRef.current) return;

      // Шаг физического мира
      worldRef.current.step(
        CONFIG.physics.timeStep,
        CONFIG.physics.velocityIterations,
        CONFIG.physics.positionIterations,
      );

      // Отрисовка
      render();

      // Управление
      handleControls();

      // Следующий кадр
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Обработка управления
  const handleControls = () => {
    // Периодически логируем состояние
    if (Math.random() < 0.01) {
      // ~1% вероятность (примерно каждые 100 кадров)
      if (vehicleBodyRef.current) {
        const velocity = vehicleBodyRef.current.getLinearVelocity();
        const speed = Math.sqrt(
          velocity.x * velocity.x + velocity.y * velocity.y,
        );
        const position = vehicleBodyRef.current.getPosition();

        logDebug('Vehicle state:', {
          position: { x: position.x, y: position.y },
          velocity: { x: velocity.x, y: velocity.y },
          speed: speed,
          angle: vehicleBodyRef.current.getAngle(),
        });

        // Проверяем состояние моторов
        motorJointsRef.current.forEach((joint, index) => {
          try {
            const motorSpeed = joint.getMotorSpeed
              ? joint.getMotorSpeed()
              : 'N/A';
            logDebug(`Motor ${index} speed:`, motorSpeed);
          } catch (e) {
            // Игнорируем ошибки здесь, чтобы не спамить консоль
          }
        });

        const wheelsOnGround = checkWheelsOnGround();
        if (wheelsOnGround > 0) {
          logDebug(
            `Wheels on ground: ${wheelsOnGround}/${wheelsRef.current.length}`,
          );
        }
      }
    }
  };

  // Отрисовка
  const render = () => {
    if (!canvasRef.current || !vehicleBodyRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Очищаем холст
    ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    // Отрисовка фона
    if (imagesRef.current.background) {
      ctx.drawImage(
        imagesRef.current.background,
        0,
        0,
        CONFIG.canvas.width,
        CONFIG.canvas.height,
      );
    }

    // Отрисовка поверхностей
    renderTerrain(ctx);

    // Отрисовка транспорта
    renderVehicle(ctx);

    // Отрисовка колес
    renderWheels(ctx);

    // Отрисовка отладочной информации
    if (CONFIG.simulation.debug.showInfo) {
      renderDebugInfo(ctx);
    }
  };

  // Отрисовка поверхностей
  const renderTerrain = (ctx: CanvasRenderingContext2D) => {
    const canvasWidth = CONFIG.canvas.width;

    // Отрисовка асфальта
    ctx.fillStyle = CONFIG.terrain.asphalt.color;
    ctx.fillRect(
      0,
      CONFIG.terrain.asphalt.positionY - CONFIG.terrain.asphalt.height / 2,
      canvasWidth / 2,
      CONFIG.terrain.asphalt.height,
    );
  };

  // Отрисовка транспорта
  const renderVehicle = (ctx: CanvasRenderingContext2D) => {
    if (!vehicleBodyRef.current || !imagesRef.current.vehicle) return;

    const vehicleConfig = CONFIG.vehicle[vehicleType];
    const pos = vehicleBodyRef.current.getPosition();
    const angle = vehicleBodyRef.current.getAngle();

    const width = vehicleConfig.width;
    const height = vehicleConfig.height;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);
    ctx.drawImage(
      imagesRef.current.vehicle,
      -width / 2,
      -height / 2,
      width,
      height,
    );
    ctx.restore();
  };

  // Отрисовка колес
  const renderWheels = (ctx: CanvasRenderingContext2D) => {
    if (!imagesRef.current.wheel) return;

    const wheelConfig = CONFIG.wheel[wheelType];

    wheelsRef.current.forEach((wheel) => {
      const pos = wheel.getPosition();
      const angle = wheel.getAngle();
      const diameter = wheelConfig.radius * 2;

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(angle);
      ctx.drawImage(
        imagesRef.current.wheel,
        -diameter / 2,
        -diameter / 2,
        diameter,
        diameter,
      );
      ctx.restore();
    });
  };

  // Отрисовка отладочной информации
  const renderDebugInfo = (ctx: CanvasRenderingContext2D) => {
    if (!vehicleBodyRef.current) return;

    const pos = vehicleBodyRef.current.getPosition();
    const velocity = vehicleBodyRef.current.getLinearVelocity();
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

    // Добавляем информацию о расстоянии до поверхности
    const terrainTopY =
      CONFIG.terrain.asphalt.positionY - CONFIG.terrain.asphalt.height / 2;
    const distanceToGround =
      pos.y +
      CONFIG.vehicle[vehicleType].height /
        (2 * CONFIG.vehicle[vehicleType].scale) -
      terrainTopY;

    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText(`Транспорт: ${vehicleType}`, 10, 20);
    ctx.fillText(`Колеса: ${wheelType}`, 10, 40);
    ctx.fillText(
      `Позиция: X=${pos.x.toFixed(2)}, Y=${pos.y.toFixed(2)}`,
      10,
      60,
    );
    ctx.fillText(`Скорость: ${speed.toFixed(2)}`, 10, 80);
    ctx.fillText(
      `Расстояние до земли: ${distanceToGround.toFixed(2)}`,
      10,
      100,
    );

    // Проверяем, сколько колес на земле
    const wheelsOnGround = checkWheelsOnGround();
    ctx.fillText(
      `Колес на земле: ${wheelsOnGround}/${wheelsRef.current.length}`,
      10,
      120,
    );

    // Добавляем информацию о моторах
    if (motorJointsRef.current.length > 0) {
      try {
        if (
          motorJointsRef.current[0] &&
          motorJointsRef.current[0].getMotorSpeed
        ) {
          ctx.fillText(
            `Скорость мотора: ${motorJointsRef.current[0].getMotorSpeed().toFixed(2)}`,
            10,
            140,
          );
        }
      } catch (e) {
        ctx.fillText(`Ошибка получения скорости мотора`, 10, 140);
      }

      ctx.fillText(
        `Крутящий момент: ${CONFIG.wheel[wheelType].motorTorque}`,
        10,
        160,
      );
    }

    // Добавляем информацию о нажатых клавишах
    ctx.fillText(`Управление: ←→(движение)`, 10, 180);
  };

  // Применение движения к колесам
  const applyWheelDrive = (speed: number) => {
    if (wheelsRef.current.length === 0) {
      return;
    }

    // Проверяем, сколько колес на земле
    const wheelsOnGround = checkWheelsOnGround();

    // Применяем вращение к каждому колесу
    wheelsRef.current.forEach((wheel) => {
      try {
        // Устанавливаем угловую скорость напрямую
        wheel.setAngularVelocity(speed);

        // Также применяем силу для движения
        const force = speed * 10; // Увеличиваем силу
        wheel.applyForceToCenter(planck.Vec2(force, 0));
      } catch (e) {
        // Игнорируем ошибки
      }
    });

    // Если у нас есть соединения с моторами, используем их
    motorJointsRef.current.forEach((joint) => {
      try {
        if (joint && typeof joint.setMotorSpeed === 'function') {
          // Устанавливаем скорость мотора
          joint.setMotorSpeed(speed);

          // Убедимся, что мотор включен
          if (typeof joint.enableMotor === 'function') {
            joint.enableMotor(true);
          }

          // Увеличиваем крутящий момент для лучшего движения
          if (typeof joint.setMaxMotorTorque === 'function') {
            const torque = CONFIG.wheel[wheelType].motorTorque * 3; // Утраиваем крутящий момент
            joint.setMaxMotorTorque(torque);
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    });

    // Если колеса не крутятся через моторы, применяем силу к транспорту напрямую
    if (vehicleBodyRef.current) {
      const force = speed * 20; // Значительно увеличиваем силу
      vehicleBodyRef.current.applyForceToCenter(planck.Vec2(force, 0));
    }
  };

  // Обработка клавиш управления (без наклона)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!worldRef.current) {
        return;
      }

      const controls = CONFIG.simulation.controls;
      const currentWheelConfig = CONFIG.wheel[wheelType];

      switch (e.key) {
        case controls.leftKey:
          // Движение влево (назад)
          applyWheelDrive(-currentWheelConfig.motorSpeed);
          break;
        case controls.rightKey:
          // Движение вправо (вперед)
          applyWheelDrive(currentWheelConfig.motorSpeed);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!worldRef.current) {
        return;
      }

      const controls = CONFIG.simulation.controls;

      switch (e.key) {
        case controls.leftKey:
        case controls.rightKey:
          // Остановка движения
          applyWheelDrive(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [wheelType]);

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4">
      <div
        className="relative"
        style={{ width: CONFIG.canvas.width, height: CONFIG.canvas.height }}
      >
        <TractorController switchTransport={switchTransport} />

        <canvas
          ref={canvasRef}
          width={CONFIG.canvas.width}
          height={CONFIG.canvas.height}
          className="block"
        />
      </div>
    </div>
  );
};

export default Tractor;
