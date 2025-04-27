// widgets/Simulation/lib/hooks/usePuzzleState.ts
import { useState, useCallback } from 'react';
import type { PuzzlePiece, PuzzleState } from '../../model/types/puzzle.types';

export function usePuzzleState(
  initialPieces: PuzzlePiece[]
): {
  state: PuzzleState;
  setState: React.Dispatch<React.SetStateAction<PuzzleState>>;
  updatePuzzlePieces: (
    updater: (prevPieces: PuzzlePiece[]) => PuzzlePiece[]
  ) => void;
  resetPuzzle: () => void;
  createInitialPieces: () => PuzzlePiece[];
  getSwiperPieces: () => PuzzlePiece[];
} {
  const [state, setState] = useState<PuzzleState>({
    puzzlePieces: initialPieces,
    draggingPiece: null,
    completedCount: 0,
    showHints: true,
    activeHint: null,
    hintsUsed: 0,
    puzzleCompleted: false,
    hintMessage: '',
    showHintPanel: false,
  });

  const updatePuzzlePieces = useCallback(
    (updater: (prevPieces: PuzzlePiece[]) => PuzzlePiece[]) => {
      setState((prevState) => ({
        ...prevState,
        puzzlePieces: updater(prevState.puzzlePieces),
      }));
    },
    []
  );

  const resetPuzzle = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      puzzlePieces: initialPieces,
      draggingPiece: null,
      completedCount: 0,
      activeHint: null,
      hintsUsed: 0,
      puzzleCompleted: false,
      showHintPanel: false,
    }));
  }, [initialPieces]);

  const createInitialPieces = useCallback(() => {
    return initialPieces;
  }, [initialPieces]);

  const getSwiperPieces = useCallback(() => {
    return state.puzzlePieces.filter((piece) => piece.inSwiper);
  }, [state.puzzlePieces]);

  return {
    state,
    setState,
    updatePuzzlePieces,
    resetPuzzle,
    createInitialPieces,
    getSwiperPieces,
  };
}