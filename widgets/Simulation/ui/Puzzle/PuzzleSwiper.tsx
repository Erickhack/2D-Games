// widgets/Simulation/ui/Puzzle/PuzzleSwiper.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import type { PuzzlePiece } from '../../model/types/puzzle.types';
import { ArrDown } from 'shared/svgs/ui/puzl/ArrDown';
import { ArrUp } from 'shared/svgs/ui/puzl/ArrUp';
import Button from 'shared/buttons/ui/Button';
import { SWIPER_HEIGHT, SWIPER_Y_POSITION } from '../../model/constants/puzzle.constants';

interface PuzzleSwiperProps {
  swiperPieces: PuzzlePiece[];
  activeHint: number | null;
  swiperRef: React.MutableRefObject<SwiperType | null>;
  handleSwiperPieceMouseDown: (e: React.MouseEvent, pieceId: number) => void;
}

export const PuzzleSwiper: React.FC<PuzzleSwiperProps> = ({
  swiperPieces,
  activeHint,
  swiperRef,
  handleSwiperPieceMouseDown,
}) => {
  // Функции для ручной навигации
  const slidePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const slideNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  // Рендеринг кусочка пазла в Swiper
  const renderSwiperPiece = (piece: PuzzlePiece) => {
    if (!piece.inSwiper) return null;

    const isHighlighted = activeHint === piece.id;

    return (
      <div
        className={`flex h-full cursor-grab items-center justify-center ${
          isHighlighted ? 'ring-opacity-70 ring-2 ring-green-500' : ''
        }`}
        style={{
          pointerEvents: 'auto',
          transition: 'all 0.3s ease',
          backgroundColor: isHighlighted
            ? 'rgba(76, 175, 80, 0.2)'
            : 'transparent',
        }}
      >
        <div
          className="bg-contain bg-center bg-no-repeat"
          style={{
            width: piece.width * (piece.scale || 0.4),
            height: piece.height * (piece.scale || 0.4),
            backgroundImage: `url(${piece.src})`,
          }}
        />
      </div>
    );
  };

  if (swiperPieces.length === 0) return null;

  return (
    <div
      className="absolute right-5 z-[5] flex w-[209px] flex-col gap-[26px]"
      style={{
        top: SWIPER_Y_POSITION,
        height: SWIPER_HEIGHT,
      }}
    >
      <Button
        onClick={slidePrev}
        className="rounded-xl border-2 border-[#ffffff33] bg-[#ffffff33] py-3.5"
      >
        <ArrUp />
      </Button>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        mousewheel={false}
        keyboard={false}
        direction="vertical"
        slidesPerView={3}
        spaceBetween={18}
        pagination={{ clickable: true }}
        className="h-full w-[209px]"
        style={{ pointerEvents: 'auto' }}
        simulateTouch={false}
        allowTouchMove={false}
      >
        {swiperPieces.map((piece) => (
          <SwiperSlide
            className="w-full rounded-xl border-2 border-[#ffffff33] bg-[#ffffff33] transition-colors hover:border-[#ffffff66]"
            key={`swiper-${piece.id}`}
            style={{ pointerEvents: 'auto' }}
            onMouseDown={(e) => handleSwiperPieceMouseDown(e, piece.id)}
            onContextMenu={(e) => e.preventDefault()}
          >
            {renderSwiperPiece(piece)}
          </SwiperSlide>
        ))}
      </Swiper>
      <Button
        className="rounded-xl border-2 border-[#ffffff33] bg-[#ffffff33] py-3.5"
        onClick={slideNext}
      >
        <ArrDown />
      </Button>
    </div>
  );
};