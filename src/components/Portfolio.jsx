import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import BackgroundLayer from './BackgroundLayer';
import SimulationLayer from './SimulationLayer';
import ContentLayer from './ContentLayer';

const Portfolio = () => {
  const [showSimulation, setShowSimulation] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden bg-palette-night">
      {/* Layer 0: Background graphics */}
      <BackgroundLayer />
      
      {/* Layer 1: Racing simulation */}
      <SimulationLayer visible={showSimulation} />
      
      {/* Layer 2: Portfolio content */}
      <ContentLayer />
      
      {/* Simulation toggle button */}
      <button
        onClick={() => setShowSimulation(!showSimulation)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-palette-bistre/90 text-palette-aquamarine rounded-lg hover:bg-palette-bistre transition-colors backdrop-blur-sm"
        aria-label={showSimulation ? 'Hide racing simulation' : 'Show racing simulation'}
      >
        {showSimulation ? <EyeOff size={20} /> : <Eye size={20} />}
        <span className="hidden sm:inline">{showSimulation ? 'Hide' : 'Show'} Simulation</span>
      </button>
    </div>
  );
};

export default Portfolio; 