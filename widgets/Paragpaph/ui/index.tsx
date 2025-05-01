interface IProps {
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
    <div className="flex flex-col gap-6">
      {props.sections.map((section) => (
        <section key={section.id} className="flex flex-col gap-3">
          {section.image ? (
            <dl className="flex flex-col gap-3.5">
              <dt>
                <img src={section.image.source} alt={section.image.text} />
              </dt>
              <dd>
                <i className="text-[18px]/[130%] font-light text-[#1B1A22]">{section.image.text}</i>
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
  );
}
