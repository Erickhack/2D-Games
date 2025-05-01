export const Banner = () => {
  return (
    <div className="relative z-10 flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center text-center text-[64px]/[100%] font-bold">
        <div className="max-w-[989px]">
          <span>Открой для себя великие достижения России</span>
        </div>
        <span className="max-w-screen">
          играй{' '}
          <span>
            (
            <img className="top-0 left-0 inline" src="text-image/Ellipse_1.png" />)
          </span>{' '}
          узнавай (
          <img className="inline" src="text-image/Ellipse_2.png" />) вдохновляйся
        </span>
      </div>
    </div>
  );
};
