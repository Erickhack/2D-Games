import { Edge, World, Vec2, Box, Body } from 'planck';
import { useState, useEffect, useRef, type RefObject } from 'react';
// Импортируем Swiper и необходимые модули
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
// Импортируем стили Swiper
import 'swiper/css';
import { ArrDown } from 'shared/svgs/ui/puzl/ArrDown';
import { ArrUp } from 'shared/svgs/ui/puzl/ArrUp';
import Button from 'shared/buttons/ui/Button';

// Определение типов
interface PuzzlePiece {
  id: number;
  src: string;
  correctX: number;
  correctY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  placed: boolean;
  inSwiper: boolean;
}

interface BodyUserData {
  id: number;
}

// Константы
const CANVAS_WIDTH = 1400;
const CANVAS_HEIGHT = 663;
const SNAP_THRESHOLD = 50;
const HINT_DURATION = 3000;
const SWIPER_HEIGHT = CANVAS_HEIGHT / 1.2;
const SWIPER_Y_POSITION = 50;

// Правильные позиции для кусочков пазла
const CORRECT_POSITIONS = [
  { x: 600, y: 510 },
  { x: 665, y: 326 },
  { x: 465, y: 336 },
  { x: 600, y: 430 },
  { x: 869, y: 480 },
];

// Размеры кусочков пазла
const PIECE_SIZES = [
  { width: 500, height: 106 },
  { width: 288, height: 215 },
  { width: 123, height: 145 },
  { width: 532, height: 89 },
  { width: 31, height: 104 },
];

interface IProps {
  restoreRef: RefObject<(() => void | null) | null>;
}

export const Puzl = (props: IProps) => {
  // Создаем начальное состояние кусочков пазла
  const createInitialPieces = (): PuzzlePiece[] => {
    return PIECE_SIZES.map((size, index) => ({
      id: index + 1,
      src: `puzl/pieces/piece${index + 1}.svg`,
      correctX: CORRECT_POSITIONS[index].x,
      correctY: CORRECT_POSITIONS[index].y,
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      placed: false,
      inSwiper: true,
    }));
  };

  // Состояния
  const [puzzlePieces, setPuzzlePieces] =
    useState<PuzzlePiece[]>(createInitialPieces);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(true);
  const [activeHint, setActiveHint] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  // Refs
  const worldRef = useRef<World | null>(null);
  const bodiesRef = useRef<Record<number, Body>>({});
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // Инициализация физического мира
  useEffect(() => {
    initPhysicsWorld();
    props.restoreRef.current = resetPuzzle;
    return cleanupPhysicsWorld;
  }, []);

  // Функция инициализации физического мира
  const initPhysicsWorld = (): void => {
    worldRef.current = new World();

    createBoundaries();
    startSimulation();
  };

  // Создание границ игрового поля
  const createBoundaries = (): void => {
    if (!worldRef.current) return;

    // Нижняя граница
    const ground = worldRef.current.createBody({
      type: 'static',
      position: new Vec2(0, CANVAS_HEIGHT),
    });
    ground.createFixture({
      shape: new Edge(Vec2(-CANVAS_WIDTH, 0), Vec2(CANVAS_WIDTH, 0)),
      friction: 0.3,
    });

    // Левая стена
    const leftWall = worldRef.current.createBody({
      type: 'static',
      position: new Vec2(0, 0),
    });
    leftWall.createFixture({
      shape: new Edge(new Vec2(0, 0), new Vec2(0, CANVAS_HEIGHT)),
      friction: 0.3,
    });

    // Правая стена
    const rightWall = worldRef.current.createBody({
      type: 'static',
      position: new Vec2(CANVAS_WIDTH, 0),
    });
    rightWall.createFixture({
      shape: new Edge(new Vec2(0, 0), new Vec2(0, CANVAS_HEIGHT)),
      friction: 0.3,
    });
  };

  // Создание физического тела для кусочка пазла
  const createBodyForPiece = (
    piece: PuzzlePiece,
    x: number,
    y: number,
  ): Body => {
    if (!worldRef.current) throw new Error('Physics world not initialized');

    const body = worldRef.current.createBody({
      type: 'dynamic',
      position: new Vec2(x, y),
      linearDamping: 0.5,
      angularDamping: 0.5,
    });

    body.createFixture({
      shape: new Box(piece.width / 2, piece.height / 2),
      density: 1.0,
      friction: 0.3,
      restitution: 0.2,
    });

    body.setUserData({ id: piece.id } as BodyUserData);
    bodiesRef.current[piece.id] = body;

    return body;
  };

  // Очистка физического мира при размонтировании
  const cleanupPhysicsWorld = (): void => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    worldRef.current = null;
    bodiesRef.current = {};
  };

  // Функция запуска физической симуляции
  const startSimulation = (): void => {
    const timeStep = 1 / 60;
    const velocityIterations = 6;
    const positionIterations = 2;

    const step = (): void => {
      if (worldRef.current) {
        worldRef.current.step(timeStep, velocityIterations, positionIterations);
        updatePiecePositions();
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  };

  // Обновление позиций кусочков пазла на основе физики
  const updatePiecePositions = (): void => {
    setPuzzlePieces((prevPieces) => {
      return prevPieces.map((piece) => {
        const body = bodiesRef.current[piece.id];
        if (body && !piece.placed && !piece.inSwiper) {
          const position = body.getPosition();
          return {
            ...piece,
            x: position.x,
            y: position.y,
          };
        }
        return piece;
      });
    });
  };

  // Обработчик начала перетаскивания с canvas
  const handleCanvasPieceMouseDown = (
    e: React.MouseEvent,
    pieceId: number,
  ): void => {
    e.stopPropagation();
    const piece = puzzlePieces.find((p) => p.id === pieceId);
    if (!piece || piece.placed || piece.inSwiper) return;

    setDraggingPiece(pieceId);

    const body = bodiesRef.current[pieceId];
    if (body) {
      body.setType('kinematic');
      body.setLinearVelocity(new Vec2(0, 0));
      body.setAngularVelocity(0);
    }
  };

  // Обработчик перетаскивания
  const handleMouseMove = (e: React.MouseEvent): void => {
    if (draggingPiece === null) return;

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Обновляем позицию тела
      const body = bodiesRef.current[draggingPiece];
      if (body) {
        body.setPosition(new Vec2(x, y));
      }
    }
  };

  // Обработчик окончания перетаскивания
  const handleMouseUp = (): void => {
    if (draggingPiece === null) return;

    const piece = puzzlePieces.find((p) => p.id === draggingPiece);
    const body = bodiesRef.current[draggingPiece];

    if (piece && body) {
      const position = body.getPosition();
      const distanceToCorrect = Math.sqrt(
        Math.pow(position.x - piece.correctX, 2) +
          Math.pow(position.y - piece.correctY, 2),
      );

      if (distanceToCorrect < SNAP_THRESHOLD) {
        // Кусочек находится близко к правильной позиции
        placePieceCorrectly(piece, body);
      } else {
        // Возвращаем тип тела к динамическому
        body.setType('dynamic');
      }
    }

    setDraggingPiece(null);
  };

  // Размещение кусочка в правильной позиции
  const placePieceCorrectly = (piece: PuzzlePiece, body: Body): void => {
    body.setPosition(new Vec2(piece.correctX, piece.correctY));
    body.setType('static');

    setPuzzlePieces((prevPieces) =>
      prevPieces.map((p) =>
        p.id === piece.id
          ? {
              ...p,
              x: piece.correctX,
              y: piece.correctY,
              placed: true,
              inSwiper: false,
            }
          : p,
      ),
    );

    setCompletedCount((prev) => prev + 1);
  };

  // Функция сброса пазла
  const resetPuzzle = (): void => {
    // Сброс состояний
    setCompletedCount(0);
    setHintsUsed(0);
    setActiveHint(null);

    // Удаляем все физические тела
    Object.values(bodiesRef.current).forEach((body) => {
      if (worldRef.current) {
        worldRef.current.destroyBody(body);
      }
    });
    bodiesRef.current = {};

    // Сброс позиций кусочков
    setPuzzlePieces(createInitialPieces());
  };

  // Функция для показа подсказки для конкретного кусочка
  const showHintForPiece = (pieceId: number): void => {
    // Если подсказка уже активна для этого кусочка, скрываем ее
    if (activeHint === pieceId) {
      setActiveHint(null);
      return;
    }

    // Активируем подсказку для выбранного кусочка
    setActiveHint(pieceId);

    // Увеличиваем счетчик использованных подсказок
    if (!puzzlePieces.find((p) => p.id === pieceId)?.placed) {
      setHintsUsed((prev) => prev + 1);
    }

    // Автоматически скрываем подсказку через заданное время
    setTimeout(() => {
      setActiveHint((prev) => (prev === pieceId ? null : prev));
    }, HINT_DURATION);
  };

  const renderHint = (piece: PuzzlePiece) => {
    if (piece.placed) return null;

    return (
      <div
        key={`hint-${piece.id}`}
        className={`absolute cursor-pointer ${
          activeHint === piece.id ? 'opacity-70' : 'opacity-30'
        }`}
        style={{
          left: piece.correctX - piece.width / 2,
          top: piece.correctY - piece.height / 2,
          width: piece.width,
          height: piece.height,
          backgroundImage: `url(puzl/hints/piece${piece.id}.svg)`,
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
    if (piece.inSwiper) return null;

    return (
      <div
        key={`canvas-piece-${piece.id}`}
        className={`absolute cursor-grab ${piece.placed ? 'cursor-default' : ''}`}
        style={{
          left: piece.x - piece.width / 2,
          top: piece.y - piece.height / 2,
          width: piece.width,
          height: piece.height,
          backgroundImage: `url(${piece.src})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: piece.placed ? 'all 0.3s ease' : 'none',
          zIndex: draggingPiece === piece.id ? 10 : 1,
          border:
            activeHint === piece.id && !piece.placed
              ? '2px solid #4CAF50'
              : 'none',
        }}
        onMouseDown={(e) => handleCanvasPieceMouseDown(e, piece.id)}
      />
    );
  };

  // Рендеринг кусочка пазла в Swiper
  const renderSwiperPiece = (piece: PuzzlePiece) => {
    if (!piece.inSwiper) return null;

    return (
      <div
        className="flex h-full cursor-grab items-center justify-center"
        style={{ pointerEvents: 'auto' }}
      >
        <div
          style={{
            width: piece.width * 0.4,
            height: piece.height * 0.4,
            backgroundImage: `url(${piece.src})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
    );
  };

  // Новый обработчик клика на элемент в Swiper
  const handleSwiperPieceClick = (
    e: React.MouseEvent,
    pieceId: number,
  ): void => {
    e.stopPropagation();
    const piece = puzzlePieces.find((p) => p.id === pieceId);
    if (!piece || piece.placed) return;

    // Получаем позицию курсора относительно canvas
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Создаем физическое тело для кусочка сразу в позиции курсора
      const body = createBodyForPiece(piece, x, y);

      // Обновляем состояние кусочка
      setPuzzlePieces((prevPieces) =>
        prevPieces.map((p) =>
          p.id === pieceId ? { ...p, x, y, inSwiper: false } : p,
        ),
      );

      // Начинаем перетаскивание сразу после создания
      setDraggingPiece(pieceId);
      body.setType('kinematic');

      // Проверяем, не находится ли кусочек близко к правильной позиции
      const distanceToCorrect = Math.sqrt(
        Math.pow(x - piece.correctX, 2) + Math.pow(y - piece.correctY, 2),
      );

      if (distanceToCorrect < SNAP_THRESHOLD) {
        placePieceCorrectly(piece, body);
        setDraggingPiece(null);
      }
    }
  };

  // Получаем кусочки для Swiper
  const swiperPieces = puzzlePieces.filter((piece) => piece.inSwiper);

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

  return (
    <div
      className="flex flex-col items-center justify-center pt-8 pb-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={canvasRef}
        className="relative rounded-lg"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          overflow: 'hidden',
        }}
      >
        {/* Фоновое изображение */}
        <div className="absolute h-full w-full bg-[url(puzl/backgrounds/cols_rows.png)] bg-contain bg-center bg-no-repeat" />

        <div className="absolute top-6 left-8 rounded-[6px] bg-white px-4 py-1.5">
          <span className="text-[20px]/[130%] text-[#047EFD]">
            Собрано: {completedCount}/{puzzlePieces.length}
          </span>
        </div>

        {/* Вертикальный Swiper с кусочками пазла внутри Canvas */}
        <div
          className="absolute right-5 z-[5] flex w-[209px] flex-col gap-[26px]"
          style={{
            top: SWIPER_Y_POSITION,
            height: SWIPER_HEIGHT,
          }}
        >
          {swiperPieces.length > 0 ? (
            <>
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
                cssMode
                mousewheel={false}
                keyboard={false}
                direction="vertical"
                slidesPerView={3}
                spaceBetween={18}
                pagination={{ clickable: true }}
                className="h-full w-[209px]"
                style={{ pointerEvents: 'auto' }}
              >
                {puzzlePieces.map((piece) => (
                  <SwiperSlide
                    className="w-full rounded-xl border-2 border-[#ffffff33] bg-[#ffffff33] transition-colors hover:border-[#ffffff66]"
                    key={`swiper-${piece.id}`}
                    style={{ pointerEvents: 'auto' }}
                    onClick={(e) => handleSwiperPieceClick(e, piece.id)}
                  >
                    {renderSwiperPiece(piece)}
                  </SwiperSlide>
                ))}
              </Swiper> 
              <Button
                className="rounded-xl border-2 border-[#ffffff33] bg-[#ffffff33] py-3.5"
                onClick={slideNext}
              >
                <ArrDown  />
              </Button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Все кусочки размещены!
            </div>
          )}
        </div>

        {/* Отображение подсказок */}
        {showHints && puzzlePieces.map(renderHint)}

        {/* Кусочки пазла на canvas */}
        {puzzlePieces.map(renderPuzzlePiece)}
      </div>
    </div>
  );
};
