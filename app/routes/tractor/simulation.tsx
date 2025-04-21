import SimulationPage from 'pages/simulators/ui';

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

export default function Simulation() {
  return (
    <SimulationPage
      puzlSourcePath="tractor"
      CORRECT_POSITIONS={CORRECT_POSITIONS}
      PIECE_SIZES={PIECE_SIZES}
    />
  );
}
