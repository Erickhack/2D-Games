// widgets/Simulation/ui/Puzzle/index.tsx
import React, { useEffect } from 'react';
import { PuzzleCanvas } from './PuzzleCanvas';
import { PuzzleSwiper } from './PuzzleSwiper';
import { PuzzleHintPanel } from './PuzzleHintPanel';
import { PuzzleStats } from './PuzzleStats';
import { PuzzleTimer } from './PuzzleTimer';
import { PuzzleStartMessage } from './PuzzleStartMessage';
import { usePuzzleState } from '../../lib/hooks/usePuzzleState';
import { usePuzzlePhysics } from '../../lib/hooks/usePuzzlePhysics';
import { usePuzzleDrag } from '../../lib/hooks/usePuzzleDrag';
import { usePuzzleTimer } from '../../lib/hooks/usePuzzleTimer';
import { usePuzzleHints } from '../../lib/hooks/usePuzzleHints';
import type { PuzzleProps } from '../../model/types/puzzle.types';

export const Puzzle: React.FC<PuzzleProps> = ({ onComplete, restoreRef }) => {
  // Используем хуки для управления состоянием пазла
  const {
    puzzlePieces,
    setPuzzlePieces,
    completedCount,
    puzzleCompleted,
    handlePiecePlaced,
    resetPuzzle,
    getSwiperPieces
  } = usePuzzleState();
  
  // Используем хук для работы с физикой
  const {
    worldRef,
    bodiesRef,
    canvasRef,
    createPieceBody,
    updateBodyPosition,
    cleanupPhysicsWorld
  } = usePuzzlePhysics();
  
  // Используем хук для таймера
  const {
    timerStarted,
    elapsedTime,
    startTimer,
    stopTimer,
    resetTimer
  } = usePuzzleTimer({ puzzleCompleted });
  
  // Получаем кусочки для свайпера
  const swiperPieces = getSwiperPieces();
  
  // Реф для свайпера
  const swiperRef = React.useRef<any>(null);
  
  // Функция для прокрутки свайпера к определенному слайду
  const scrollToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };
  
  // Используем хук для подсказок
  const {
    hintsUsed,
    activeHint,
    showHintPanel,
    hintMessage,
    showHint,
    showCompletionMessage,
    resetHints,
    setShowHintPanel
  } = usePuzzleHints({
    puzzlePieces,
    completedCount,
    elapsedTime,
    scrollToSlide
  });
  
  // Используем хук для перетаскивания
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = usePuzzleDrag({
    puzzlePieces,
    setPuzzlePieces,
    updateBodyPosition,
    onPiecePlaced: (pieceId) => {
      // Запускаем таймер при размещении первого кусочка
      if (completedCount === 0 && !timerStarted) {
        startTimer();
      }
      
      // Вызываем обработчик размещения кусочка
      handlePiecePlaced(pieceId);
    }
  });
  
  // Обработчик начала перетаскивания кусочка из свайпера
  const handlePieceDragStart = (pieceId: number) => {
    // Находим кусочек
    const piece = puzzlePieces.find(p => p.id === pieceId);
    if (!piece) return;
    
    // Создаем физическое тело для кусочка, если его еще нет
    if (!bodiesRef.current[pieceId]) {
      createPieceBody(piece);
    }
    
    // Обновляем состояние кусочка
    setPuzzlePieces(prevPieces =>
      prevPieces.map(p =>
        p.id === pieceId
          ? { ...p, inSwiper: false }
          : p
      )
    );
  };
  
  // Полный сброс пазла
  const handleResetPuzzle = () => {
    resetPuzzle();
    resetTimer();
    resetHints();
    cleanupPhysicsWorld();
  };
  
  // Обработчик закрытия панели подсказок
  const handleCloseHintPanel = () => {
    setShowHintPanel(false);
  };
  
  // Привязываем функцию сброса к внешнему ref
  useEffect(() => {
    if (restoreRef) {
      restoreRef.current = handleResetPuzzle;
    }
  }, [restoreRef]);
  
  // Показываем сообщение о завершении пазла
  useEffect(() => {
    if (puzzleCompleted) {
      showCompletionMessage();
      
      // Вызываем колбэк завершения, если он предоставлен
      if (onComplete) {
        onComplete({
          time: elapsedTime,
          hintsUsed
        });
      }
    }
  }, [puzzleCompleted, elapsedTime, hintsUsed, onComplete, showCompletionMessage]);
  
  return (
    <div
      className="flex flex-col items-center justify-center p-8 relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Канвас для пазла */}
      <PuzzleCanvas
        puzzlePieces={puzzlePieces}
        canvasRef={canvasRef}
        activeHint={activeHint}
        handleMouseDown={handleMouseDown}
      />
      
      {/* Свайпер с кусочками */}
      <PuzzleSwiper
        swiperPieces={swiperPieces}
        activeHint={activeHint}
        onPieceDragStart={handlePieceDragStart}
        onSwiperInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      />
      
      {/* Статистика */}
      <PuzzleStats
        completedCount={completedCount}
        totalPieces={puzzlePieces.length}
        hintsUsed={hintsUsed}
        onShowHint={showHint}
        onReset={handleResetPuzzle}
      />
      
      {/* Таймер */}
      <PuzzleTimer
        timerStarted={timerStarted}
        elapsedTime={elapsedTime}
        startTimer={startTimer}
      />
      
      {/* Панель подсказок */}
      <PuzzleHintPanel
        showHintPanel={showHintPanel}
        hintMessage={hintMessage}
        onClose={handleCloseHintPanel}
      />
      
      {/* Сообщение о начале игры */}
      <PuzzleStartMessage
        timerStarted={timerStarted}
        completedCount={completedCount}
        startTimer={startTimer}
      />
    </div>
  );
};