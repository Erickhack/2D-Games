import { Logo } from 'shared/Logo';
import { Menu } from './Menu';
import { Search } from './Search';

export default function Header() {
  return (
    <header className="relative z-10 h-[116px] rounded-[0_0_28px_28px] border border-[#E2E8F0] bg-[#ffffff66] px-5 py-8">
      <div className="md-header-div-1 items-center justify-between gap-16">
        <Logo />

        <Search />

        <Menu />
      </div>

      <div className="md-header-div-2 justify-between">
        <Logo />

        <div className="flex items-center gap-6">
          <Search />

          <Menu />
        </div>
      </div>
    </header>
  );
}
