// Car class for the racing simulation
import { RACE_CONFIG } from './constants';

export class Car {
  constructor(team, startPosition, track) {
    this.team = team;
    this.track = track;
    
    // Position and movement
    // Calculate starting position on the track (near start/finish line)
    const startAngle = 0; // Start at the rightmost point of the track
    const radius = (track.innerRadius + track.outerRadius) / 2; // Middle of the track
    this.x = track.centerX + Math.cos(startAngle) * radius;
    this.y = track.centerY + Math.sin(startAngle) * radius + (startPosition - 2.5) * 15; // Stagger cars vertically
    this.angle = startAngle; // Face the direction of travel
    this.previousX = this.x;
    this.previousY = this.y;
    
    // Physics
    this.speed = 0;
    this.maxSpeed = RACE_CONFIG.MAX_SPEED;
    this.acceleration = RACE_CONFIG.ACCELERATION;
    this.turnSpeed = RACE_CONFIG.TURN_SPEED;
    
    // Car stats
    this.stats = {
      speed: 0,
      maxSpeed: this.maxSpeed,
      acceleration: this.acceleration,
      handling: 0.8,
      fuelLevel: 100,
      fuelConsumption: RACE_CONFIG.FUEL_CONSUMPTION_RATE,
      tireWear: 100,
      confidence: 1.0
    };
    
    // Racing data
    this.currentLap = 0;
    this.lapTimes = [];
    this.currentLapStartTime = Date.now();
    this.position = startPosition;
    this.isInPit = false;
    this.pitStopStartTime = null;
    
    // AI personality from team
    this.personality = { ...team.personality };
    
    // Learning system for Gamma team
    if (team.id === 'gamma') {
      this.learningData = {
        cornerSpeeds: {},
        overtakeSuccess: 0,
        overtakeAttempts: 0
      };
    }
  }
  
  update(deltaTime, cars, bettingSupport = 0.5) {
    if (this.isInPit) {
      this.handlePitStop();
      return;
    }
    
    // Update confidence based on betting support
    this.stats.confidence = 0.8 + (bettingSupport * 0.4);
    
    // Store previous position for lap detection
    this.previousX = this.x;
    this.previousY = this.y;
    
    // AI decision making
    this.makeDecisions(cars);
    
    // Update physics
    this.updatePhysics(deltaTime);
    
    // Consume resources
    this.consumeResources(deltaTime);
    
    // Check lap completion
    if (this.track.checkStartLineCrossing({ x: this.previousX, y: this.previousY }, { x: this.x, y: this.y })) {
      this.completeLap();
    }
    
    // Update stats
    this.stats.speed = this.speed;
  }
  
  makeDecisions(cars) {
    // Get current track section
    const section = this.track.getCurrentSection(this.x, this.y);
    if (!section) return;
    
    // Adjust speed for track section
    const idealSpeed = section.idealSpeed * this.maxSpeed;
    const speedDiff = idealSpeed - this.speed;
    
    // Apply personality-based speed adjustment
    const aggressionFactor = this.personality.aggression;
    const targetSpeed = idealSpeed * (0.9 + aggressionFactor * 0.2);
    
    if (this.speed < targetSpeed) {
      this.accelerate();
    } else if (this.speed > targetSpeed * 1.1) {
      this.brake();
    }
    
    // Steering towards ideal line
    const currentAngle = Math.atan2(this.y - this.track.centerY, this.x - this.track.centerX);
    const idealPoint = this.track.getIdealLine(currentAngle);
    const currentRadius = Math.sqrt(
      Math.pow(this.x - this.track.centerX, 2) + 
      Math.pow(this.y - this.track.centerY, 2)
    );
    const idealRadius = Math.sqrt(
      Math.pow(idealPoint.x - this.track.centerX, 2) + 
      Math.pow(idealPoint.y - this.track.centerY, 2)
    );
    
    // Adjust position towards ideal racing line
    if (Math.abs(currentRadius - idealRadius) > 5) {
      const radiusAdjustment = (idealRadius - currentRadius) * 0.1;
      const newRadius = currentRadius + radiusAdjustment;
      this.x = this.track.centerX + Math.cos(currentAngle) * newRadius;
      this.y = this.track.centerY + Math.sin(currentAngle) * newRadius;
    }
    
    // Check for overtaking opportunities
    this.checkOvertaking(cars);
    
    // Check if pit stop needed
    if (this.shouldPit()) {
      this.enterPit();
    }
    
    // Team-specific behaviors
    this.applyTeamBehavior(section);
  }
  
  applyTeamBehavior(section) {
    switch (this.team.id) {
      case 'alpha':
        // Speedster - extra acceleration on straights
        if (section.type === 'straight') {
          this.speed = Math.min(this.speed * 1.02, this.maxSpeed * 1.1);
        }
        break;
        
      case 'beta':
        // Strategist - conservative cornering
        if (section.type === 'corner') {
          this.speed *= 0.95;
        }
        break;
        
      case 'gamma':
        // Adaptor - learn optimal speeds
        if (this.learningData) {
          if (!this.learningData.cornerSpeeds[section.id]) {
            this.learningData.cornerSpeeds[section.id] = section.idealSpeed;
          }
          // Gradually increase corner speeds if successful
          if (this.track.isOnTrack(this.x, this.y)) {
            this.learningData.cornerSpeeds[section.id] *= 1.001;
          }
        }
        break;
        
      case 'delta':
        // Wildcard - random adjustments
        if (Math.random() < 0.01) {
          this.personality.aggression = 0.3 + Math.random() * 0.7;
          this.personality.overtakeThreshold = 0.5 + Math.random() * 0.3;
        }
        break;
    }
  }
  
  checkOvertaking(cars) {
    const overtakeDistance = 50;
    const overtakeThreshold = this.personality.overtakeThreshold * this.stats.confidence;
    
    cars.forEach(otherCar => {
      if (otherCar === this || otherCar.isInPit) return;
      
      const distance = Math.sqrt(
        Math.pow(otherCar.x - this.x, 2) + 
        Math.pow(otherCar.y - this.y, 2)
      );
      
      if (distance < overtakeDistance) {
        // Check if we're faster and confident enough
        const speedAdvantage = this.speed - otherCar.speed;
        if (speedAdvantage > 0.5 && Math.random() < overtakeThreshold) {
          // Attempt overtake by changing lanes
          const myRadius = Math.sqrt(
            Math.pow(this.x - this.track.centerX, 2) + 
            Math.pow(this.y - this.track.centerY, 2)
          );
          const otherRadius = Math.sqrt(
            Math.pow(otherCar.x - this.track.centerX, 2) + 
            Math.pow(otherCar.y - this.track.centerY, 2)
          );
          
          // Pass on the inside or outside
          if (myRadius > otherRadius) {
            this.turn(-1); // Move to inside
          } else {
            this.turn(1); // Move to outside
          }
          
          // Track overtaking for Gamma team
          if (this.team.id === 'gamma' && this.learningData) {
            this.learningData.overtakeAttempts++;
            if (this.position < otherCar.position) {
              this.learningData.overtakeSuccess++;
            }
          }
        }
      }
    });
  }
  
  shouldPit() {
    const fuelThreshold = this.personality.pitStopThreshold || 25;
    const tireThreshold = 30;
    
    return (this.stats.fuelLevel < fuelThreshold || 
            this.stats.tireWear < tireThreshold) && 
            this.currentLap > 0;
  }
  
  enterPit() {
    this.isInPit = true;
    this.pitStopStartTime = Date.now();
    this.speed = 0;
    
    // Find available pit spot
    const spot = this.track.pitLane.spots.find(s => !s.occupied);
    if (spot) {
      spot.occupied = true;
      spot.teamId = this.team.id;
      this.x = spot.x;
      this.y = spot.y;
    }
  }
  
  handlePitStop() {
    const elapsed = Date.now() - this.pitStopStartTime;
    
    if (elapsed > RACE_CONFIG.PIT_STOP_DURATION) {
      // Refuel and new tires
      this.stats.fuelLevel = 100;
      this.stats.tireWear = 100;
      this.isInPit = false;
      
      // Release pit spot
      const spot = this.track.pitLane.spots.find(s => s.teamId === this.team.id);
      if (spot) {
        spot.occupied = false;
        spot.teamId = null;
      }
      
      // Return to track at pit exit
      this.x = this.track.pitLane.exit.x;
      this.y = this.track.pitLane.exit.y;
      this.angle = -Math.PI / 2;
    }
  }
  
  accelerate() {
    this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
  }
  
  brake() {
    this.speed = Math.max(this.speed - RACE_CONFIG.DECELERATION, 0);
  }
  
  turn(direction) {
    // In circular track, turning means changing lanes (radius)
    const currentRadius = Math.sqrt(
      Math.pow(this.x - this.track.centerX, 2) + 
      Math.pow(this.y - this.track.centerY, 2)
    );
    const currentAngle = Math.atan2(this.y - this.track.centerY, this.x - this.track.centerX);
    
    // Change radius for lane change
    const newRadius = currentRadius + direction * 5;
    const clampedRadius = Math.max(
      this.track.innerRadius + 10,
      Math.min(this.track.outerRadius - 10, newRadius)
    );
    
    // Update position with new radius
    this.x = this.track.centerX + Math.cos(currentAngle) * clampedRadius;
    this.y = this.track.centerY + Math.sin(currentAngle) * clampedRadius;
  }
  
  updatePhysics(deltaTime) {
    // Calculate the car's angle around the track center
    const currentAngle = Math.atan2(this.y - this.track.centerY, this.x - this.track.centerX);
    
    // Move along the circular path
    const angularVelocity = this.speed / ((this.track.innerRadius + this.track.outerRadius) / 2);
    const newAngle = currentAngle + angularVelocity;
    
    // Calculate radius from center (allows for lane changes)
    const currentRadius = Math.sqrt(
      Math.pow(this.x - this.track.centerX, 2) + 
      Math.pow(this.y - this.track.centerY, 2)
    );
    
    // Update position
    this.x = this.track.centerX + Math.cos(newAngle) * currentRadius;
    this.y = this.track.centerY + Math.sin(newAngle) * currentRadius;
    
    // Update car's facing angle
    this.angle = newAngle + Math.PI / 2; // Add 90 degrees so car faces forward
    
    // Keep car on track
    if (!this.track.isOnTrack(this.x, this.y)) {
      // Correct radius to stay within track bounds
      const targetRadius = Math.max(
        this.track.innerRadius + 10,
        Math.min(this.track.outerRadius - 10, currentRadius)
      );
      this.x = this.track.centerX + Math.cos(newAngle) * targetRadius;
      this.y = this.track.centerY + Math.sin(newAngle) * targetRadius;
      this.speed *= 0.9; // Slow down when correcting
    }
  }
  
  consumeResources(deltaTime) {
    // Fuel consumption (higher with speed and aggression)
    const consumption = this.stats.fuelConsumption * 
                       (0.5 + this.speed / this.maxSpeed * 0.5) * 
                       (0.8 + this.personality.aggression * 0.4);
    this.stats.fuelLevel = Math.max(0, this.stats.fuelLevel - consumption);
    
    // Tire wear (higher in corners and with aggressive driving)
    const section = this.track.getCurrentSection(this.x, this.y);
    const wearRate = section && section.type === 'corner' ? 
                    RACE_CONFIG.TIRE_WEAR_RATE * 1.5 : 
                    RACE_CONFIG.TIRE_WEAR_RATE;
    this.stats.tireWear = Math.max(0, this.stats.tireWear - wearRate * this.personality.aggression);
    
    // Reduce performance with low fuel or worn tires
    const resourcePenalty = Math.min(this.stats.fuelLevel / 100, this.stats.tireWear / 100);
    this.maxSpeed = RACE_CONFIG.MAX_SPEED * (0.7 + resourcePenalty * 0.3);
  }
  
  completeLap() {
    const lapTime = Date.now() - this.currentLapStartTime;
    this.lapTimes.push(lapTime);
    this.currentLap++;
    this.currentLapStartTime = Date.now();
    
    // Post-lap learning adjustments
    if (this.team.id === 'gamma' && this.personality.learningRate) {
      const avgLapTime = this.getAverageLapTime();
      if (lapTime < avgLapTime) {
        // Good lap - increase aggression slightly
        this.personality.aggression = Math.min(0.8, this.personality.aggression * 1.05);
      } else {
        // Slow lap - decrease aggression
        this.personality.aggression = Math.max(0.3, this.personality.aggression * 0.95);
      }
    }
  }
  
  getAverageLapTime() {
    if (this.lapTimes.length === 0) return Infinity;
    return this.lapTimes.reduce((a, b) => a + b, 0) / this.lapTimes.length;
  }
  
  getLastLapTime() {
    return this.lapTimes[this.lapTimes.length - 1] || null;
  }
  
  normalizeAngle(angle) {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }
  
  draw(ctx) {
    ctx.save();
    
    // Translate to car position
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Draw car body
    ctx.fillStyle = this.team.color;
    ctx.fillRect(
      -RACE_CONFIG.CAR_WIDTH / 2,
      -RACE_CONFIG.CAR_HEIGHT / 2,
      RACE_CONFIG.CAR_WIDTH,
      RACE_CONFIG.CAR_HEIGHT
    );
    
    // Draw car number
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.position.toString(), 0, 0);
    
    // Draw speed trail
    if (this.speed > 2) {
      const gradient = ctx.createLinearGradient(-RACE_CONFIG.CAR_WIDTH, 0, -RACE_CONFIG.CAR_WIDTH * 3, 0);
      gradient.addColorStop(0, this.team.color + '40');
      gradient.addColorStop(1, this.team.color + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(
        -RACE_CONFIG.CAR_WIDTH * 3,
        -RACE_CONFIG.CAR_HEIGHT / 2,
        RACE_CONFIG.CAR_WIDTH * 2,
        RACE_CONFIG.CAR_HEIGHT
      );
    }
    
    ctx.restore();
    
    // Draw UI elements
    this.drawUI(ctx);
  }
  
  drawUI(ctx) {
    // Draw fuel and tire indicators above car
    const barWidth = 30;
    const barHeight = 4;
    const barY = this.y - RACE_CONFIG.CAR_HEIGHT - 10;
    
    // Fuel bar
    ctx.fillStyle = '#333333';
    ctx.fillRect(this.x - barWidth / 2, barY - 5, barWidth, barHeight);
    ctx.fillStyle = this.stats.fuelLevel > 30 ? '#00ff00' : '#ff0000';
    ctx.fillRect(this.x - barWidth / 2, barY - 5, barWidth * this.stats.fuelLevel / 100, barHeight);
    
    // Tire bar
    ctx.fillStyle = '#333333';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);
    ctx.fillStyle = this.stats.tireWear > 30 ? '#00ff00' : '#ff0000';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth * this.stats.tireWear / 100, barHeight);
  }
} 