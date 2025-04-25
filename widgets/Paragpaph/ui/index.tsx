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
  sections: {
    id: number;
    text?: string;
    image?: {
      source: string;
      text: string;
    };
    list?: string[];
  }[];
}

export default function Paragrapg(props: IProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between gap-8">
        <div className="flex flex-col gap-5">
          <h1 className="text-5xl/[58px] font-semibold text-[#1B1A22]">
            {props.title}
          </h1>

          <ul className="flex max-w-[674px] flex-wrap gap-2">
            {list.map((text, index) => (
              <li
                key={index}
                className="w-max rounded-md bg-white px-2 py-2.5 text-[#1B1A22]"
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
        <ArticleStats />
      </div>

      <div className="flex flex-col gap-6">
        {props.sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-3">
            {section.image ? (
              <dl className="flex flex-col gap-3.5">
                <dt>
                  <img src={section.image.source} alt={section.image.text} />
                </dt>
                <dd>
                  <i className="text-[18px]/[130%] font-light text-[#1B1A22]">
                    {section.image.text}
                  </i>
                </dd>
              </dl>
            ) : section.list ? (
              <ul className="list-disc space-y-1 pl-5">
                {section.list.map((item, idx) => (
                  <li
                    key={idx}
                    className="inline-block border-b border-[#1B1A22] text-[22px] text-[#1B1A22]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-[22px] text-[#1B1A22]">{section.text}</span>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
