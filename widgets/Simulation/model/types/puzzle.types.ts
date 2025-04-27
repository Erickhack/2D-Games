// widgets/Simulation/model/types/puzzle.types.ts
import type { RefObject } from 'react';
import { Body, World } from 'planck';

export interface PuzzlePiece {
  id: number;
  src: string;
  correctX: number;
  correctY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  placed: boolean;
  inSwiper: boolean;
  returning?: boolean;
  scale?: number;
}

export interface BodyUserData {
  id: number;
}

export interface PuzzleProps {
  restoreRef: RefObject<(() => void | null) | null>;
  pagePath: string;
  PIECE_SIZES: { width: number; height: number; scale?: number }[];
  CORRECT_POSITIONS: { x: number; y: number }[];
}

export interface PuzzleState {
  puzzlePieces: PuzzlePiece[];
  draggingPiece: number | null;
  completedCount: number;
  showHints: boolean;
  activeHint: number | null;
  hintsUsed: number;
  puzzleCompleted: boolean;
  hintMessage: string;
  showHintPanel: boolean;
}

export interface PhysicsRefs {
  worldRef: React.MutableRefObject<World | null>;
  bodiesRef: React.MutableRefObject<Record<number, Body>>;
  canvasRef: React.MutableRefObject<HTMLDivElement | null>;
  animationRef: React.MutableRefObject<number | null>;
}
