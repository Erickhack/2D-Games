import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('history', 'routes/history.tsx'),
  route('simulation', 'routes/simulation.tsx'),
] satisfies RouteConfig;
