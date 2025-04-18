import AuthorCard from 'widgets/AuthorCard';
import Paragrapg from 'widgets/Paragpaph/ui';

export default function HistoryPage() {
  return (
    <main className="mb-[135px] flex justify-center gap-11 p-5 pt-16 pb-4">
      <aside className="flex min-h-screen basis-2xs">
        <AuthorCard />
      </aside>

      <article className="basis-[1032px]">
        <Paragrapg />
      </article>
    </main>
  );
}
