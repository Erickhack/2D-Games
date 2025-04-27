// widgets/Simulation/lib/hooks/usePuzzleDrag.ts
import { useCallback } from 'react';
import { Vec2, Body } from 'planck';
import type { PuzzlePiece } from '../../model/types/puzzle.types';
import { SNAP_THRESHOLD } from '../../model/constants/puzzle.constants';

export function usePuzzleDrag({
  state,
  setState,
  updatePuzzlePieces,
  bodiesRef,
  worldRef,
  canvasRef,
  clampPosition,
  createBodyForPiece,
  onPiecePlaced,
}: {
  state: {
    puzzlePieces: PuzzlePiece[];
    draggingPiece: number | null;
  };
  setState: (state: any) => void;
  updatePuzzlePieces: (updater: (prevPieces: PuzzlePiece[]) => PuzzlePiece[]) => void;
  bodiesRef: React.MutableRefObject<Record<number, Body>>;
  worldRef: React.MutableRefObject<any>;
  canvasRef: React.MutableRefObject<HTMLDivElement | null>;
  clampPosition: (x: number, y: number, width: number, height: number) => Vec2;
  createBodyForPiece: (piece: PuzzlePiece, x: number, y: number) => Body;
  onPiecePlaced: (pieceId: number) => void;
}) {
  const handleCanvasPieceMouseDown = useCallback(
    (e: React.MouseEvent, pieceId: number): void => {
      e.stopPropagation();
      const piece = state.puzzlePieces.find((p) => p.id === pieceId);
      if (!piece || piece.placed || piece.inSwiper) return;

      setState((prev: any) => ({ ...prev, draggingPiece: pieceId }));

      const body = bodiesRef.current[pieceId];
      if (body) {
        body.setType('kinematic');
        body.setLinearVelocity(new Vec2(0, 0));
        body.setAngularVelocity(0);
      }
    },
    [state.puzzlePieces, setState, bodiesRef]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent): void => {
      if (state.draggingPiece === null) return;

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const piece = state.puzzlePieces.find((p) => p.id === state.draggingPiece);
        if (piece) {
          const clampedPosition = clampPosition(x, y, piece.width, piece.height);

          const body = bodiesRef.current[state.draggingPiece];
          if (body) {
            body.setPosition(clampedPosition);
          }
        }
      }
    },
    [state.draggingPiece, state.puzzlePieces, canvasRef, clampPosition, bodiesRef]
  );

  const placePieceCorrectly = useCallback(
    (piece: PuzzlePiece, body: Body): void => {
      body.setPosition(new Vec2(piece.correctX, piece.correctY));
      body.setType('static');

      updatePuzzlePieces((prevPieces) =>
        prevPieces.map((p) =>
          p.id === piece.id
            ? {
                ...p,
                x: piece.correctX,
                y: piece.correctY,
                placed: true,
                inSwiper: false,
              }
            : p
        )
      );

      onPiecePlaced(piece.id);
    },
    [updatePuzzlePieces, onPiecePlaced]
  );

  const handleMouseUp = useCallback((): void => {
    if (state.draggingPiece === null) return;

    const piece = state.puzzlePieces.find((p) => p.id === state.draggingPiece);
    const body = bodiesRef.current[state.draggingPiece];

    if (piece && body) {
      const position = body.getPosition();
      const distanceToCorrect = Math.sqrt(
        Math.pow(position.x - piece.correctX, 2) +
          Math.pow(position.y - piece.correctY, 2)
      );

      if (distanceToCorrect < SNAP_THRESHOLD) {
        // Кусочек находится близко к правильной позиции
        placePieceCorrectly(piece, body);
      } else {
        // Удаляем физическое тело
        if (worldRef.current) {
          worldRef.current.destroyBody(body);
          delete bodiesRef.current[state.draggingPiece];
        }

        // Анимируем возврат кусочка в Swiper
        updatePuzzlePieces((prevPieces) =>
          prevPieces.map((p) =>
            p.id === piece.id
              ? {
                  ...p,
                  x: position.x,
                  y: position.y,
                  inSwiper: true,
                  returning: true,
                }
              : p
          )
        );

        // Через небольшую задержку завершаем анимацию
        setTimeout(() => {
          updatePuzzlePieces((prevPieces) =>
            prevPieces.map((p) =>
              p.id === piece.id
                ? {
                    ...p,
                    returning: false,
                  }
                : p
            )
          );
        }, 500);
      }
    }

    setState((prev: any) => ({ ...prev, draggingPiece: null }));
  }, [
    state.draggingPiece,
    state.puzzlePieces,
    bodiesRef,
    worldRef,
    updatePuzzlePieces,
    setState,
    placePieceCorrectly,
  ]);

  const handleSwiperPieceMouseDown = useCallback(
    (e: React.MouseEvent, pieceId: number): void => {
      e.preventDefault();
      e.stopPropagation();

      const piece = state.puzzlePieces.find((p) => p.id === pieceId);
      if (!piece || piece.placed) return;

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clampedPosition = clampPosition(x, y, piece.width, piece.height);

        const body = createBodyForPiece(piece, clampedPosition.x, clampedPosition.y);

        updatePuzzlePieces((prevPieces) =>
          prevPieces.map((p) =>
            p.id === pieceId
              ? {
                  ...p,
                  x: clampedPosition.x,
                  y: clampedPosition.y,
                  inSwiper: false,
                }
              : p
          )
        );

        setState((prev: any) => ({ ...prev, draggingPiece: pieceId }));
        body.setType('kinematic');
      }
    },
    [
      state.puzzlePieces,
      canvasRef,
      clampPosition,
      createBodyForPiece,
      updatePuzzlePieces,
      setState,
    ]
  );

  return {
    handleCanvasPieceMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleSwiperPieceMouseDown,
  };
}