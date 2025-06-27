import React from 'react';
import { COLORS } from '../constants/colors';

const BackgroundLayer = () => {
  return (
    <div className="fixed inset-0 pointer-events-none bg-palette-night" style={{ zIndex: 0 }}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-palette-night via-palette-bistre/30 to-palette-olive/20" />
      
      {/* Wave animations container */}
      <div className="absolute inset-0 opacity-70">
        {/* Wave 1 - Back layer */}
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-[200%] h-[60%] animate-wave-slow" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path fill="url(#gradient1)" fillOpacity="0.3" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLORS.palette.bistre} />
                <stop offset="100%" stopColor={COLORS.palette.garnet} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Wave 2 - Middle layer */}
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-[200%] h-[55%] animate-wave-medium" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path fill="url(#gradient2)" fillOpacity="0.5" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,224C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLORS.palette.garnet} />
                <stop offset="100%" stopColor={COLORS.palette.beaver} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Wave 3 - Front layer */}
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-[200%] h-[50%] animate-wave-fast" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path fill="url(#gradient3)" fillOpacity="0.7" d="M0,256L48,245.3C96,235,192,213,288,208C384,203,480,213,576,234.7C672,256,768,288,864,277.3C960,267,1056,213,1152,197.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
            <defs>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLORS.palette.beaver} />
                <stop offset="100%" stopColor={COLORS.palette.olive} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BackgroundLayer; 