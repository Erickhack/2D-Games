import { Simulation } from 'widgets/Simulation/ui';
import {
  descriptoinOfSimulation1,
  descriptoinOfSimulation2,
  section1,
  section2,
  section3,
  section6,
  section7,
} from '../model/texts';
import Paragrapg from 'widgets/Paragpaph/ui';
import { If } from 'shared/components/if/ui';
import { useEffect, useState } from 'react';

const CORRECT_POSITIONS = [
  { x: 600, y: 510 },
  { x: 665, y: 326 },
  { x: 465, y: 336 },
  { x: 600, y: 430 },
  { x: 869, y: 480 },
];

const PIECE_SIZES = [
  { width: 500, height: 106 },
  { width: 288, height: 215 },
  { width: 123, height: 145 },
  { width: 532, height: 89 },
  { width: 31, height: 104 },
];

export default function TractorSimulationPage() {
  const [screenSize, setScreenSize] = useState<number | null>(null);

  const handleResize = () => setScreenSize(window.innerWidth);

  useEffect(() => {
    setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="md-simulations flex flex-col justify-center gap-11 pb-[320px]">
      <If conditional={screenSize !== null && screenSize >= 1400}>
        <Simulation
          title="Интерактивная задача:"
          description={descriptoinOfSimulation1}
          simulation="puzl"
          puzlPathPage="tractor"
          CORRECT_POSITIONS={CORRECT_POSITIONS}
          PIECE_SIZES={PIECE_SIZES}
        />
      </If>

      <div className="md-paragraph">
        <Paragrapg
          sections={[
            { id: 1, text: section6 },
            {
              id: 2,
              image: {
                source: '/tractor/history/schema.png',
                text: 'Чертеж устройства гусеничного хода. Современный рисунок',
              },
            },
            { id: 3, text: section7 },
          ]}
        />
      </div>

      <div>
        <Paragrapg
          sections={[
            { id: 1, text: section1 },
            { id: 2, text: section2 },
            { id: 3, text: section3 },
          ]}
        />
      </div>

      <If conditional={screenSize !== null && screenSize >= 1400}>
        <Simulation
          title="Интерактивное исследование:"
          description={descriptoinOfSimulation2}
          simulation="tractor"
        />
      </If>
    </section>
  );
}
