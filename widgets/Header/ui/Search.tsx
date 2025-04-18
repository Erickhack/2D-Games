import Button from 'shared/buttons/ui/Button';
import { SearchSVG } from 'shared/svgs/ui/search';

export const Search = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Поиск достижений"
        className="h-[52px] w-[684px] rounded-[12px] border border-[#E2E8F0] px-3.5 py-1.5 text-[#747A83]"
      />
      <Button className="absolute top-1.5 right-1.5 bottom-1.5 px-[24px] py-[8px]">
        <SearchSVG />
      </Button>
    </div>
  );
};
