import type { FC } from 'react';
import ArticleStats from './ArticleStats';

const list = [
  'Вольск',
  'О сельском хозяйстве',
  'Российские ученые и инженеры',
  'Россия',
  'Наука и техника',
];

interface IProps {
  title: string;
}

export const TitleParagrapg: FC<IProps> = (props) => {
  return (
    <div className="flex justify-between gap-8">
      <div className="flex max-w-[674px] flex-col gap-5">
        <h1 className="text-5xl/[58px] font-semibold text-[#1B1A22]">{props.title}</h1>

        <ul className="flex max-w-[674px] flex-wrap gap-2">
          {list.map((text, index) => (
            <li key={index} className="w-max rounded-md bg-white px-2 py-2.5 text-[#1B1A22]">
              {text}
            </li>
          ))}
        </ul>
      </div>
      <ArticleStats />
    </div>
  );
};
