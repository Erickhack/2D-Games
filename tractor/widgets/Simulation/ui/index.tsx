import Button from 'shared/buttons/ui/Button';
import { ResetSVG } from 'shared/svgs/ui/reset';
import { descriptoinOfSimulation1 } from '../model/texts';
import { Puzl } from './puzl';

export const Simulation = () => {
  const handleRestoreSimulation = () => {};

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex justify-between">
        <h1 className="text-5xl font-semibold text-[#1B1A22]">1. Пазл</h1>
        <Button className="gap-3 rounded-[18px] bg-white px-6 py-3.5 font-medium">
          <ResetSVG />
          <span className="text-[#1B1A22]">Перезапустить</span>
        </Button>
      </div>
      <div>
        <span className="text-[20px]/[130%] text-[#1B1A22]">
          {descriptoinOfSimulation1}
        </span>
      </div>

      <Puzl />
    </div>
  );
};
