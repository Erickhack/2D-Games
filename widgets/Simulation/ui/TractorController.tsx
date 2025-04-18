import { useState, type FC } from 'react';
import { SwitcheBtn } from 'shared/buttons/ui/SwitcheBtn';

interface IProps {
  switchTransport: (transport: 'normal-car' | 'truck-caterpillar') => void;
  switchTerrain: (terrain: boolean) => void;
}

export const TractorController: FC<IProps> = ({
  switchTransport,
  switchTerrain,
}) => {
  const [active1, setActive1] = useState(true);
  const [active2, setActive2] = useState(true);

  const handleTakeWheel1 = () => {
    setActive1(true);
    switchTransport('normal-car');
  };
  const handleTakeWheel2 = () => {
    setActive1(false);
    switchTransport('truck-caterpillar');
  };

  const handleTakeEdge1 = () => {
    setActive2(true);
    switchTerrain(true);
  };
  const handleTakeEdge2 = () => {
    setActive2(false);
    switchTerrain(false);
  };

  return (
    <div className="absolute top-9 left-8 flex gap-5">
      <div>
        <SwitcheBtn
          span1="Колеса"
          span2="Гусеницы"
          active={active1}
          fn1={handleTakeWheel1}
          fn2={handleTakeWheel2}
        />
      </div>
      <div>
        <SwitcheBtn
          span1="Асфальт"
          span2="Песок"
          active={active2}
          fn1={handleTakeEdge1}
          fn2={handleTakeEdge2}
        />
      </div>
    </div>
  );
};
