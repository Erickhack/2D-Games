import { Simulation } from 'widgets/Simulation/ui';
import {
  descriptoinOfSimulation1,
  descriptoinOfSimulation2,
} from '../model/texts';

interface IProps {
  puzlSourcePath: string;
  PIECE_SIZES: { width: number; height: number }[];
  CORRECT_POSITIONS: { x: number; y: number }[];
}

export default function LightBulbSimulationPage(props: IProps) {
  return (
    <section className="flex flex-col justify-center gap-11 p-5 pt-16 pb-4">
      <div>
        <Simulation
          title="1. Пазл"
          description={descriptoinOfSimulation1}
          simulation="puzl"
          puzlPathPage={props.puzlSourcePath}
          CORRECT_POSITIONS={props.CORRECT_POSITIONS}
          PIECE_SIZES={props.PIECE_SIZES}
        />
      </div>
      <div>
        <Simulation
          title="2. Симуляция"
          description={descriptoinOfSimulation2}
          simulation="light-bulb"
        />
      </div>
    </section>
  );
}
