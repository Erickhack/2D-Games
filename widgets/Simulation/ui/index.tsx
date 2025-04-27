import Button from 'shared/buttons/ui/Button';
import { ResetSVG } from 'shared/svgs/ui/reset';
import { Puzl } from './puzl';
import { useRef, type RefObject } from 'react';
import Tractor from './tractor';
import { Radio } from './Radio';
import { LightBulb } from './LightBulb';
import { Puzzle } from './Puzzle';

interface BaseProps {
  title: string;
  description: string;
  simulation: 'puzl' | 'tractor' | 'radio' | 'light-bulb';
}

interface PuzlProps extends BaseProps {
  simulation: 'puzl';
  puzlPathPage: string;
  PIECE_SIZES: { width: number; height: number }[];
  CORRECT_POSITIONS: { x: number; y: number }[];
  preinstalledPieces?: number[];
  afterinstalledPieces?: number[];
}

interface TractorProps extends BaseProps {
  simulation: 'tractor';
  puzlPathPage?: undefined;
}

interface RadioProps extends BaseProps {
  simulation: 'radio';
}

interface LightBulbProps extends BaseProps {
  simulation: 'light-bulb';
}

type IProps = PuzlProps | TractorProps | RadioProps | LightBulbProps;

const SwitcherSimulation = ({
  props,
  restoreRef,
}: {
  props: IProps;
  restoreRef: RefObject<(() => void | null) | null>;
}) => {
  switch (props.simulation) {
    case 'puzl':
      return (
        <Puzzle
          restoreRef={restoreRef}
          pagePath={props.puzlPathPage}
          CORRECT_POSITIONS={props.CORRECT_POSITIONS}
          PIECE_SIZES={props.PIECE_SIZES}
          PREINSTALLED_PIECES={props.preinstalledPieces}
          AFTERFINISH_PIECES={props.afterinstalledPieces}
        />
      );
    case 'tractor':
      return <Tractor restoreRef={restoreRef} />;
    case 'radio':
      return <Radio />;
    case 'light-bulb':
      return <LightBulb />;
  }
};

export const Simulation = (props: IProps) => {
  const restoreRef = useRef<() => void | null>(null);

  const handleRestoreSimulation = () => {
    if (restoreRef.current) restoreRef.current();
  };

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex justify-between">
        <h1 className="text-5xl font-semibold text-[#1B1A22]">{props.title}</h1>
        <Button
          className="gap-3 rounded-[18px] bg-white px-6 py-3.5 font-medium"
          onClick={handleRestoreSimulation}
        >
          <ResetSVG />
          <span className="text-[#1B1A22]">Перезапустить</span>
        </Button>
      </div>

      <div>
        <span className="text-[20px]/[130%] text-[#1B1A22]">{props.description}</span>
      </div>

      <SwitcherSimulation props={props} restoreRef={restoreRef} />
    </div>
  );
};
