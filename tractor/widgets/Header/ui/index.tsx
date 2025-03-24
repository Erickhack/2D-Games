import { Logo } from './Logo';
import { Menu } from './Menu';
import { Search } from './Search';

export default function Header() {
  return (
    <header className="flex h-[116px] items-center justify-between rounded-[0_0_28px_28px] border border-[#E2E8F0] bg-white px-5 py-8">
      <div>
        <Logo />
      </div>
      <div>
        <Search />
      </div>
      <div>
        <Menu />
      </div>
    </header>
  );
}
