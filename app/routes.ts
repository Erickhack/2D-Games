import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('', 'layouts/DashboardLayout.tsx', [index('routes/home.tsx')]),
  route('*', 'layouts/RootLayout.tsx', [
    route('history', 'routes/history.tsx'),
    route('simulation', 'routes/simulation.tsx'),
  ]),
] satisfies RouteConfig;
