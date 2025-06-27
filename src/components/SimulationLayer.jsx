import React, { useEffect, useRef } from 'react';
import { RaceSimulation } from '../racing/RaceSimulation';

const SimulationLayer = ({ visible = false }) => {
  const canvasRef = useRef(null);
  const simulationRef = useRef(null);
  const showDataPanelRef = useRef(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Set canvas size
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recreate simulation on resize
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
      simulationRef.current = new RaceSimulation(canvas);
      simulationRef.current.start();
    };

    // Initial setup
    resizeCanvas();

    // Add event listeners
    const handleMouseMove = (e) => {
      if (simulationRef.current) {
        simulationRef.current.handleMouseMove(e);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    canvasRef.current.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
      window.removeEventListener('resize', resizeCanvas);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const toggleDataPanel = () => {
    if (simulationRef.current) {
      simulationRef.current.toggleDataPanel();
      showDataPanelRef.current = !showDataPanelRef.current;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[1] transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Control buttons */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={toggleDataPanel}
          className="px-4 py-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm border border-white/20"
        >
          {showDataPanelRef.current ? 'Hide' : 'Show'} Race Data
        </button>
      </div>
    </div>
  );
};

export default SimulationLayer; 