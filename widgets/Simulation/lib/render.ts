import type { RefObject } from 'react';
import * as planck from 'planck-js';
import { CONFIG, type VehicleType, type WheelType } from '../model';

// Отрисовка поверхностей
export const renderTerrain = (ctx: CanvasRenderingContext2D) => {
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
export const renderVehicle = (
  ctx: CanvasRenderingContext2D,
  vehicleType: VehicleType,
  vehicleBodyRef: RefObject<planck.Body | null>,
  imagesRef: RefObject<Record<string, HTMLImageElement>>,
) => {
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
export const renderWheels = (
  ctx: CanvasRenderingContext2D,
  wheelType: WheelType,
  imagesRef: RefObject<Record<string, HTMLImageElement>>,
  wheelsRef: RefObject<planck.Body[]>,
) => {
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
export const renderDebugInfo = (
  ctx: CanvasRenderingContext2D,
  vehicleType: VehicleType,
  vehicleBodyRef: RefObject<planck.Body | null>,
  motorJointsRef: RefObject<any[]>,
) => {
  if (!vehicleBodyRef.current) return;

  //   const velocity = vehicleBodyRef.current.getLinearVelocity();
  //   const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

  ctx.fillStyle = '#FFFFFFCC';
  ctx.font = '18px Arial';

  ctx.fillText(`Скорость двигателя:`, 32, CONFIG.canvas.height - 59);
  ctx.fillText(`Транспорт:`, 32, CONFIG.canvas.height - 25);

  const vehicle = vehicleType === 'car' ? 'Трактор' : 'Трактор 1';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '18px Arial';

  const speed = motorJointsRef.current[0].getMotorSpeed().toFixed(2);

  ctx.fillText(speed, 246, CONFIG.canvas.height - 59);
  ctx.fillText(vehicle, 246, CONFIG.canvas.height - 25);
};

// Отрисовка декоративных элементов
export const renderDecorations = (
  ctx: CanvasRenderingContext2D,
  wheelType: WheelType,
  imagesRef: RefObject<Record<string, HTMLImageElement>>,
  decorationsRef: RefObject<planck.Body[]>,
) => {
  // Проверяем, есть ли декоративные элементы для данного типа колес
  const wheelConfig = CONFIG.wheel[wheelType];
  if (!wheelConfig.decoration || wheelConfig.decoration.length === 0) {
    return;
  }

  // Проверяем, есть ли созданные тела декораций
  if (!decorationsRef.current || decorationsRef.current.length === 0) {
    return;
  }

  // Отрисовываем каждую декорацию
  decorationsRef.current.forEach((decorationBody, index) => {
    const decoration = wheelConfig.decoration![index];

    // Пропускаем, если изображение не загружено
    if (!imagesRef.current[`decoration_${index}`]) {
      return;
    }

    const pos = decorationBody.getPosition();
    const angle = decorationBody.getAngle();

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);
    ctx.drawImage(
      imagesRef.current[`decoration_${index}`],
      -decoration.w / 2,
      -decoration.h / 2,
      decoration.w,
      decoration.h,
    );
    ctx.restore();
  });
};

// Отрисовка песка
export const renderSand = (
  ctx: CanvasRenderingContext2D,
  world: planck.World,
) => {
  const sandConfig = CONFIG.terrain.sand;

  // Устанавливаем стиль для песка
  ctx.fillStyle = sandConfig.color;

  // Проходим по всем телам в мире
  for (let body = world.getBodyList(); body; body = body.getNext()) {
    // Проверяем, является ли тело частицей песка
    const userData = body.getUserData() as any;
    if (userData && userData?.type === 'sand') {
      const pos = body.getPosition();

      // Получаем фикстуру (у частицы песка только одна фикстура)
      const fixture = body.getFixtureList();
      if (fixture) {
        const shape = fixture.getShape();
        // Проверяем, что форма - круг
        if (shape.getType() === 'circle') {
          const radius = shape.getRadius();

          // Отрисовываем частицу песка
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
};
