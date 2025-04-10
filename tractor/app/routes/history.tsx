import type { Route } from './+types/home';
import HistoryPage from 'pages/History';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function History() {
  return <HistoryPage />;
}
