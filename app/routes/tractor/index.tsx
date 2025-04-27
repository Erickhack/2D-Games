import { TractorHistoryPage } from 'pages/Tractor/History';
import { TractorSimulationPage } from 'pages/Tractor/Simulators';

export default function Tractor() {
  return (
    <main className="max-w-[1400px] mx-auto">
      <TractorHistoryPage />

      <TractorSimulationPage
      />
    </main>
  );
}
