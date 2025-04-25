import AuthorCard from 'widgets/AuthorCard';
import Paragrapg from 'widgets/Paragpaph/ui';
import { section1, section2, section3 } from '../model';

export default function TractorHistoryPage() {
  return (
    <section className="mb-[135px] flex justify-center gap-11 p-5 pt-16 pb-4">
      <aside className="flex min-h-screen basis-2xs">
        <AuthorCard />
      </aside>

      <article className="basis-[1032px]">
        <Paragrapg
          title="Гусеничный трактор"
          sections={[
            { id: 1, text: section1 },
            { id: 2, text: section2 },
            {
              id: 3,
              image: {
                source: '/tractor/history/schema.png',
                text: 'Чертеж устройства гусеничного хода. Современный рисунок',
              },
            },
            { id: 4, text: section3 },
          ]}
        />
      </article>
    </section>
  );
}
