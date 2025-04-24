import React, { useMemo, useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import clsx from 'clsx';

const infos: {
  title: string;
  text: string;
}[] = [
  {
    title: 'Срок службы',
    text: '1 год',
  },
  {
    title: 'Световой поток',
    text: '40 ВТ',
  },
  {
    title: 'Коэффицент пульсации',
    text: '20%',
  },
];

interface PuzzlePiece {
  id: number;
  width: number;
  height: number;
  name: string;
  src: string;
}

const PIECES: {
  id: number;
  name: string;
}[] = [
  {
    id: 1,
    name: 'Лампа',
  },
  {
    id: 2,
    name: 'Люминисцентная',
  },
  {
    id: 3,
    name: 'Светодиодная',
  },
];

const renderSwiperPiece = (piece: PuzzlePiece) => {
  return (
    <div
      className="flex h-full cursor-pointer flex-col items-center justify-center gap-[29px]"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="bg-contain bg-center bg-no-repeat"
        style={{
          width: piece.width,
          height: piece.height,
          backgroundImage: `url(${piece.src})`,
        }}
      />
      <span className="text-2xl font-semibold text-[#1B1A22]">
        {piece.name}
      </span>
    </div>
  );
};

export const LightBulb = () => {
  const createInitialPieces = (): PuzzlePiece[] => {
    return PIECES.map((piece, index) => ({
      id: piece.id,
      src: `/light-bulb/pieces/piece${index + 1}.svg`,
      width: 145,
      height: 145,
      name: piece.name,
    }));
  };

  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>(
    createInitialPieces(),
  );

  return (
    <div className="flex justify-center">
      <div className="flex h-[871px] w-[1400px] gap-8">
        <div className="flex flex-col gap-[42px] rounded-xl bg-white p-8">
          <h2 className="text-[32px] font-semibold text-[#1B1A22]">
            Лампа накаливания
          </h2>
          <ul className="flex flex-col gap-[29px]">
            {infos.map((info) => (
              <li className="flex flex-col gap-5" key={info.title}>
                <h5 className="text-xl font-medium text-[#0C0C0CCC]">
                  {info.title}
                </h5>
                <div className="flex w-max items-center gap-3.5 rounded-[14px] border-[1.5px] border-[#F0F0F0] px-4 py-2">
                  <span className="text-[#0C0C0CCC]">{info.text}</span>
                  <div className="h-[26px] w-[64px] rounded-[26px] bg-[#E6EFD4]" />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-auto flex-col items-center justify-between rounded-xl bg-white p-[42px]">
          <div className="flex h-[76px] w-[155px] items-center justify-end rounded-[53px] bg-white p-[9.47px] shadow-[inset_4.11597px_4.11597px_12.3479px_rgba(0,0,0,0.35),inset_-6.17396px_-6.17396px_12.3479px_#FFFFFF]">
            <div className="size-[57px] rounded-full bg-white shadow-[1.23479px_1.23479px_10.2899px_rgba(0,0,0,0.4),-1.64639px_-1.64639px_10.2899px_#FFFFFF,inset_2.46958px_2.46958px_8.23195px_rgba(255,255,255,0.8),inset_-2.46958px_-2.46958px_8.23195px_rgba(0,0,0,0.3)]" />
          </div>
          <div className="relative h-[549px] w-[365px]">
            <div className="z-50 h-[549px] w-[365px] bg-[url(/light-bulb/target1.svg)] bg-contain bg-center bg-no-repeat" />
            {/* <Light className="z-0" isOn /> */}
          </div>
        </div>
        <div>
          <Swiper
            direction="vertical"
            slidesPerView={3}
            spaceBetween={61}
            pagination={{ clickable: true }}
            className="h-full w-[239px]"
          >
            {puzzlePieces.map((piece) => (
              <SwiperSlide
                className="w-full rounded-xl border-2 bg-white transition-colors hover:border-gray-300"
                key={`swiper-${piece.id}`}
              >
                {renderSwiperPiece(piece)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
