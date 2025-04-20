import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function initNavigation(link: string) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(link);
  }, []);
}
