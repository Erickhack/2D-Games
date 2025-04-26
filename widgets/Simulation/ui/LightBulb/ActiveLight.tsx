import { colorMap } from '../../model/lightBulb';
import clsx from 'clsx';

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
