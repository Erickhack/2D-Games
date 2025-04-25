import RadioSimulatorsPage from 'pages/Radio/Simulators';

const CORRECT_POSITIONS = [
  { x: 586, y: 325 },
  { x: 665, y: 330 },
  { x: 530, y: 230 },
  { x: 530, y: 475 },
  { x: 762, y: 320 },
  { x: 770, y: 436 },
];

const PIECE_SIZES = [
  { width: 374, height: 136 },
  { width: 517, height: 469 },
  { width: 134, height: 152 },
  { width: 134, height: 154 },
  { width: 152, height: 43 },
  { width: 166, height: 192 },
];

export default function Simulation() {
  return (
    <RadioSimulatorsPage
      CORRECT_POSITIONS={CORRECT_POSITIONS}
      PIECE_SIZES={PIECE_SIZES}
      puzlSourcePath="radio"
    />
  );
}
