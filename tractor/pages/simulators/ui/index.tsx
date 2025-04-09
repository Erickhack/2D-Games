import React from 'react';
import { Simulation } from 'widgets/Simulation/ui';
import {
  descriptoinOfSimulation1,
  descriptoinOfSimulation2,
} from '../model/texts';

export default function SimulationPage() {
  return (
    <main className="flex flex-col justify-center gap-11 p-5 pt-16 pb-4">
      <section>
        <Simulation
          title="1. Пазл"
          description={descriptoinOfSimulation1}
          simulation="puzl"
        />
      </section>
      <section>
        <Simulation
          title="2. Симуляция"
          description={descriptoinOfSimulation2}
          simulation="tractor"
        />
      </section>
    </main>
  );
}
