// widgets/Simulation/lib/utils/puzzleUtils.ts
import type { PuzzlePiece } from '../../model/types/puzzle.types';

interface IProps {
  pagePath: string;
  PIECE_SIZES: { width: number; height: number; scale?: number }[];
  CORRECT_POSITIONS: { x: number; y: number }[];
  PREINSTALLED_PIECES?: number[];
}

export function createInitialPieces({
  CORRECT_POSITIONS,
  PIECE_SIZES,
  pagePath,
  PREINSTALLED_PIECES = [],
}: IProps): PuzzlePiece[] {
  return PIECE_SIZES.map((size, index) => {
    const isPreinstalled = PREINSTALLED_PIECES.includes(index);

    return {
      id: index + 1,
      src: `/puzl/pieces/${pagePath}/piece${index + 1}.svg`,
      correctX: CORRECT_POSITIONS[index].x,
      correctY: CORRECT_POSITIONS[index].y,
      x: CORRECT_POSITIONS[index].x,
      y: CORRECT_POSITIONS[index].y,
      width: size.width,
      height: size.height,
      placed: isPreinstalled,
      inSwiper: !isPreinstalled,
      scale: size.scale,
    };
  });
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
