import RadioHistoryPage from 'pages/Radio/History';
import RadioSimulatorsPage from 'pages/Radio/Simulators';

export default function Radio() {
  return (
    <main className="mx-auto max-w-[1400px] px-5">
      <RadioHistoryPage />

      <RadioSimulatorsPage />
    </main>
  );
}
