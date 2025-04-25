import React, {
  useEffect,
  useRef,
  useState,
  type EventHandler,
  type MouseEvent,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import clsx from 'clsx';
import { colorMap } from '../model/lightBulb';

interface PuzzlePiece {
  id: number;
  width: number;
  height: number;
  name: string;
  src: string;
  color: keyof typeof colorMap;
}

const PIECES: {
  id: number;
  name: string;
  color: keyof typeof colorMap;
  info: { lable: string; value: number; unit: string }[];
}[] = [
  {
    id: 1,
    name: 'Лампа',
    color: 'yellow',
    info: [
      { lable: 'Срок службы', value: 1, unit: 'год' },
      { lable: 'Световой поток', value: 40, unit: 'ВТ' },
      { lable: 'Коэффицент пульсации', value: 20, unit: '%' },
    ],
  },
  {
    id: 2,
    name: 'Люминисцентная',
    color: 'blue',
    info: [
      { lable: 'Срок службы', value: 6, unit: 'год' },
      { lable: 'Световой поток', value: 9, unit: 'ВТ' },
      { lable: 'Коэффицент пульсации', value: 50, unit: '%' },
    ],
  },
  {
    id: 3,
    name: 'Светодиодная',
    color: 'skyBlue',
    info: [
      { lable: 'Срок службы', value: 20, unit: 'год' },
      { lable: 'Световой поток', value: 4, unit: 'ВТ' },
      { lable: 'Коэффицент пульсации', value: 5, unit: '%' },
    ],
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

const RenderTarget = ({ target }: { target?: string | number }) => {
  const render = (id: string | number) => (
    <div
      className="relative z-50 h-[549px] w-[365px] bg-contain bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(/light-bulb/targets/target${id}.svg)`,
      }}
    />
  );

  switch (target) {
    case 1:
      return render(target);
    case 2:
      return render(target);
    case 3:
      return render(target);
    default:
      return render('');
  }
};

export const LightBulb = () => {
  const createInitialPieces = (): PuzzlePiece[] => {
    return PIECES.map((piece, index) => ({
      id: piece.id,
      src: `/light-bulb/pieces/piece${index + 1}.svg`,
      width: 145,
      height: 145,
      name: piece.name,
      color: piece.color,
    }));
  };

  const [target, setTarget] = useState(0);
  const [lightActive, setLightActive] = useState(false);
  const puzzlePieces = useRef(createInitialPieces());
  const audioOn = useRef<HTMLAudioElement>(null);
  const audioOFf = useRef<HTMLAudioElement>(null);

  const handleSwitchLight = () => {
    if (target === 0) return;

    setLightActive((prev) => {
      if (!audioOFf && !audioOn) return !prev;

      if (prev) {
        audioOFf.current?.play();
      } else {
        audioOn.current?.play();
      }

      return !prev;
    });
  };

  const handleSelectLight: EventHandler<MouseEvent<HTMLDivElement>> = (
    event,
  ) => {
    const id = Number(event.currentTarget.getAttribute('data-id'));
    if (!id) return;
    if (id === target) return setTarget(0);

    setTarget(id);
  };

  useEffect(() => {
    audioOFf.current = new Audio('/light-bulb/audio/off.mp3');
    audioOn.current = new Audio('/light-bulb/audio/on.mp3');
  }, []);

  useEffect(() => {
    if (lightActive) {
      setLightActive(false);
      audioOFf.current?.play();
    }
  }, [target]);

  const lightOn = 'translate-x-[calc(100%+20px)]';
  const lightOf = 'translate-x-0';

  return (
    <div className="flex justify-center">
      <div className="flex h-[871px] w-[1400px] gap-8">
        <div className="flex w-[445px] flex-col gap-[42px] rounded-xl bg-white p-8">
          <h2 className="text-[32px] font-semibold text-[#1B1A22]">
            {PIECES.find((piece) => piece.id === target)?.name ||
              'Выберите лампу'}
          </h2>
          <ul className="flex flex-col gap-[29px]">
            {PIECES.find((piece) => piece.id === target)?.info.map((info) => (
              <li className="flex flex-col gap-5" key={info.lable}>
                <h5 className="text-xl font-medium text-[#0C0C0CCC]">
                  {info.lable}
                </h5>
                <div className="flex w-max items-center gap-3.5 rounded-[14px] border-[1.5px] border-[#F0F0F0] px-4 py-2">
                  <span className="text-[#0C0C0CCC]">
                    {info.value} {info.unit}
                  </span>
                  <div className="h-[26px] w-[64px] rounded-[26px] bg-[#E6EFD4]" />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-auto flex-col items-center justify-between rounded-xl bg-white p-[42px]">
          <div
            onClick={handleSwitchLight}
            className="relative z-10 flex h-[76px] w-[155px] cursor-pointer items-center rounded-[53px] bg-white p-[9.47px] shadow-[inset_4.11597px_4.11597px_12.3479px_rgba(0,0,0,0.35),inset_-6.17396px_-6.17396px_12.3479px_#FFFFFF]"
          >
            <div
              className={`size-[57px] rounded-full bg-white shadow-[1.23479px_1.23479px_10.2899px_rgba(0,0,0,0.4),-1.64639px_-1.64639px_10.2899px_#FFFFFF,inset_2.46958px_2.46958px_8.23195px_rgba(255,255,255,0.8),inset_-2.46958px_-2.46958px_8.23195px_rgba(0,0,0,0.3)] transition ${
                lightActive ? lightOn : lightOf
              }`}
            />
          </div>
          <div className="relative h-[549px] w-[365px]">
            <RenderTarget target={target} />
            <Light
              className="-top-24 right-0 left-0 z-0"
              isOn={lightActive}
              lightColor={PIECES.find((pice) => pice.id === target)?.color}
            />
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
            {puzzlePieces.current.map((piece) => (
              <SwiperSlide
                onClick={handleSelectLight}
                data-id={piece.id}
                className="w-full rounded-xl border-2 bg-white transition-colors hover:border-gray-300"
                key={`swiper-${piece.id}`}
              >
                {renderSwiperPiece(piece)}
                <ActiveLight
                  isOn={piece.id === target}
                  className="top-0 right-0 bottom-0 left-0"
                  lightColor={piece.color}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

interface LightProps {
  isOn?: boolean;
  lightColor?: keyof typeof colorMap;
  intensity?: number;
  className?: string;
}

const Light: React.FC<LightProps> = ({
  isOn = false,
  lightColor = 'white',
  intensity = 5,
  className,
}) => {
  // Нормализуем интенсивность от 0 до 10
  const normalizedIntensity = Math.max(10, Math.min(10, intensity));

  const { rgb } = colorMap[lightColor] || colorMap.white;

  // Если свет выключен, не показываем эффект освещения
  if (!isOn) {
    return <div className={className} />;
  }

  // Рассчитываем параметры освещения на основе интенсивности
  const opacity = 0.15 + normalizedIntensity * 0.06; // от 0.15 до 0.75
  const blurSize = 8 + normalizedIntensity * 4; // от 8px до 48px
  const glowSize = 130 + normalizedIntensity * 20; // от 30px до 230px

  return (
    <div
      className={clsx(
        'absolute h-full w-full transition-all duration-200',
        className,
      )}
    >
      {/* Основное свечение вокруг лампы - равномерное во все стороны */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
        style={{
          width: `${glowSize}px`,
          height: `${glowSize}px`,
          background: `radial-gradient(circle, 
                      rgba(${rgb}, ${opacity * 1.3}) 0%, 
                      rgba(${rgb}, ${opacity * 0.6}) 40%, 
                      rgba(${rgb}, ${opacity * 0.2}) 70%, 
                      rgba(${rgb}, 0) 100%)`,
          filter: `blur(${blurSize}px)`,
          transition: 'all 0.2s ease',
        }}
      />

      {/* Легкий эффект на потолке - более мягкое свечение вверх */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 transform rounded-full"
        style={{
          width: `${glowSize * 3}px`,
          height: `${glowSize * 0.7}px`,
          background: `radial-gradient(ellipse at center, 
                      rgba(${rgb}, ${opacity * 0.5}) 0%, 
                      rgba(${rgb}, 0) 70%)`,
          filter: `blur(${blurSize * 1.5}px)`,
          transition: 'all 0.2s ease',
        }}
      />

      {/* Более интенсивное освещение пола - направленный свет вниз */}
      <div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 transform rounded-full"
        style={{
          width: `${glowSize * 1.5}px`,
          height: `${glowSize * 0.4}px`,
          background: `radial-gradient(ellipse at center, 
                      rgba(${rgb}, ${opacity * 0.9}) 0%, 
                      rgba(${rgb}, ${opacity * 0.4}) 50%, 
                      rgba(${rgb}, 0) 85%)`,
          filter: `blur(${blurSize * 3}px)`,
          transition: 'all 0.2s ease',
        }}
      />

      {/* Эффект отражения на стенах - боковое свечение */}
      <div
        className="absolute top-1/2 -left-40 -translate-y-1/2 transform rounded-full"
        style={{
          width: `${glowSize * 0.8}px`,
          height: `${glowSize * 3}px`,
          background: `radial-gradient(ellipse at left, 
                      rgba(${rgb}, ${opacity * 0.4}) 0%, 
                      rgba(${rgb}, 0) 80%)`,
          filter: `blur(${blurSize * 1.5}px)`,
          transition: 'all 0.2s ease',
        }}
      />

      <div
        className="absolute top-1/2 -right-40 -translate-y-1/2 transform rounded-full"
        style={{
          width: `${glowSize * 0.8}px`,
          height: `${glowSize * 3}px`,
          background: `radial-gradient(ellipse at right, 
                      rgba(${rgb}, ${opacity * 0.4}) 0%, 
                      rgba(${rgb}, 0) 80%)`,
          filter: `blur(${blurSize * 1.5}px)`,
          transition: 'all 0.2s ease',
        }}
      />
    </div>
  );
};

interface ActiveLightProps {
  isOn?: boolean;
  lightColor: keyof typeof colorMap;
  intensity?: number;
  className?: string;
}

const ActiveLight: React.FC<ActiveLightProps> = ({
  isOn = false,
  lightColor = 'yellow',
  intensity = 5,
  className,
}) => {
  // Если свет выключен, не показываем эффект
  if (!isOn) {
    return <div className={className} />;
  }

  // Нормализуем интенсивность от 0 до 10
  const normalizedIntensity = Math.max(0, Math.min(10, intensity));

  // Получаем RGB значение цвета
  const { rgb } = colorMap[lightColor] || colorMap.yellow;

  // Рассчитываем параметры эффекта на основе интенсивности
  const opacity = 0.1 + normalizedIntensity * 0.05; // от 0.1 до 0.6
  const blurSize = 15 + normalizedIntensity * 5; // от 15px до 65px

  return (
    <div className={clsx('absolute', className)}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: `rgba(${rgb}, ${opacity})`,
          boxShadow: `0 0 ${blurSize}px ${blurSize}px rgba(${rgb}, ${opacity})`,
          filter: `blur(${blurSize / 3}px)`,
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  );
};

export default ActiveLight;
