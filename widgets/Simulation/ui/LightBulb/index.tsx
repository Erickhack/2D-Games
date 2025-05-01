import React, {
  useEffect,
  useRef,
  useState,
  type EventHandler,
  type MouseEvent,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { colorMap } from '../../model/lightBulb';
import ActiveLight from './ActiveLight';
import Light from './Light';

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
  periodService: number; // срок службы в годах
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
    periodService: 1, // 1 год
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
    periodService: 6, // 6 лет
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
    periodService: 20, // 20 лет
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

  // Добавляем состояния для отслеживания срока службы
  const [elapsedTime, setElapsedTime] = useState(0); // в месяцах
  const [serviceProgress, setServiceProgress] = useState(0); // в процентах
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Функция для обновления прогресса срока службы
  const updateServiceProgress = () => {
    if (target === 0 || !lightActive) return;

    const selectedPiece = PIECES.find((piece) => piece.id === target);
    if (!selectedPiece) return;

    // Преобразуем годы в месяцы для более плавной анимации
    const totalServiceMonths = selectedPiece.periodService * 12;

    // Вычисляем прогресс в процентах
    const progress = Math.min(100, (elapsedTime / totalServiceMonths) * 100);
    setServiceProgress(progress);

    // Если срок службы истек, выключаем лампу
    if (elapsedTime >= totalServiceMonths) {
      setLightActive(false);
      audioOFf.current?.play();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSwitchLight = () => {
    if (target === 0) return;

    setLightActive((prev) => {
      const newState = !prev;

      if (!audioOFf.current && !audioOn.current) return newState;

      if (prev) {
        audioOFf.current?.play();
        // Останавливаем таймер при выключении
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        audioOn.current?.play();
        // Запускаем таймер при включении
        if (!timerRef.current) {
          // Обновляем каждую секунду, но увеличиваем на 1 месяц каждые 3 секунды для демонстрации
          // В реальном приложении можно настроить другую скорость
          timerRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
          }, 1000); // Ускоренная симуляция: 1 месяц = 3 секунды
        }
      }

      return newState;
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

    // Сбрасываем таймер и прогресс при смене лампы
    setElapsedTime(0);
    setServiceProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [target]);

  // Обновляем прогресс при изменении времени
  useEffect(() => {
    updateServiceProgress();
  }, [elapsedTime, target, lightActive]);

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const lightOn = 'translate-x-[calc(100%+20px)]';
  const lightOf = 'translate-x-0';

  // Форматируем оставшееся время для отображения
  const formatRemainingTime = () => {
    const selectedPiece = PIECES.find((piece) => piece.id === target);
    if (!selectedPiece) return '2 месяца';

    const totalServiceMonths = selectedPiece.periodService * 12;
    const remainingMonths = Math.max(0, totalServiceMonths - elapsedTime);

    if (remainingMonths >= 12) {
      const years = Math.floor(remainingMonths / 12);
      const months = remainingMonths % 12;
      return months > 0
        ? `${years} ${getYearText(years)}, ${months} ${getMonthText(months)}`
        : `${years} ${getYearText(years)}`;
    } else {
      return `${remainingMonths} ${getMonthText(remainingMonths)}`;
    }
  };

  // Функции для правильного склонения слов
  const getYearText = (years: number) => {
    if (years === 1) return 'год';
    if (years >= 2 && years <= 4) return 'года';
    return 'лет';
  };

  const getMonthText = (months: number) => {
    if (months === 1) return 'месяц';
    if (months >= 2 && months <= 4) return 'месяца';
    return 'месяцев';
  };

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
        <div className="flex flex-auto flex-col items-center justify-between overflow-hidden rounded-xl bg-white p-[42px]">
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
          <div className="flex w-full flex-col gap-6">
            <h5 className="text-xl font-semibold text-[#0C0C0CCC]">
              Срок службы
            </h5>
            <div
              className={`flex items-center gap-6 ${target ? 'visible' : 'invisible'}`}
            >
              <span className="text-lg font-medium text-[#047EFD]">
                {formatRemainingTime()}
              </span>
              <div
                className="h-1 flex-1"
                style={{
                  background: `linear-gradient(90deg, #047EFD ${100 - serviceProgress}%, #FFFFFF ${Math.max(100 - serviceProgress + 45, 100)}%)`,
                }}
              />
              <span className="text-lg font-medium text-[#0C0C0CCC]">
                {PIECES.find((piece) => piece.id === target)?.periodService}{' '}
                {getYearText(
                  PIECES.find((piece) => piece.id === target)?.periodService ||
                    0,
                )}
              </span>
            </div>
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
