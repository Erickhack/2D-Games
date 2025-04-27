// widgets/Simulation/ui/Puzzle/PuzzleCanvas.tsx
import React from 'react';
import type { PuzzlePiece } from '../../model/types/puzzle.types';

interface PuzzleCanvasProps {
  puzzlePieces: PuzzlePiece[];
  activeHint: number | null;
  draggingPiece: number | null;
  pagePath: string;
  handleCanvasPieceMouseDown: (e: React.MouseEvent, pieceId: number) => void;
  showHintForPiece: (pieceId: number) => void;
  showHints: boolean;
  preinstalledPieces: number[];
}

export const PuzzleCanvas: React.FC<PuzzleCanvasProps> = ({
  puzzlePieces,
  activeHint,
  draggingPiece,
  pagePath,
  handleCanvasPieceMouseDown,
  showHintForPiece,
  showHints,
}) => {
  // Рендеринг подсказки для кусочка
  const renderHint = (piece: PuzzlePiece) => {
    if (piece.placed) return null;

    return (
      <div
        key={`hint-${piece.id}`}
        className={`absolute cursor-pointer ${activeHint === piece.id ? 'opacity-70' : 'opacity-30'}`}
        style={{
          left: piece.correctX - piece.width / 2,
          top: piece.correctY - piece.height / 2,
          width: piece.width,
          height: piece.height,
          backgroundImage: `url(/puzl/pieces/${pagePath}/piece${piece.id}.svg)`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
          border: activeHint === piece.id ? '2px dashed #4CAF50' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => showHintForPiece(piece.id)}
      />
    );
  };

  // Рендеринг кусочка пазла на canvas
  const renderPuzzlePiece = (piece: PuzzlePiece) => {
    if (piece.inSwiper && !piece.returning) return null;

    return (
      <div
        key={`canvas-piece-${piece.id}`}
        className={`absolute cursor-grab bg-contain bg-center bg-no-repeat ${piece.placed ? 'cursor-default' : ''}`}
        style={{
          left: piece.x - piece.width / 2,
          top: piece.y - piece.height / 2,
          width: piece.width,
          height: piece.height,
          backgroundImage: `url(${piece.src})`,
          transition: piece.placed || piece.returning ? 'all 0.5s ease' : 'none',
          zIndex: draggingPiece === piece.id ? 10 : 1,
          opacity: piece.returning ? '0' : '1',
          transform: piece.returning ? 'scale(0.4)' : 'scale(1)',
          border: activeHint === piece.id && !piece.placed ? '2px solid #4CAF50' : 'none',
        }}
        onMouseDown={(e) => handleCanvasPieceMouseDown(e, piece.id)}
      />
    );
  };

  return (
    <>
      {/* Фоновое изображение */}
      <div
        className="absolute h-full w-full bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/puzl/backgrounds/cols_rows.png)' }}
      />

      {/* Отображение подсказок */}
      {showHints && puzzlePieces.map(renderHint)}

      {/* Кусочки пазла на canvas */}
      {puzzlePieces.map(renderPuzzlePiece)}
    </>
  );
};
