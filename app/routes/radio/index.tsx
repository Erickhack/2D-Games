import RadioHistoryPage from 'pages/Radio/History';
import RadioSimulatorsPage from 'pages/Radio/Simulators';

export default function Radio() {
  return (
    <main className="max-w-[1400px] mx-auto">
      <RadioHistoryPage />

      <RadioSimulatorsPage />
    </main>
  );
}
