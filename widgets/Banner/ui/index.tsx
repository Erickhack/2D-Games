export const Banner = () => {
  return (
    <div className="md-banner sm-banner relative z-10 flex h-screen w-full items-center justify-center">
      <div className="md-banner-contain sm-banner-contain flex flex-col items-center text-center text-[64px]/[100%] font-bold">
        <div className="md-banner-div-1 sm-banner-div-1 max-w-[989px]">
          <span>Открой для себя великие достижения России</span>
        </div>
        <span className="max-w-screen sm-banner-span-1">
          играй{' '}
          <span>
            ({' '}
            <img
              className="top-0 left-0 inline size-[42px] rounded-full"
              src="text-image/author.webp"
            />{' '}
            )
          </span>{' '}
          узнавай ({' '}
          <span>
            <img
              className="top-0 left-0 inline size-[42px] rounded-full"
              src="text-image/author.jpg"
            />
          </span>{' '}
          ) вдохновляйся
        </span>
      </div>
    </div>
  );
};
