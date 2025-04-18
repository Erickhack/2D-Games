import { Link } from 'react-router';
import { LogoSVG } from 'shared/svgs/ui/logo';

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <Link to={'/'}>
        <LogoSVG />
      </Link>
      <Link to={'/'}>
        <span className="text-[22px]/[27px] text-[#1B1A22]">Русский мир</span>
      </Link>
    </div>
  );
};
