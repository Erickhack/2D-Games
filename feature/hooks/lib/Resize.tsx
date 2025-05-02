import { useEffect, useState } from 'react';

function useResize() {
  const [screenSize, setScreenSize] = useState<number | null>(null);

  const handleResize = () => setScreenSize(window.innerWidth);

  useEffect(() => {
    setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

export { useResize };
