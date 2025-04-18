import Button from 'shared/buttons/ui/Button';
import { MenuSVG } from 'shared/svgs/ui/menu';

export const Menu = () => {
  return (
    <div>
      <Button className="gap-3 px-3.5 py-4">
        <MenuSVG />
        <span>Достижения</span>
      </Button>
    </div>
  );
};
