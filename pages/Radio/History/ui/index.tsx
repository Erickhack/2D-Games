import AuthorCard from 'widgets/AuthorCard';
import Paragrapg from 'widgets/Paragpaph/ui';
import { section1, section2, section3, section4, section5 } from '../model';
import { TitleParagrapg } from 'widgets/TitleParagrapg';

export default function RadioHistoryPage() {
  return (
    <main className="sm-history-section md-history-section flex justify-center gap-11 p-5 pt-16 pb-4">
      <aside className="md-aside flex min-h-screen basis-2xs">
        <AuthorCard
          images={[
            'radio/history/author/author.webp',
            'radio/history/author/author1.webp',
            'radio/history/author/author2.webp',
            'radio/history/author/author3.webp',
            'radio/history/author/author4.webp',
          ]}
        />
      </aside>

      <article className="sm-article-page flex basis-[1032px] flex-col gap-10">
        <TitleParagrapg title="Александр Попов и рождение радио." />

        <div className="md-paragraph-reverse">
          <Paragrapg
            sections={[
              { id: 1, text: section1 },
              { id: 2, text: section2 },
              { id: 3, text: section3 },
              { id: 4, text: section4 },
              { id: 5, text: section5 },
            ]}
          />
        </div>
      </article>
    </main>
  );
}
