import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export const SwitchBtn = () => {
  const [active, setActive] = useState('history');
  const navigation = useNavigate();

  const handleHistoryBtn = () => {
    setActive('history');
    navigation('history');
  };

  const handleSimulationBtn = () => {
    setActive('simulation');
    navigation('simulation');
  };

  return (
    <div className="relative flex rounded-[20px] bg-[#E8EEF9] p-2">
      <div
        className="absolute top-2 left-2 h-[42px] w-[151px] rounded-xl bg-[#047EFD] transition-transform duration-300"
        style={{
          transform:
            active === 'history' ? 'translateX(0)' : 'translateX(151px)',
        }}
      ></div>

      <button
        className={`z-10 h-[42px] w-[151px] px-[36px] py-2.5 transition-colors duration-300 ${
          active === 'history' ? 'text-white' : 'text-[#047EFD]'
        }`}
        onClick={handleHistoryBtn}
      >
        История
      </button>
      <button
        className={`z-10 h-[42px] w-[151px] px-[36px] py-2.5 transition-colors duration-300 ${
          active === 'simulation' ? 'text-white' : 'text-[#047EFD]'
        }`}
        onClick={handleSimulationBtn}
      >
        Симуляция
      </button>
    </div>
  );
};
