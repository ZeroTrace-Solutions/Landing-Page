import React from 'react';
import Particles from 'react-tsparticles';

export const TimerParticles = ({ init, loaded }) => (
  <Particles
    id="tsparticles"
    init={init}
    loaded={loaded}
    options={{
      fullScreen: { enable: false },
      detectRetina: true,
      fpsLimit: 60,
      background: { color: 'transparent' },
      particles: {
        number: { value: 260, density: { enable: true, area: 1300 } },
        color: { value: ['#38bdf8', '#22d3ee', '#be185d', '#facc15', '#7c3aed'] },
        opacity: { value: 0.75, random: { enable: true, minimumValue: 0.28 } },
        size: { value: { min: 1, max: 3 } },
        move: {
          enable: true,
          speed: 0.4,
          direction: 'none',
          outModes: { default: 'bounce' }
        },
        links: { enable: false }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          repulse: { distance: 100, duration: 0.35 },
          push: { quantity: 4 }
        }
      }
    }}
    className="absolute inset-0 h-full w-full"
  />
);
