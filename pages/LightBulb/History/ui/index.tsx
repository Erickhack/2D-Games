import AuthorCard from 'widgets/AuthorCard';
import Paragrapg from 'widgets/Paragpaph/ui';
import { section1, section2, section3, section4, section5 } from '../model';

export default function LightBulbHistoryPage() {
  return (
    <section className="mb-[135px] flex justify-center gap-11 p-5 pt-16 pb-4">
      <aside className="flex min-h-screen basis-2xs">
        <AuthorCard
          images={[
            '/light-bulb/history/author/author.webp',
            '/light-bulb/history/author/author1.webp',
            '/light-bulb/history/author/author2.webp',
            '/light-bulb/history/author/author3.webp',
            '/light-bulb/history/author/author4.webp',
          ]}
        />
      </aside>

      <article className="basis-[1032px]">
        <Paragrapg
          title="140 лет назад русский ученый Яблочков изобрел лампу накаливани"
          sections={[
            { id: 1, text: section1 },
            { id: 2, text: section2 },
            {
              id: 4,
              image: {
                source: '/light-bulb/history/schema.jpg',
                text: `например, схематичное сравнение "электрической свечи", лампы накаливания и современной LED-лампы. Это поможет визуально подчеркнуть эволюцию технологии.`,
              },
            },
            { id: 5, text: section3 },
            { id: 6, text: section4 },
            { id: 7, text: section5 },
          ]}
        />
      </article>
    </section>
  );
}
