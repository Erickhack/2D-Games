import { Link } from 'react-router';
import { LogoSVG } from 'shared/svgs/ui/logo';

export const Logo = () => {
  return (
    <div className="md-logo flex items-center gap-3">
      <Link to={'/'} className="sm-logo-icon overflow-hidden rounded-lg">
        <LogoSVG />
      </Link>
      <Link to={'/'}>
        <span className="sm-logo-text text-[22px]/[27px] text-[#1B1A22]">Русский мир</span>
      </Link>
    </div>
  );
};
