import Button from 'shared/buttons/ui/Button';
import { MenuSVG } from 'shared/svgs/ui/menu';

export const Menu = () => {
  return (
    <Button className="md-menu sm-menu gap-3 px-3.5 py-4">
      <MenuSVG />
      <span className="sm-menu-span">Достижения</span>
    </Button>
  );
};
