import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Right } from 'shared/svgs/ui/arrows/12x19/right';
import { Left } from 'shared/svgs/ui/arrows/12x19/left';
import { useState, useRef } from 'react';

interface IProps {
  images: string[];
}

export default function AuthorCard(props: IProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);

  // Обработчик для кнопки "предыдущий слайд"
  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  // Обработчик для кнопки "следующий слайд"
  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // Обработчик изменения слайда
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div className="sticky top-5 self-start">
      <div className="relative rounded-xl">
        <Swiper
          className="h-[465px] w-[326px]"
          spaceBetween={42}
          ref={swiperRef}
          onSlideChange={handleSlideChange}
        >
          {props.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                className="h-full w-full object-cover rounded-xl"
                src={image}
                alt={`Slide ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute right-[59px] bottom-4 left-[58px] z-10 flex justify-between gap-8 rounded-xl border border-[#FFFFFF1A] bg-[#5252524D] px-[22px] py-3.5 backdrop-blur-[12.65px]">
          <button onClick={handlePrev}>
            <Left active={activeIndex === 0} />
          </button>

          <ul className="flex items-center justify-center gap-[7px]">
            {props.images.map((_, index) => (
              <li
                key={index}
                className={`h-2 ${activeIndex === index ? 'w-[18px] bg-[#FFFFFF]' : 'w-2 bg-[#FFFFFF99]'} rounded-full transition`}
                onClick={() => {
                  if (swiperRef.current && swiperRef.current.swiper) {
                    swiperRef.current.swiper.slideTo(index);
                  }
                }}
              />
            ))}
          </ul>

          <button onClick={handleNext}>
            <Right active={activeIndex === props.images.length - 1} />
          </button>
        </div>
      </div>
      <div>
        <span className="text-2xl/relaxed font-medium text-[#00000080]">
          Федор Блинов
        </span>
      </div>
    </div>
  );
}
