import { LightBulbSimulationPage } from 'pages/LightBulb/Simulators';

const CORRECT_POSITIONS = [
  { x: 1400 / 2 + 141, y: 532 },
  { x: 1400 / 2, y: 555 },
  { x: 1400 / 2 + 13, y: 223 },
  { x: 1400 / 2 + 41, y: 396 },
  { x: 1400 / 2 + 13, y: 267 },
  { x: 1400 / 2 - 131, y: 500 },
  { x: 1400 / 2 + 12, y: 201 },
  { x: 1400 / 2 + 12, y: 269 },
];

const PIECE_SIZES = [
  { width: 217, height: 64 },
  { width: 1400, height: 60 },
  { width: 252, height: 252 },
  { width: 44, height: 209 },
  { width: 252, height: 341 },
  { width: 237, height: 126 },
  { width: 57, height: 19 },
  { width: 83, height: 174 },
];

export default function Simulation() {
  return <LightBulbSimulationPage />;
}
