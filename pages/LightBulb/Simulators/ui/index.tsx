import { Simulation } from 'widgets/Simulation/ui';
import {
  descriptoinOfSimulation1,
  descriptoinOfSimulation2,
  section1,
  section10,
  section2,
  section3,
  section4,
  section5,
  section6,
  section7,
  section8,
  section9,
} from '../model/texts';
import { Paragrapg } from 'widgets/Paragpaph';

const CORRECT_POSITIONS = [
  { x: 1400 / 2 + 141, y: 532 },
  { x: 1400 / 2, y: 555 },
  { x: 1400 / 2 + 13, y: 223 },
  { x: 1400 / 2 + 41, y: 396 },
  { x: 1400 / 2 + 13, y: 267 },
  { x: 1400 / 2 - 131, y: 500 },
  { x: 1400 / 2 + 12, y: 201 },
  { x: 1400 / 2 + 12, y: 269 },
];

const PIECE_SIZES = [
  { width: 217, height: 64 },
  { width: 1400, height: 60 },
  { width: 252, height: 252 },
  { width: 44, height: 209 },
  { width: 252, height: 341, scale: 0.3 },
  { width: 237, height: 126 },
  { width: 57, height: 19 },
  { width: 83, height: 174 },
];

export default function LightBulbSimulationPage() {
  return (
    <section className="flex flex-col justify-center gap-11 pt-16 pb-[320px]">
      <Simulation
        title="1. Интерактивное задание"
        description={descriptoinOfSimulation1}
        simulation="puzl"
        puzlPathPage="light-bulb"
        CORRECT_POSITIONS={CORRECT_POSITIONS}
        PIECE_SIZES={PIECE_SIZES}
        preinstalledPieces={[1]}
        afterinstalledPieces={[2]}
      />

      <Paragrapg
        sections={[
          { id: 1, text: section1 },
          { id: 2, text: section2 },
          { id: 3, text: section3 },
          { id: 4, text: section4 },
          { id: 5, text: section5 },
          { id: 6, text: section6 },
          { id: 7, text: section7 },
          { id: 8, text: section8 },
          { id: 9, text: section9 },
        ]}
      />

      <Simulation
        title="2. Интерактивная симуляция"
        description={descriptoinOfSimulation2}
        simulation="light-bulb"
      />

      <Paragrapg sections={[{ id: 1, text: section10 }]} />
    </section>
  );
}
