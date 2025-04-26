import { colorMap } from '../../model/lightBulb';
import clsx from 'clsx';

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

export default Light;
