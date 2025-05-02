import AuthorCard from 'widgets/AuthorCard';
import Paragrapg from 'widgets/Paragpaph/ui';
import { section1, section2, section3, section4, section5, section6, section7 } from '../model';
import { TitleParagrapg } from 'widgets/TitleParagrapg';

export default function LightBulbHistoryPage() {
  return (
    <section className="sm-history-section md-history-section flex justify-center gap-11 p-5 pt-16 pb-4">
      <aside className="md-aside flex min-h-screen basis-2xs">
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

      <article className="sm-article-page flex basis-[1032px] flex-col gap-10">
        <TitleParagrapg title="Свеча Яблочкова: история первой дуговой лампы и её создателя" />

        <div className="md-paragraph-reverse">
          <Paragrapg
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
              { id: 8, text: section6 },
              { id: 9, text: section7 },
            ]}
          />
        </div>
      </article>
    </section>
  );
}
