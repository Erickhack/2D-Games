import React, { type FC } from 'react';
import { Link } from 'react-router';

interface IProps {
  title: string;
  cards: {
    img: string;
    title: string;
    description: string;
  }[][];
}

interface IParts {
  index: number;
  cards: {
    img: string;
    title: string;
    description: string;
  }[];
}

const PartCards = (props: IParts) => {
  const CardSize = [
    ['col-span-3', 'col-span-5', 'col-span-4'],
    ['col-span-4', 'col-span-3', 'col-span-5'],
  ];

  return (
    <ul className="grid grid-cols-12 gap-8">
      {props.cards.map((card, index) => (
        <li
          className={
            'flex flex-col gap-6 rounded-3xl bg-white p-[18px]' +
            ' ' +
            `${CardSize[props.index][index]}`
          }
          key={`${card.title}-${index}`}
        >
          <div className="flex items-center justify-between">
            <img src={card.img} width={44} height={44} />
            <Link to={'/history'} className="text-[#047EFD]">
              Читать
            </Link>
          </div>
          <div className="flex flex-col gap-3.5">
            <h3 className="text-xl font-semibold text-[#252432]">
              {card.title}
            </h3>
            <div className="line-clamp-3 text-sm/[150%] leading-relaxed text-[#8987A1]">
              {card.description}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export const VerticalWrapped: FC<IProps> = ({ cards, title }) => {
  return (
    <div className="flex flex-col gap-[42px]">
      <h1 className="text-5xl font-bold text-[#252432]">{title}</h1>
      <div className="flex flex-col gap-8">
        <PartCards cards={cards[0]} index={0} />
        <PartCards cards={cards[1]} index={1} />
      </div>
    </div>
  );
};
