import React, { useEffect, useRef, useState, type RefObject } from 'react';
import * as planck from 'planck-js';
import {
  CONFIG,
  type VehicleType,
  type WheelType,
  type TerrainType,
} from '../model';
import { TractorController } from './TractorController';
import {
  createDecorations,
  createTerrain,
  createVehicle,
  createWheels,
} from '../lib/create';
import {
  renderDebugInfo,
  renderDecorations,
  renderSand,
  renderTerrain,
  renderVehicle,
  renderWheels,
} from '../lib/render';
import { Left } from 'shared/svgs/ui/arrows/chevron/Left';
import { Right } from 'shared/svgs/ui/arrows/chevron/Right';

interface Tractor {
  restoreRef: RefObject<(() => void | null) | null>;
}

// Логирование
export const logDebug = (message: string, ...args: any[]) => {
  console.log(`[DEBUG] ${message}`, ...args);
};

export const logError = (message: string, ...args: any[]) => {
  console.error(`[ERROR] ${message}`, ...args);
};

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
  const decorationsRef = useRef<planck.Body[]>([]);
  const decorationJointsRef = useRef<planck.Joint[]>([]);

  const switchTransport = (transport: 'normal-car' | 'truck-caterpillar') => {
    setVehicleType(transport === 'normal-car' ? 'car' : 'truck');
    setWheelType(transport === 'normal-car' ? 'normal' : 'caterpillar');
  };

  const switchTerrain = (terrain: boolean) => {
    setTerrainType(terrain ? 'asphalt' : 'sand');
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

    // Добавляем загрузку изображений для декоративных элементов
    const wheelConfig = CONFIG.wheel[wheelType];
    if (wheelConfig.decoration && wheelConfig.decoration.length > 0) {
      wheelConfig.decoration.forEach((item, index) => {
        if (item.image) {
          imagesToLoad.push({ key: `decoration_${index}`, path: item.image });
        }
      });
    }

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

      // Добавляем очистку декоративных элементов
      decorationJointsRef.current.forEach((joint, index) => {
        logDebug(`Destroying decoration joint ${index}`);
        worldRef.current!.destroyJoint(joint);
      });

      decorationsRef.current.forEach((decoration, index) => {
        logDebug(`Destroying decoration ${index}`);
        worldRef.current!.destroyBody(decoration);
      });

      // Очищаем массивы
      jointsRef.current = [];
      motorJointsRef.current = [];
      wheelsRef.current = [];
      vehicleBodyRef.current = null;
      decorationJointsRef.current = [];
      decorationsRef.current = [];
    }

    // Создаем мир
    const world = planck.World({
      gravity: planck.Vec2(0, CONFIG.physics.gravity),
    });
    worldRef.current = world;
    logDebug('World created with gravity:', CONFIG.physics.gravity);

    // Создаем поверхности
    createTerrain(world, terrainType);

    // Создаем тело транспорта
    createVehicle(world, vehicleType, vehicleBodyRef);

    // Создаем колеса
    createWheels(
      world,
      wheelType,
      vehicleType,
      vehicleBodyRef,
      wheelsRef,
      jointsRef,
      motorJointsRef,
    );

    // Создаем декоративные элементы
    createDecorations(
      world,
      vehicleType,
      wheelType,
      vehicleBodyRef,
      decorationsRef,
      decorationJointsRef,
    );

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

      // Добавляем очистку декоративных элементов
      decorationJointsRef.current.forEach((joint) => {
        world.destroyJoint(joint);
      });

      decorationsRef.current.forEach((decoration) => {
        world.destroyBody(decoration);
      });

      // Очищаем массивы соединений
      jointsRef.current = [];
      motorJointsRef.current = [];
      wheelsRef.current = [];
      vehicleBodyRef.current = null;
      decorationJointsRef.current = [];
      decorationsRef.current = [];
    };
  }, [imagesLoaded, vehicleType, wheelType, terrainType]);

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
      }
    }
  };

  // Отрисовка
  const render = () => {
    if (!canvasRef.current || !vehicleBodyRef.current || !worldRef.current)
      return;

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

    // Отрисовка песка
    terrainType === 'sand' && renderSand(ctx, worldRef.current);

    // Отрисовка транспорта
    renderVehicle(ctx, vehicleType, vehicleBodyRef, imagesRef);

    // Отрисовка декораций
    renderDecorations(ctx, wheelType, imagesRef, decorationsRef);

    // Отрисовка колес
    renderWheels(ctx, wheelType, imagesRef, wheelsRef);

    // Отрисовка отладочной информации
    if (CONFIG.simulation.debug.showInfo) {
      renderDebugInfo(ctx, vehicleType, vehicleBodyRef, motorJointsRef);
    }
  };

  // Применение движения к колесам
  const applyWheelDrive = (speed: number) => {
    if (wheelsRef.current.length === 0) {
      return;
    }

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
        <TractorController
          switchTransport={switchTransport}
          switchTerrain={switchTerrain}
        />

        <div className="absolute right-8 bottom-6 flex gap-4">
          <div className="flex h-[82px] w-[82px] flex-col items-center justify-center rounded-[17.18px] border-2 border-[#FFFFFF33] bg-[##FFFFFF33] backdrop-blur-[2px]">
            <Left />
            <span className="text-sm font-medium">Назад</span>
          </div>
          <div className="flex h-[82px] w-[82px] flex-col items-center justify-center rounded-[17.18px] border-2 border-[#FFFFFF33] bg-[##FFFFFF33] backdrop-blur-[2px]">
            <Right />
            <span className="text-sm font-medium">Вперед</span>
          </div>
        </div>

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
