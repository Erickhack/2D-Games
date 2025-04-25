import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  // route('', 'layouts/DashboardLayout.tsx', [index('routes/home.tsx')]),
  route('', 'layouts/RootLayout.tsx', [
    // Main route
    index('routes/home.tsx'),
    // Radio Route
    route('radio', 'routes/radio/index.tsx'),
    // route('radio/history', 'routes/radio/history.tsx'),
    // route('radio/simulation', 'routes/radio/simulation.tsx'),

    // Tractor route
    route('tractor', 'routes/tractor/index.tsx'),
    // route('tractor/history', 'routes/tractor/history.tsx'),
    // route('tractor/simulation', 'routes/tractor/simulation.tsx'),

    // light bulb route
    route('light-bulb', 'routes/lightBulb/index.tsx'),
    // route('light-bulb/history', 'routes/lightBulb/history.tsx'),
    // route('light-bulb/simulation', 'routes/lightBulb/simulation.tsx'),
  ]),
] satisfies RouteConfig;
