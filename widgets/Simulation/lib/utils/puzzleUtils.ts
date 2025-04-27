// widgets/Simulation/lib/utils/puzzleUtils.ts
import type { PuzzlePiece } from '../../model/types/puzzle.types';

interface IProps {
  pagePath: string;
  PIECE_SIZES: { width: number; height: number; scale?: number }[];
  CORRECT_POSITIONS: { x: number; y: number }[];
}

export function createInitialPieces({
  CORRECT_POSITIONS,
  PIECE_SIZES,
  pagePath,
}: IProps): PuzzlePiece[] {
  return PIECE_SIZES.map((size, index) => ({
    id: index + 1,
    src: `/puzl/pieces/${pagePath}/piece${index + 1}.svg`,
    correctX: CORRECT_POSITIONS[index].x,
    correctY: CORRECT_POSITIONS[index].y,
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    placed: false,
    inSwiper: true,
    scale: size.scale,
  }));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
