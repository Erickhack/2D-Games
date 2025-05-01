import { Simulation } from 'widgets/Simulation/ui';
import {
  descriptoinOfSimulation1,
  descriptoinOfSimulation2,
  section1,
  section2,
  section3,
} from '../model/texts';
import Paragrapg from 'widgets/Paragpaph/ui';

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
  return (
    <section className="flex flex-col justify-center gap-11 pt-16 pb-[320px]">
      <Simulation
        title="Интерактивная задача:"
        description={descriptoinOfSimulation1}
        simulation="puzl"
        puzlPathPage="tractor"
        CORRECT_POSITIONS={CORRECT_POSITIONS}
        PIECE_SIZES={PIECE_SIZES}
      />

      <Paragrapg
        sections={[
          { id: 1, text: section1 },
          { id: 2, text: section2 },
          { id: 3, text: section3 },
        ]}
      />

      <Simulation
        title="Интерактивное исследование:"
        description={descriptoinOfSimulation2}
        simulation="tractor"
      />
    </section>
  );
}
