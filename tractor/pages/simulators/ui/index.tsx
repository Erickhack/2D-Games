import React from 'react';
import { Simulation } from 'widgets/Simulation/ui';

export default function SimulationPage() {
  return (
    <main className="flex flex-col justify-center gap-11 p-5 pt-16 pb-4">
      <section>
        <Simulation />
      </section>
      <section></section>
    </main>
  );
}
