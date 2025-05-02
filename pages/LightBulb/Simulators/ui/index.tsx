import { Simulation } from 'widgets/Simulation/ui';
import {
  descriptoinOfSimulation1,
  descriptoinOfSimulation2,
  section1,
  section10,
  section11,
  section12,
  section13,
  section14,
  section15,
  section16,
  section17,
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
import { useResize } from 'feature/hooks';
import { If } from 'shared/components/if/ui';

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
  const screenSize = useResize();

  return (
    <section className="md-simulations flex flex-col justify-center gap-11 pb-[320px]">
      <div className="md-paragraph">
        <Paragrapg
          sections={[
            { id: 1, text: section11 },
            { id: 2, text: section12 },
            {
              id: 4,
              image: {
                source: '/light-bulb/history/schema.jpg',
                text: `например, схематичное сравнение "электрической свечи", лампы накаливания и современной LED-лампы. Это поможет визуально подчеркнуть эволюцию технологии.`,
              },
            },
            { id: 5, text: section13 },
            { id: 6, text: section14 },
            { id: 7, text: section15 },
            { id: 8, text: section16 },
            { id: 9, text: section17 },
          ]}
        />
      </div>

      <If conditional={screenSize !== null && screenSize >= 1400}>
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
      </If>

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
      <If conditional={screenSize !== null && screenSize >= 1400}>
        <Simulation
          title="2. Интерактивная симуляция"
          description={descriptoinOfSimulation2}
          simulation="light-bulb"
        />
      </If>

      <Paragrapg sections={[{ id: 1, text: section10 }]} />
    </section>
  );
}
