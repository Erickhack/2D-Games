// widgets/Simulation/lib/hooks/usePuzzleTimer.ts
import { useState, useEffect, useCallback } from 'react';
import type { TimerState } from '../../model/types/puzzle.types';

interface UsePuzzleTimerProps {
  puzzleCompleted: boolean;
}

export const usePuzzleTimer = ({ puzzleCompleted }: UsePuzzleTimerProps) => {
  // Состояния для таймера
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Функция для запуска таймера
  const startTimer = useCallback(() => {
    if (timerStarted) return;

    setStartTime(Date.now());
    setTimerStarted(true);

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    setTimerInterval(interval);
  }, [timerStarted, startTime]);

  // Функция для остановки таймера
  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  // Функция для сброса таймера
  const resetTimer = useCallback(() => {
    stopTimer();
    setTimerStarted(false);
    setElapsedTime(0);
    setStartTime(Date.now());
  }, [stopTimer]);

  // Останавливаем таймер при завершении пазла
  useEffect(() => {
    if (puzzleCompleted && timerStarted) {
      stopTimer();
    }
  }, [puzzleCompleted, timerStarted, stopTimer]);

  // Очищаем интервал при размонтировании
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    timerStarted,
    elapsedTime,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
