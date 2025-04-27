import { Simulation } from 'widgets/Simulation/ui';
import { descriptoinOfSimulation1, descriptoinOfSimulation2 } from '../model/texts';

const CORRECT_POSITIONS = [
  { x: 586, y: 325 },
  { x: 665, y: 330 },
  { x: 530, y: 230 },
  { x: 530, y: 475 },
  { x: 762, y: 320 },
  { x: 770, y: 436 },
];

const PIECE_SIZES = [
  { width: 374, height: 136 },
  { width: 517, height: 469, scale: 0.2 },
  { width: 134, height: 152 },
  { width: 134, height: 154 },
  { width: 152, height: 43 },
  { width: 166, height: 192 },
];

export default function RadioSimulatorsPage() {
  return (
    <section className="flex flex-col justify-center gap-11 pt-16 pb-[320px]">
      <div>
        <Simulation
          title="1. Пазл"
          description={descriptoinOfSimulation1}
          simulation="puzl"
          puzlPathPage="radio"
          CORRECT_POSITIONS={CORRECT_POSITIONS}
          PIECE_SIZES={PIECE_SIZES}
        />
      </div>
      <div>
        <Simulation
          title="2. Симуляция"
          description={descriptoinOfSimulation2}
          simulation="radio"
        />
      </div>
    </section>
  );
}
