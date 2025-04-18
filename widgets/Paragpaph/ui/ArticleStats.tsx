import { FavoritSVG } from 'shared/svgs/ui/favorit';
import { HeartSVG } from 'shared/svgs/ui/heart';
import { ViewsSVG } from 'shared/svgs/ui/views';

export default function ArticleStats() {
  return (
    <div className="flex h-[54px] w-[326px] items-center justify-between rounded-3xl bg-white px-6 py-3.5">
      <div className="flex items-center justify-center gap-3.5">
        <HeartSVG />
        <span className="font-medium text-[#1B1A22]">3450</span>
      </div>
      <div className="flex items-center justify-center gap-3.5">
        <FavoritSVG />
        <span className="font-medium text-[#1B1A22]">93%</span>
      </div>
      <div className="flex items-center justify-center gap-3.5">
        <ViewsSVG />
        <span className="font-medium text-[#1B1A22]">1473</span>
      </div>
    </div>
  );
}
