import AuthorCard from 'widgets/AuthorCard';
import Paragrapg from 'widgets/Paragpaph/ui';
import {
  section1,
  section2,
  section3,
  section4,
  section5,
  section6,
  section7,
  section8,
  section9,
  section10,
  section11,
} from '../model';

export default function RadioHistoryPage() {
  return (
    <main className="mb-[135px] flex justify-center gap-11 p-5 pt-16 pb-4">
      <aside className="flex min-h-screen basis-2xs">
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

      <article className="basis-[1032px]">
        <Paragrapg
          sections={[
            { id: 1, text: section1 },
            { id: 2, text: section2 },
            { id: 3, text: section3 },
            { id: 4, text: section4 },
            { id: 5, list: section5 },
            { id: 6, text: section6 },
            { id: 7, text: section7 },
            { id: 8, text: section8 },
            { id: 9, text: section9 },
            { id: 10, list: section10 },
            { id: 11, text: section11 },
            {
              id: 12,
              image: {
                source: '/radio/history/schema.png',
                text: '',
              },
            },
          ]}
          title="7 мая — День радио: история великого изобретения"
        />
      </article>
    </main>
  );
}
