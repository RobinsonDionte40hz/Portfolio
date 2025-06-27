// Centralized color palette
export const COLORS = {
  palette: {
    night: '#171614',      // Night - Primary dark background
    bistre: '#3A2618',     // Bistre - Secondary dark backgrounds
    garnet: '#754043',     // Garnet - Accent color, highlights
    beaver: '#9A8873',     // Beaver - Text, subtle elements
    olive: '#37423D',      // Black olive - Alternative dark, borders
  }
};

// Semantic color mappings for easier usage
export const THEME_COLORS = {
  // Backgrounds
  background: {
    primary: COLORS.palette.night,
    secondary: COLORS.palette.bistre,
    accent: COLORS.palette.olive,
  },
  
  // Text
  text: {
    primary: '#FFFFFF',         // White for main text
    secondary: COLORS.palette.beaver,
    highlight: COLORS.palette.garnet,
  },
  
  // Borders
  border: {
    default: COLORS.palette.olive,
    hover: COLORS.palette.garnet,
  },
  
  // Interactive elements
  button: {
    background: COLORS.palette.bistre,
    hoverBackground: COLORS.palette.olive,
    border: COLORS.palette.garnet,
  },
  
  // Gradients (for JavaScript usage)
  gradients: {
    wave1: [COLORS.palette.bistre, COLORS.palette.garnet],
    wave2: [COLORS.palette.garnet, COLORS.palette.beaver],
    wave3: [COLORS.palette.beaver, COLORS.palette.olive],
  }
}; 