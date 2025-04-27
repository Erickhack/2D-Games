// widgets/Simulation/lib/hooks/usePuzzlePhysics.ts
import { useRef, useCallback } from 'react';
import { World, Vec2, Edge, Box, Body } from 'planck';
import type { PuzzlePiece, BodyUserData } from '../../model/types/puzzle.types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../model/constants/puzzle.constants';

export function usePuzzlePhysics() {
  const worldRef = useRef<World | null>(null);
  const bodiesRef = useRef<Record<number, Body>>({});
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const initPhysicsWorld = useCallback((pieceSizes: { width: number; height: number }[]) => {
    worldRef.current = new World();

    // Находим максимальные размеры кусочков для учета при создании границ
    const maxPieceWidth = Math.max(...pieceSizes.map((size) => size.width));
    const maxPieceHeight = Math.max(...pieceSizes.map((size) => size.height));

    const halfMaxWidth = maxPieceWidth / 2;
    const halfMaxHeight = maxPieceHeight / 2;

    // Нижняя граница
    const ground = worldRef.current.createBody({
      type: 'static',
      position: new Vec2(0, CANVAS_HEIGHT - halfMaxHeight),
    });
    ground.createFixture({
      shape: new Edge(
        new Vec2(-CANVAS_WIDTH, 0),
        new Vec2(CANVAS_WIDTH * 2, 0),
      ),
      friction: 0.3,
    });

    // Верхняя граница
    const ceiling = worldRef.current.createBody({
      type: 'static',
      position: new Vec2(0, halfMaxHeight),
    });
    ceiling.createFixture({
      shape: new Edge(
        new Vec2(-CANVAS_WIDTH, 0),
        new Vec2(CANVAS_WIDTH * 2, 0),
      ),
      friction: 0.3,
    });

    // Левая стена
    const leftWall = worldRef.current.createBody({
      type: 'static',
      position: new Vec2(halfMaxWidth, 0),
    });
    leftWall.createFixture({
      shape: new Edge(
        new Vec2(0, -CANVAS_HEIGHT),
        new Vec2(0, CANVAS_HEIGHT * 2),
      ),
      friction: 0.3,
    });

    // Правая стена
    const rightWall = worldRef.current.createBody({
      type: 'static',
      position: new Vec2(CANVAS_WIDTH - halfMaxWidth, 0),
    });
    rightWall.createFixture({
      shape: new Edge(
        new Vec2(0, -CANVAS_HEIGHT),
        new Vec2(0, CANVAS_HEIGHT * 2),
      ),
      friction: 0.3,
    });

    startSimulation();
  }, []);

  const createBodyForPiece = useCallback(
    (piece: PuzzlePiece, x: number, y: number): Body => {
      if (!worldRef.current) throw new Error('Physics world not initialized');

      const body = worldRef.current.createBody({
        type: 'dynamic',
        position: new Vec2(x, y),
        linearDamping: 0.5,
        angularDamping: 0.5,
      });

      body.createFixture({
        shape: new Box(piece.width / 2, piece.height / 2),
        density: 1.0,
        friction: 0.3,
        restitution: 0.2,
      });

      body.setUserData({ id: piece.id } as BodyUserData);
      bodiesRef.current[piece.id] = body;

      return body;
    },
    []
  );

  const startSimulation = useCallback(() => {
    const timeStep = 1 / 60;
    const velocityIterations = 6;
    const positionIterations = 2;

    const step = (): void => {
      if (worldRef.current) {
        worldRef.current.step(timeStep, velocityIterations, positionIterations);
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  }, []);

  const cleanupPhysicsWorld = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Удаляем все физические тела
    if (worldRef.current) {
      Object.values(bodiesRef.current).forEach((body) => {
        worldRef.current?.destroyBody(body);
      });
    }
    
    worldRef.current = null;
    bodiesRef.current = {};
  }, []);

  const clampPosition = useCallback(
    (x: number, y: number, pieceWidth: number, pieceHeight: number) => {
      const halfWidth = pieceWidth / 2;
      const halfHeight = pieceHeight / 2;

      const clampedX = Math.max(halfWidth, Math.min(CANVAS_WIDTH - halfWidth, x));
      const clampedY = Math.max(halfHeight, Math.min(CANVAS_HEIGHT - halfHeight, y));

      return new Vec2(clampedX, clampedY);
    },
    []
  );

  return {
    worldRef,
    bodiesRef,
    canvasRef,
    animationRef,
    initPhysicsWorld,
    createBodyForPiece,
    startSimulation,
    cleanupPhysicsWorld,
    clampPosition,
  };
}