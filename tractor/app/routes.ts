import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('history', 'routes/home.tsx'),
  route('simulation', 'routes/simulation.tsx'),
] satisfies RouteConfig;
