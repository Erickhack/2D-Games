import { useState, useEffect, useRef } from 'react';
import Button from 'shared/buttons/ui/Button';
import { BearSVG } from 'shared/svgs/ui/bear';
import { BearPawSVG } from 'shared/svgs/ui/bear/paw';
import { SearchSVG } from 'shared/svgs/ui/search';

export const Bear = () => {
  const [active, setActive] = useState(false);
  const bearContainerRef = useRef<HTMLDivElement>(null); // Ссылка на контейнер
  const bearPawRef = useRef<HTMLButtonElement>(null); // Ссылка на кнопку BearPaw

  const handleActive = () => setActive((prev) => !prev);

  // Закрытие при клике вне области
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        bearContainerRef.current &&
        !bearContainerRef.current.contains(e.target as Node) &&
        bearPawRef.current &&
        !bearPawRef.current.contains(e.target as Node)
      ) {
        setActive(false); // Скрываем окно, если кликнули вне
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed right-0 bottom-0 z-[1000]">
      <button
        ref={bearPawRef} // Присваиваем ссылку на кнопку
        onClick={handleActive}
        className={`absolute right-5 bottom-5 z-10 h-[60px] w-[60px] cursor-pointer transition-transform duration-300 hover:scale-110 ${active ? 'scale-0' : 'scale-100'}`}
      >
        <BearPawSVG />
      </button>

      <div
        ref={bearContainerRef} // Присваиваем ссылку на контейнер
        className={`absolute right-0 bottom-0 transition-transform delay-200 duration-300 ${active ? 'translate-x-0' : 'translate-x-100'}`}
      >
        <BearSVG />
        <div
          className={`absolute top-[120px] left-[-220px] w-[250px] rounded-[15px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform delay-200 duration-300 ${active ? 'scale-100' : 'scale-0'}`}
        >
          <span className="text-black">Привет! Что будем искать?</span>
          <div className="mt-3.5 flex flex-col gap-2.5">
            <input
              className="w-full rounded-xl border-1 border-[#E2E8F0] p-2.5 text-base text-black transition-colors duration-300 outline-none placeholder:text-gray-500 focus:border-[#046cfd]"
              type="text"
              placeholder="Введите запрос..."
            />

            <Button className="flex w-max gap-2.5 px-6 py-2 hover:bg-[#046cfd]">
              <SearchSVG />
              <span>Найти</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
