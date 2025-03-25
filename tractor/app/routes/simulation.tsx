import MainPage from 'pages/main';
import type { Route } from './+types/home';
import SimulationPage from 'pages/simulators/ui';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Simulation() {
  return <SimulationPage />;
}
