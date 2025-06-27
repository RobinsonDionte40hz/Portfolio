// Racing Simulation Constants

export const TEAMS = {
  ALPHA: {
    id: 'alpha',
    name: 'The Speedster',
    color: '#FF4444',
    personality: {
      aggression: 0.9,
      fuelStrategy: 0.3,
      overtakeThreshold: 0.6,
      pitStopThreshold: 20
    }
  },
  BETA: {
    id: 'beta',
    name: 'The Strategist',
    color: '#4444FF',
    personality: {
      aggression: 0.3,
      fuelStrategy: 0.9,
      overtakeThreshold: 0.8,
      pitStopThreshold: 35
    }
  },
  GAMMA: {
    id: 'gamma',
    name: 'The Adaptor',
    color: '#44FF44',
    personality: {
      aggression: 0.5,
      fuelStrategy: 0.5,
      overtakeThreshold: 0.7,
      pitStopThreshold: 30,
      learningRate: 0.1
    }
  },
  DELTA: {
    id: 'delta',
    name: 'The Wildcard',
    color: '#FFFF44',
    personality: {
      aggression: Math.random(),
      fuelStrategy: Math.random(),
      overtakeThreshold: 0.5 + Math.random() * 0.3,
      pitStopThreshold: 20 + Math.random() * 20
    }
  }
};

export const NPCS = {
  MAD_MAX: {
    id: 'mad_max',
    name: 'Mad Max',
    riskTolerance: 0.9,
    betSize: 'large',
    strategy: 'emotional',
    dialogue: ['All in on Red!', 'Fortune favors the bold!', 'This is it!']
  },
  CALCULATOR_KATE: {
    id: 'calculator_kate',
    name: 'Calculator Kate',
    riskTolerance: 0.3,
    betSize: 'calculated',
    strategy: 'statistical',
    dialogue: ['Based on lap times...', 'Statistical advantage to Blue', 'Probability suggests...']
  },
  MOMENTUM_MIKE: {
    id: 'momentum_mike',
    name: 'Momentum Mike',
    riskTolerance: 0.6,
    betSize: 'medium',
    strategy: 'follow_leader',
    dialogue: ['Going with the flow!', "Can't argue with success", 'The trend is clear']
  },
  CONTRARIAN_CAROL: {
    id: 'contrarian_carol',
    name: 'Contrarian Carol',
    riskTolerance: 0.7,
    betSize: 'medium',
    strategy: 'anti_popular',
    dialogue: ["Everyone's wrong!", "I see what others don't", 'Time to go against the grain']
  },
  ROOKIE_ROBERT: {
    id: 'rookie_robert',
    name: 'Rookie Robert',
    riskTolerance: 0.5,
    betSize: 'small',
    strategy: 'random_learning',
    dialogue: ['I think... maybe?', 'Still learning!', 'Was that good?']
  }
};

export const RACE_CONFIG = {
  TRACK_WIDTH: 800,
  TRACK_HEIGHT: 600,
  CAR_WIDTH: 30,
  CAR_HEIGHT: 15,
  MAX_SPEED: 5,
  ACCELERATION: 0.1,
  DECELERATION: 0.05,
  TURN_SPEED: 0.1,
  FUEL_CONSUMPTION_RATE: 0.05,
  TIRE_WEAR_RATE: 0.03,
  PIT_STOP_DURATION: 3000, // ms
  LAP_THRESHOLD: 10, // pixels from start/finish line
};

export const BETTING_CONFIG = {
  BASE_ODDS: 4.0,
  MIN_BET: 10,
  MAX_BET: 1000,
  STARTING_BALANCE: 5000,
}; 