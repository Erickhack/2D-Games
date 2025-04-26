import { TractorHistoryPage } from 'pages/Tractor/History';
import { TractorSimulationPage } from 'pages/Tractor/Simulators';

const CORRECT_POSITIONS = [
  { x: 600, y: 510 },
  { x: 665, y: 326 },
  { x: 465, y: 336 },
  { x: 600, y: 430 },
  { x: 869, y: 480 },
];

const PIECE_SIZES = [
  { width: 500, height: 106 },
  { width: 288, height: 215 },
  { width: 123, height: 145 },
  { width: 532, height: 89 },
  { width: 31, height: 104 },
];

export default function Tractor() {
  return (
    <main className="max-w-[1400px] mx-auto">
      <TractorHistoryPage />

      <TractorSimulationPage
        puzlSourcePath="tractor"
        CORRECT_POSITIONS={CORRECT_POSITIONS}
        PIECE_SIZES={PIECE_SIZES}
      />
    </main>
  );
}
