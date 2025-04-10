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
  wheelType: WheelType,
  vehicleBodyRef: RefObject<planck.Body | null>,
  motorJointsRef: RefObject<any[]>,
) => {
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
  ctx.fillText(`Позиция: X=${pos.x.toFixed(2)}, Y=${pos.y.toFixed(2)}`, 10, 60);
  ctx.fillText(`Скорость: ${speed.toFixed(2)}`, 10, 80);
  ctx.fillText(`Расстояние до земли: ${distanceToGround.toFixed(2)}`, 10, 100);

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
