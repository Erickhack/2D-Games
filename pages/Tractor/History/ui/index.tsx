import AuthorCard from 'widgets/AuthorCard';
import Paragrapg from 'widgets/Paragpaph/ui';
import { section1, section2 } from '../model';
import { TitleParagrapg } from 'widgets/TitleParagrapg';
export default function TractorHistoryPage() {
  return (
    <section className="mb-[135px] flex justify-center gap-11 p-5 pt-16 pb-4">
      <aside className="flex min-h-screen basis-2xs">
        <AuthorCard
          images={[
            '/tractor/history/author/author.png',
            '/tractor/history/author/author.png',
            '/tractor/history/author/author.png',
          ]}
        />
      </aside>

      <article className="basis-[1032px]">
        <div className="flex flex-col gap-10">
          <TitleParagrapg title="Фёдор Блинов и рождение гусеничного трактора" />

          <Paragrapg
            sections={[
              { id: 1, text: section1 },
              {
                id: 2,
                image: {
                  source: '/tractor/history/schema.png',
                  text: 'Чертеж устройства гусеничного хода. Современный рисунок',
                },
              },
              { id: 3, text: section2 },
            ]}
          />
        </div>
      </article>
    </section>
  );
}
