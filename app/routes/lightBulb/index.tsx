import LightBulbHistoryPage from 'pages/LightBulb/History';
import { LightBulbSimulationPage } from 'pages/LightBulb/Simulators';

export default function Tractor() {
  return (
    <main className="mx-auto max-w-[1400px]">
      <LightBulbHistoryPage />

      <LightBulbSimulationPage />
    </main>
  );
}
