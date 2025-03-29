import Button from 'shared/buttons/ui/Button';
import { ResetSVG } from 'shared/svgs/ui/reset';
import { Puzl } from './puzl';
import { useRef } from 'react';

interface IProps {
  title: string;
  description: string;
  simulation: 'puzl' | 'tractor';
}

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
        <span className="text-[20px]/[130%] text-[#1B1A22]">
          {props.description}
        </span>
      </div>

      <Puzl restoreRef={restoreRef} />
    </div>
  );
};
