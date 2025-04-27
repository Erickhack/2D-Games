// widgets/Simulation/ui/Puzzle/index.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { PuzzleCanvas } from './PuzzleCanvas';
import { PuzzleSwiper } from './PuzzleSwiper';
import { PuzzleHintPanel } from './PuzzleHintPanel';
import { PuzzleStats } from './PuzzleStats';
import type { PuzzleProps, PuzzlePiece } from '../../model/types/puzzle.types';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  HINT_DURATION,
  SNAP_THRESHOLD,
} from '../../model/constants/puzzle.constants';
import { usePuzzlePhysics } from '../../lib/hooks/usePuzzlePhysics';
import { Vec2 } from 'planck-js';
import type { Body } from 'planck';
import { createInitialPieces } from 'widgets/Simulation/lib/utils/puzzleUtils';

export const Puzzle: React.FC<PuzzleProps> = ({
  pagePath,
  restoreRef,
  PIECE_SIZES,
  CORRECT_POSITIONS,
  PREINSTALLED_PIECES = [],
  AFTERFINISH_PIECES = [],
}) => {
  // Состояния
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>(
    createInitialPieces({
      CORRECT_POSITIONS,
      pagePath,
      PIECE_SIZES,
      PREINSTALLED_PIECES,
      AFTERFINISH_PIECES,
    }),
  );
  const puzzlePieceLength = useRef(
    puzzlePieces.length - PREINSTALLED_PIECES.length - AFTERFINISH_PIECES.length,
  );

  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(true);
  const [activeHint, setActiveHint] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState<boolean>(false);
  const [hintMessage, setHintMessage] = useState<string>('');
  const [showHintPanel, setShowHintPanel] = useState<boolean>(false);

  // Используем хуки
  const {
    worldRef,
    bodiesRef,
    canvasRef,
    animationRef,
    initPhysicsWorld,
    createBodyForPiece,
    cleanupPhysicsWorld,
    clampPosition,
  } = usePuzzlePhysics();

  // Refs
  const swiperRef = useRef<SwiperType | null>(null);

  // Обновление фильтрации для swiperPieces
  const swiperPieces = puzzlePieces.filter((piece) => piece.inSwiper);

  // Инициализация физического мира
  useEffect(() => {
    initPhysicsWorld(PIECE_SIZES);

    // Сброс статистики
    setCompletedCount(0);
    setHintsUsed(0);
    setPuzzleCompleted(false);
    setShowHintPanel(false);

    // Привязка функции сброса к внешнему ref
    if (restoreRef) {
      restoreRef.current = resetPuzzle;
    }

    // Функция очистки при размонтировании
    return () => {
      cleanupPhysicsWorld();
    };
  }, []);

  // Проверка завершения пазла
  useEffect(() => {
    if (
      completedCount === puzzlePieceLength.current &&
      puzzlePieceLength.current > 0 &&
      !puzzleCompleted
    ) {
      setPuzzleCompleted(true);

      setTimeout(() => {
        const message = getCompletionMessage();
        setHintMessage(message);
        setShowHintPanel(true);
      }, 500);
    }
  }, [completedCount, puzzlePieceLength.current, puzzleCompleted]);

  // Обновление позиций кусочков пазла на основе физики
  const updatePiecePositions = useCallback(() => {
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
  }, [bodiesRef]);

  // Запуск физической симуляции
  useEffect(() => {
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

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [worldRef, updatePiecePositions, animationRef]);

  // Получение сообщения о завершении
  const getCompletionMessage = useCallback((): string => {
    let rating = '';
    if (hintsUsed === 0) {
      rating = 'Отлично! Вы справились без подсказок!';
    } else if (hintsUsed <= 3) {
      rating = 'Хороший результат! Вы использовали минимум подсказок.';
    } else {
      rating = 'Неплохо! В следующий раз попробуйте использовать меньше подсказок.';
    }

    return `Пазл собран! Использовано подсказок: ${hintsUsed}. ${rating}`;
  }, [hintsUsed]);

  // Обработчик начала перетаскивания с canvas
  const handleCanvasPieceMouseDown = useCallback(
    (e: React.MouseEvent, pieceId: number): void => {
      e.stopPropagation();
      const piece = puzzlePieces.find((p) => p.id === pieceId);
      if (!piece || piece.placed || piece.inSwiper || PREINSTALLED_PIECES.includes(pieceId)) return;

      setDraggingPiece(pieceId);

      const body = bodiesRef.current[pieceId];
      if (body) {
        body.setType('kinematic');
        body.setLinearVelocity(Vec2(0, 0));
        body.setAngularVelocity(0);
      }
    },
    [puzzlePieces, bodiesRef, PREINSTALLED_PIECES],
  );

  // Обработчик перетаскивания
  const handleMouseMove = useCallback(
    (e: React.MouseEvent): void => {
      if (draggingPiece === null) return;

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const piece = puzzlePieces.find((p) => p.id === draggingPiece);
        if (piece) {
          // Ограничиваем позицию в пределах canvas
          const clampedPosition = clampPosition(x, y, piece.width, piece.height);

          // Обновляем позицию тела
          const body = bodiesRef.current[draggingPiece];
          if (body) {
            body.setPosition(clampedPosition);
          }
        }
      }
    },
    [draggingPiece, puzzlePieces, canvasRef, clampPosition, bodiesRef],
  );

  // Размещение кусочка в правильной позиции
  const placePieceCorrectly = useCallback((piece: PuzzlePiece, body: Body): void => {
    body.setPosition(Vec2(piece.correctX, piece.correctY));
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
  }, []);

  // Обработчик окончания перетаскивания
  const handleMouseUp = useCallback((): void => {
    if (draggingPiece === null) return;

    const piece = puzzlePieces.find((p) => p.id === draggingPiece);
    const body = bodiesRef.current[draggingPiece];

    if (piece && body) {
      const position = body.getPosition();
      const distanceToCorrect = Math.sqrt(
        Math.pow(position.x - piece.correctX, 2) + Math.pow(position.y - piece.correctY, 2),
      );

      if (distanceToCorrect < SNAP_THRESHOLD) {
        // Кусочек находится близко к правильной позиции
        placePieceCorrectly(piece, body);
      } else {
        // Удаляем физическое тело
        if (worldRef.current) {
          worldRef.current.destroyBody(body);
          delete bodiesRef.current[draggingPiece];
        }

        // Анимируем возврат кусочка в Swiper
        setPuzzlePieces((prevPieces) =>
          prevPieces.map((p) =>
            p.id === piece.id
              ? {
                  ...p,
                  x: position.x,
                  y: position.y,
                  inSwiper: true,
                  returning: true,
                }
              : p,
          ),
        );

        // Через небольшую задержку завершаем анимацию
        setTimeout(() => {
          setPuzzlePieces((prevPieces) =>
            prevPieces.map((p) =>
              p.id === piece.id
                ? {
                    ...p,
                    returning: false,
                  }
                : p,
            ),
          );
        }, 500);
      }
    }

    setDraggingPiece(null);
  }, [draggingPiece, puzzlePieces, bodiesRef, worldRef, placePieceCorrectly]);

  // Функция сброса пазла
  const resetPuzzle = useCallback((): void => {
    // Сброс состояний
    setCompletedCount(0);
    setHintsUsed(0);
    setActiveHint(null);
    setPuzzleCompleted(false);
    setShowHintPanel(false);

    // Удаляем все физические тела
    Object.values(bodiesRef.current).forEach((body) => {
      if (worldRef.current) {
        worldRef.current.destroyBody(body);
      }
    });
    bodiesRef.current = {};

    // Сброс позиций кусочков
    setPuzzlePieces(
      createInitialPieces({
        CORRECT_POSITIONS,
        pagePath,
        PIECE_SIZES,
        PREINSTALLED_PIECES,
        AFTERFINISH_PIECES,
      }),
    );
  }, [bodiesRef, worldRef]);

  // Функция для показа подсказки для конкретного кусочка
  const showHintForPiece = useCallback(
    (pieceId: number): void => {
      if (PREINSTALLED_PIECES.includes(pieceId)) return;
      // Если подсказка уже активна для этого кусочка, скрываем ее
      if (activeHint === pieceId) {
        setActiveHint(null);
        setShowHintPanel(false);
        return;
      }

      // Активируем подсказку для выбранного кусочка
      setActiveHint(pieceId);

      // Находим кусочек
      const piece = puzzlePieces.find((p) => p.id === pieceId);

      if (piece) {
        // Если кусочек в слайдере, прокручиваем слайдер к нему
        if (piece.inSwiper && swiperRef.current) {
          // Находим индекс слайда с этим кусочком
          const slideIndex = swiperPieces.findIndex((p) => p.id === piece.id);
          if (slideIndex !== -1) {
            // Вместо простого slideTo используем более надежный метод
            scrollToSlide(slideIndex);

            // Показываем сообщение подсказки
            setHintMessage(
              `Найдите этот деталь в слайдере справа и перетащите его на подсвеченное место`,
            );
          }
        } else {
          // Если кусочек уже на холсте
          setHintMessage(`Перетащите выделенный кусочек на подсвеченное место`);
        }

        // Показываем панель подсказок
        setShowHintPanel(true);
      }

      // Увеличиваем счетчик использованных подсказок
      if (!piece?.placed) {
        setHintsUsed((prev) => prev + 1);
      }

      // Автоматически скрываем подсказку через заданное время
      setTimeout(() => {
        setActiveHint((prev) => (prev === pieceId ? null : prev));
        setShowHintPanel(false);
      }, HINT_DURATION);
    },
    [activeHint, puzzlePieces, swiperPieces, PREINSTALLED_PIECES],
  );

  // Функция для прокрутки свайпера к определенному слайду
  const scrollToSlide = useCallback(
    (targetIndex: number) => {
      if (!swiperRef.current) return;

      const swiper = swiperRef.current;

      // Получаем текущий активный индекс
      const currentIndex = swiper.activeIndex;

      // Получаем общее количество слайдов
      const totalSlides = swiperPieces.length;

      // Получаем количество видимых слайдов
      const slidesPerView = 3;

      // Рассчитываем оптимальный индекс для прокрутки
      let optimalIndex = targetIndex;

      // Если целевой индекс находится в пределах текущего видимого окна, не прокручиваем
      const isVisible = targetIndex >= currentIndex && targetIndex < currentIndex + slidesPerView;

      if (!isVisible) {
        // Если целевой индекс ниже текущего видимого окна
        if (targetIndex >= currentIndex + slidesPerView) {
          // Прокручиваем так, чтобы целевой слайд был вверху видимой области
          optimalIndex = Math.min(targetIndex, totalSlides - slidesPerView);
        }
        // Если целевой индекс выше текущего видимого окна
        else if (targetIndex < currentIndex) {
          // Прокручиваем так, чтобы целевой слайд был внизу видимой области
          optimalIndex = Math.max(targetIndex - slidesPerView + 1, 0);
        }
      }

      // Прокручиваем к оптимальному индексу
      swiper.slideTo(optimalIndex, 300);

      // Добавляем выделение для целевого слайда
      setTimeout(() => {
        const slides = document.querySelectorAll('.swiper-slide');
        slides.forEach((slide, index) => {
          if (index === targetIndex) {
            // Используем класс из глобального CSS
            slide.classList.add('highlight-slide');

            // Удаляем класс через некоторое время
            setTimeout(() => {
              slide.classList.remove('highlight-slide');
            }, HINT_DURATION - 500);
          }
        });
      }, 350);
    },
    [swiperRef, swiperPieces.length],
  );

  // Обработчик для кусочков в Swiper
  const handleSwiperPieceMouseDown = useCallback(
    (e: React.MouseEvent, pieceId: number): void => {
      e.preventDefault();
      e.stopPropagation();

      const piece = puzzlePieces.find((p) => p.id === pieceId);
      if (!piece || piece.placed) return;

      // Получаем позицию курсора относительно canvas
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Ограничиваем позицию в пределах canvas
        const clampedPosition = clampPosition(x, y, piece.width, piece.height);

        // Создаем физическое тело для кусочка сразу в позиции курсора
        const body = createBodyForPiece(piece, clampedPosition.x, clampedPosition.y);

        // Обновляем состояние кусочка
        setPuzzlePieces((prevPieces) =>
          prevPieces.map((p) =>
            p.id === pieceId
              ? {
                  ...p,
                  x: clampedPosition.x,
                  y: clampedPosition.y,
                  inSwiper: false,
                }
              : p,
          ),
        );

        // Начинаем перетаскивание сразу после создания
        setDraggingPiece(pieceId);
        body.setType('kinematic');
      }
    },
    [puzzlePieces, canvasRef, clampPosition, createBodyForPiece, PREINSTALLED_PIECES],
  );

  // Показ подсказки
  const showHint = useCallback(() => {
    const unplacedPiece = puzzlePieces.find(
      (p) => !p.placed && !PREINSTALLED_PIECES.includes(p.id),
    );
    if (unplacedPiece) {
      showHintForPiece(unplacedPiece.id);
    }
  }, [puzzlePieces, showHintForPiece, PREINSTALLED_PIECES]);

  return (
    <div
      className="flex flex-col items-center justify-center pt-8 pb-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
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
        {/* Canvas с кусочками пазла */}
        <PuzzleCanvas
          puzzlePieces={puzzlePieces}
          activeHint={activeHint}
          draggingPiece={draggingPiece}
          pagePath={pagePath}
          handleCanvasPieceMouseDown={handleCanvasPieceMouseDown}
          showHintForPiece={showHintForPiece}
          showHints={showHints}
          preinstalledPieces={PREINSTALLED_PIECES}
          puzzleCompleted={puzzleCompleted}
        />

        {/* Статистика */}
        <PuzzleStats
          completedCount={completedCount}
          totalPieces={puzzlePieceLength.current - PREINSTALLED_PIECES.length}
          onShowHint={showHint}
        />

        {/* Swiper с кусочками */}
        <PuzzleSwiper
          swiperPieces={swiperPieces}
          activeHint={activeHint}
          swiperRef={swiperRef}
          handleSwiperPieceMouseDown={handleSwiperPieceMouseDown}
        />

        {/* Панель подсказок */}
        <PuzzleHintPanel
          showHintPanel={showHintPanel}
          hintMessage={hintMessage}
          puzzleCompleted={puzzleCompleted}
          onClose={() => setShowHintPanel(false)}
          onReset={resetPuzzle}
        />
      </div>
    </div>
  );
};
