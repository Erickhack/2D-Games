// widgets/Simulation/model/types/puzzle.types.ts
import { World, Body } from 'planck-js';

// Интерфейс для кусочка пазла
export interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  placed: boolean;
  inSwiper: boolean;
  image: string; // Формат: "url#srcX,srcY,srcWidth,srcHeight"
}

// Интерфейс для состояния перетаскивания
export interface DragState {
  isDragging: boolean;
  draggedPieceId: number | null;
  dragStartX: number;
  dragStartY: number;
}

// Интерфейс для позиции мыши
export interface MousePosition {
  x: number;
  y: number;
}

// Интерфейс для состояния таймера
export interface TimerState {
  startTime: number;
  elapsedTime: number;
  isRunning: boolean;
}

// Интерфейс для физических ссылок
export interface PhysicsRefs {
  worldRef: React.MutableRefObject<World | null>;
  bodiesRef: React.MutableRefObject<Record<number, Body>>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  initPhysicsWorld: () => void;
  createPieceBody: (piece: PuzzlePiece) => Body;
  updateBodyPosition: (pieceId: number, x: number, y: number) => void;
  cleanupPhysicsWorld: () => void;
}

// Интерфейс для результатов завершения пазла
export interface PuzzleCompletionResult {
  time: number;
  hintsUsed: number;
}

// Интерфейс для пропсов компонента Puzzle
export interface PuzzleProps {
  onComplete?: (result: PuzzleCompletionResult) => void;
  restoreRef?: React.MutableRefObject<(() => void) | null>;
}