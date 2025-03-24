import ArticleStats from './ArticleStats';
import * as tesxts from '../model/article-text';

const list = [
  'Вольск',
  'О сельском хозяйстве',
  'Российские ученые и инженеры',
  'Россия',
  'Наука и техника',
];

export default function Paragrapg() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between gap-8">
        <div className="flex flex-col gap-5">
          <h1 className="text-5xl/[58px] font-semibold text-[#1B1A22]">
            Гусеничный трактор
          </h1>

          <ul className="flex max-w-[674px] flex-wrap gap-2">
            {list.map((text) => (
              <li className="w-max rounded-md bg-[#ECEDF0] px-2 py-2.5 text-[#1B1A22]">
                {text}
              </li>
            ))}
          </ul>
        </div>
        <ArticleStats />
      </div>
      <div className="flex flex-col gap-6">
        <section className="text-[22px] text-[#1B1A22]">
          {tesxts.section1}
        </section>
        <section className="text-[22px] text-[#1B1A22]">
          {tesxts.section2}
        </section>
        <section>
          <dl className="flex flex-col gap-3.5">
            <dt>
              <img src="/schema.png" />
            </dt>
            <dd>
              <i className="text-[18px]/[130%] font-light text-[#1B1A22]">
                Чертеж устройства гусеничного хода. Современный рисунок
              </i>
            </dd>
          </dl>
        </section>
        <section className="text-[22px] text-[#1B1A22]">
          {tesxts.section3}
        </section>
      </div>
    </div>
  );
}
