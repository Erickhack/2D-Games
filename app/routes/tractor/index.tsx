import { TractorHistoryPage } from 'pages/Tractor/History';
import { TractorSimulationPage } from 'pages/Tractor/Simulators';

export default function Tractor() {
  return (
    <main className="mx-auto max-w-[1400px] px-5">
      <TractorHistoryPage />

      <TractorSimulationPage />
    </main>
  );
}
