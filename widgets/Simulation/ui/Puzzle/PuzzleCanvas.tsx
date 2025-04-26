// widgets/Simulation/ui/Puzzle/PuzzleCanvas.tsx
import React, { useRef, useEffect } from 'react';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  CANVAS_PADDING,
  PIECE_WIDTH,
  PIECE_HEIGHT
} from '../../model/constants/puzzle.constants';
import type { PuzzlePiece } from '../../model/types/puzzle.types';

interface PuzzleCanvasProps {
  puzzlePieces: PuzzlePiece[];
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  activeHint: number | null;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const PuzzleCanvas: React.FC<PuzzleCanvasProps> = ({
  puzzlePieces,
  canvasRef,
  activeHint,
  handleMouseDown
}) => {
  // Реф для изображений кусочков
  const imagesRef = useRef<Record<number, HTMLImageElement>>({});
  
  // Загрузка изображений для кусочков
  useEffect(() => {
    puzzlePieces.forEach(piece => {
      if (!imagesRef.current[piece.id]) {
        const img = new Image();
        const [src, crop] = piece.image.split('#');
        img.src = src;
        img.onload = () => {
          // Перерисовываем канвас после загрузки изображения
          drawCanvas();
        };
        imagesRef.current[piece.id] = img;
      }
    });
  }, [puzzlePieces]);
  
  // Функция отрисовки канваса
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем фон
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем сетку для целевых позиций
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= PIECE_WIDTH * 4; x += PIECE_WIDTH) {
      ctx.beginPath();
      ctx.moveTo(CANVAS_PADDING + x, CANVAS_PADDING);
      ctx.lineTo(CANVAS_PADDING + x, CANVAS_PADDING + PIECE_HEIGHT * 3);
      ctx.stroke();
    }
    
    for (let y = 0; y <= PIECE_HEIGHT * 3; y += PIECE_HEIGHT) {
      ctx.beginPath();
      ctx.moveTo(CANVAS_PADDING, CANVAS_PADDING + y);
      ctx.lineTo(CANVAS_PADDING + PIECE_WIDTH * 4, CANVAS_PADDING + y);
      ctx.stroke();
    }
    
    // Рисуем подсветку для активной подсказки
    if (activeHint !== null) {
      const targetPiece = puzzlePieces.find(piece => piece.id === activeHint);
      if (targetPiece) {
        ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        ctx.fillRect(
          targetPiece.targetX,
          targetPiece.targetY,
          PIECE_WIDTH,
          PIECE_HEIGHT
        );
        
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          targetPiece.targetX,
          targetPiece.targetY,
          PIECE_WIDTH,
          PIECE_HEIGHT
        );
      }
    }
    
    // Рисуем кусочки пазла
    puzzlePieces.forEach(piece => {
      const img = imagesRef.current[piece.id];
      if (!img) return;
      
      const [, crop] = piece.image.split('#');
      if (!crop) return;
      
      const [sx, sy, sw, sh] = crop.split(',').map(Number);
      
      // Рисуем кусочек
      ctx.drawImage(
        img,
        sx, sy, sw, sh,
        piece.x, piece.y, piece.width, piece.height
      );
      
      // Если кусочек является активной подсказкой, рисуем вокруг него рамку
      if (activeHint === piece.id && !piece.placed) {
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          piece.x,
          piece.y,
          piece.width,
          piece.height
        );
      }
    });
  };
  
  // Перерисовываем канвас при изменении кусочков или активной подсказки
  useEffect(() => {
    drawCanvas();
  }, [puzzlePieces, activeHint]);
  
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-gray-300 rounded-lg shadow-md"
      onMouseDown={handleMouseDown}
    />
  );
};