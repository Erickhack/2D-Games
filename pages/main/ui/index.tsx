import { Banner } from 'widgets/Banner';
import { VerticalWrapped } from 'widgets/VerticalWrapped';
import { popularCards } from '../model';

function MainPage() {
  return (
    <main className="flex flex-col gap-[220px] px-[42px] sm-main">
      <Banner />

      <VerticalWrapped cards={popularCards} title="Популярное за неделю" />

      <div className="mb-[220px]">
        <VerticalWrapped cards={popularCards} title="Популярное за неделю" />
      </div>
    </main>
  );
}

export default MainPage;
