// widgets/Simulation/ui/Puzzle/PuzzleSwiper.tsx
import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { PuzzlePiece } from '../../model/types/puzzle.types';
import { PIECE_WIDTH, PIECE_HEIGHT } from '../../model/constants/puzzle.constants';

interface PuzzleSwiperProps {
  swiperPieces: PuzzlePiece[];
  activeHint: number | null;
  onPieceDragStart: (pieceId: number) => void;
  onSwiperInit: (swiper: any) => void;
}

export const PuzzleSwiper: React.FC<PuzzleSwiperProps> = ({
  swiperPieces,
  activeHint,
  onPieceDragStart,
  onSwiperInit
}) => {
  // Рефы для изображений
  const imagesRef = useRef<Record<number, HTMLImageElement>>({});
  
  // Загрузка изображений для кусочков
  useEffect(() => {
    swiperPieces.forEach(piece => {
      if (!imagesRef.current[piece.id]) {
        const img = new Image();
        const [src, crop] = piece.image.split('#');
        img.src = src;
        imagesRef.current[piece.id] = img;
      }
    });
  }, [swiperPieces]);
  
  // Обработчик начала перетаскивания кусочка из свайпера
  const handlePieceDragStart = (e: React.MouseEvent, pieceId: number) => {
    e.preventDefault();
    onPieceDragStart(pieceId);
  };
  
  return (
    <div className="w-full max-w-lg mt-4">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">Доступные кусочки:</h3>
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        className="w-full"
        onSwiper={onSwiperInit}
      >
        {swiperPieces.map((piece) => (
          <SwiperSlide key={piece.id} className="h-auto">
            <div
              className={`relative cursor-pointer border-2 rounded overflow-hidden transition-all duration-200 ${
                activeHint === piece.id 
                  ? 'border-green-500 animate-pulse' 
                  : 'border-transparent hover:border-blue-500'
              }`}
              style={{
                width: PIECE_WIDTH,
                height: PIECE_HEIGHT,
              }}
              onMouseDown={(e) => handlePieceDragStart(e, piece.id)}
            >
              {imagesRef.current[piece.id] && (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${imagesRef.current[piece.id].src})`,
                    backgroundPosition: (() => {
                      const [, crop] = piece.image.split('#');
                      if (!crop) return 'center';
                      const [sx, sy] = crop.split(',').map(Number);
                      return `-${sx}px -${sy}px`;
                    })(),
                  }}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};