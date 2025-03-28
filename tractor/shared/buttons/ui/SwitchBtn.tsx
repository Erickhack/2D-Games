import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { If } from 'shared/components/if/ui';

export const SwitchBtn = () => {
  const [url, setURl] = useState<URL>();
  const [active, setActive] = useState('');
  const navigation = useNavigate();

  const handleHistoryBtn = () => {
    setActive('history');
    navigation('history');
  };

  const handleSimulationBtn = () => {
    setActive('simulation');
    navigation('simulation');
  };

  useEffect(() => {
    if (window) setURl(new URL(window.location.href));
  }, []);

  useEffect(() => {
    if (url) setActive(url.pathname.split('/')[1]);
  }, [url]);

  return (
    <div className="relative flex rounded-[20px] bg-[#E8EEF9] p-2">
      <If conditional={Boolean(active)}>
        <div
          className="absolute top-2 left-2 h-[42px] w-[151px] rounded-xl bg-[#047EFD] transition-transform duration-300"
          style={{
            transform:
              active === 'history' ? 'translateX(0)' : 'translateX(151px)',
          }}
        />
      </If>

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
