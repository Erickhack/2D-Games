import Button from 'shared/buttons/ui/Button';
import { SearchSVG } from 'shared/svgs/ui/search';

export const Search = () => {
  return (
    <div className="md-search-contain relative h-[52px] basis-[864px]">
      <input
        type="text"
        placeholder="Поиск достижений"
        className="md-search-input h-full w-full rounded-xl border border-[#E2E8F0] px-3.5 py-1.5 text-[#747A83]"
      />
      <Button className="md-search-btn sm-search-btn absolute top-1.5 right-1.5 bottom-1.5 px-6 py-2">
        <SearchSVG />
      </Button>
    </div>
  );
};
