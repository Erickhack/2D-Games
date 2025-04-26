// widgets/Simulation/lib/hooks/usePuzzlePhysics.ts
import { useRef, useEffect, useCallback } from 'react';
import { World, Vec2, Body, Box, Edge } from 'planck-js';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  CANVAS_PADDING,
  PIECE_WIDTH,
  PIECE_HEIGHT,
  WORLD_SCALE,
  PIECE_DENSITY,
  PIECE_FRICTION,
  PIECE_RESTITUTION
} from '../../model/constants/puzzle.constants';
import type { PuzzlePiece, PhysicsRefs } from '../../model/types/puzzle.types';
import { pixelsToPhysics } from '../utils/puzzleUtils';

export const usePuzzlePhysics = (): PhysicsRefs => {
  // Рефы для хранения физического мира и тел
  const worldRef = useRef<World | null>(null);
  const bodiesRef = useRef<Record<number, Body>>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Инициализация физического мира
  const initPhysicsWorld = useCallback(() => {
    // Создаем мир с гравитацией (0, 0)
    const world = World({
      gravity: Vec2(0, 0),
    });

    // Создаем границы мира (стенки)
    const thickness = 10; // Толщина стенок
    
    // Верхняя граница
    const topWall = world.createBody();
    topWall.createFixture({
      shape: Edge(
        Vec2(pixelsToPhysics(0), pixelsToPhysics(0)),
        Vec2(pixelsToPhysics(CANVAS_WIDTH), pixelsToPhysics(0))
      ),
      friction: 0.3,
    });

    // Нижняя граница
    const bottomWall = world.createBody();
    bottomWall.createFixture({
      shape: Edge(
        Vec2(pixelsToPhysics(0), pixelsToPhysics(CANVAS_HEIGHT)),
        Vec2(pixelsToPhysics(CANVAS_WIDTH), pixelsToPhysics(CANVAS_HEIGHT))
      ),
      friction: 0.3,
    });

    // Левая граница
    const leftWall = world.createBody();
    leftWall.createFixture({
      shape: Edge(
        Vec2(pixelsToPhysics(0), pixelsToPhysics(0)),
        Vec2(pixelsToPhysics(0), pixelsToPhysics(CANVAS_HEIGHT))
      ),
      friction: 0.3,
    });

    // Правая граница
    const rightWall = world.createBody();
    rightWall.createFixture({
      shape: Edge(
        Vec2(pixelsToPhysics(CANVAS_WIDTH), pixelsToPhysics(0)),
        Vec2(pixelsToPhysics(CANVAS_WIDTH), pixelsToPhysics(CANVAS_HEIGHT))
      ),
      friction: 0.3,
    });

    worldRef.current = world;
  }, []);

  // Создание физического тела для кусочка пазла
  const createPieceBody = useCallback((piece: PuzzlePiece): Body => {
    if (!worldRef.current) {
      throw new Error('Physics world is not initialized');
    }

    // Создаем тело
    const body = worldRef.current.createDynamicBody({
      position: Vec2(
        pixelsToPhysics(piece.x + piece.width / 2),
        pixelsToPhysics(piece.y + piece.height / 2)
      ),
      linearDamping: 0.5, // Затухание линейного движения
      angularDamping: 0.5, // Затухание вращения
    });

    // Добавляем форму (прямоугольник)
    body.createFixture({
      shape: Box(
        pixelsToPhysics(piece.width / 2),
        pixelsToPhysics(piece.height / 2)
      ),
      density: PIECE_DENSITY,
      friction: PIECE_FRICTION,
      restitution: PIECE_RESTITUTION,
    });

    // Сохраняем тело в реф
    bodiesRef.current[piece.id] = body;

    return body;
  }, []);

  // Обновление позиции тела
  const updateBodyPosition = useCallback((pieceId: number, x: number, y: number) => {
    const body = bodiesRef.current[pieceId];
    if (body) {
      body.setPosition(Vec2(
        pixelsToPhysics(x + PIECE_WIDTH / 2),
        pixelsToPhysics(y + PIECE_HEIGHT / 2)
      ));
      body.setLinearVelocity(Vec2(0, 0)); // Сбрасываем скорость
    }
  }, []);

  // Очистка физического мира
  const cleanupPhysicsWorld = useCallback(() => {
    if (worldRef.current) {
      // Удаляем все тела
      Object.values(bodiesRef.current).forEach(body => {
        if (worldRef.current) {
          worldRef.current.destroyBody(body);
        }
      });
      bodiesRef.current = {};
      worldRef.current = null;
    }
  }, []);

  // Инициализация физического мира при монтировании компонента
  useEffect(() => {
    initPhysicsWorld();
    
    // Очистка при размонтировании
    return () => {
      cleanupPhysicsWorld();
    };
  }, [initPhysicsWorld, cleanupPhysicsWorld]);

  return {
    worldRef,
    bodiesRef,
    canvasRef,
    initPhysicsWorld,
    createPieceBody,
    updateBodyPosition,
    cleanupPhysicsWorld
  };
};