import { Simulation } from 'widgets/Simulation/ui';
import {
  descriptoinOfSimulation1,
  descriptoinOfSimulation2,
  section1,
  section10,
  section11,
  section12,
  section13,
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
  const screenSize = useResize();

  return (
    <section className="md-simulations flex flex-col justify-center gap-11 pb-[320px]">
      <If conditional={screenSize !== null && screenSize >= 1400}>
        <Simulation
          title="1. Интерактивное задание"
          description={descriptoinOfSimulation1}
          simulation="puzl"
          puzlPathPage="radio"
          CORRECT_POSITIONS={CORRECT_POSITIONS}
          PIECE_SIZES={PIECE_SIZES}
        />
      </If>
      <div className="md-paragraph">
        <Paragrapg
          sections={[
            { id: 1, text: section1 },
            { id: 2, text: section2 },
            { id: 3, text: section3 },
            { id: 4, text: section4 },
            { id: 5, text: section5 },
          ]}
        />
      </div>
      <Paragrapg
        sections={[
          { id: 1, text: section6 },
          { id: 2, text: section7 },
          { id: 3, text: section8 },
          { id: 4, text: section9 },
        ]}
      />
      <If conditional={screenSize !== null && screenSize >= 1400}>
        <Simulation
          title="2. Интерактивная симуляция"
          description={descriptoinOfSimulation2}
          simulation="radio"
        />
      </If>
      <Paragrapg
        sections={[
          { id: 1, text: section10 },
          { id: 2, text: section11 },
          { id: 3, text: section12 },
          { id: 4, text: section13 },
        ]}
      />
    </section>
  );
}
