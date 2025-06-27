// Main Racing Simulation class
import { Track } from './Track';
import { Car } from './Car';
import { BettingSystem } from './BettingSystem';
import { TEAMS, RACE_CONFIG } from './constants';

export class RaceState {
  constructor(cars) {
    this.cars = cars;
    this.status = 'ready'; // ready, racing, finished
    this.startTime = null;
    this.raceTime = 0;
    this.lapsToComplete = 5;
    this.winner = null;
  }
  
  start() {
    this.status = 'racing';
    this.startTime = Date.now();
  }
  
  getLeader() {
    return this.cars.reduce((leader, car) => {
      if (!leader) return car;
      if (car.currentLap > leader.currentLap) return car;
      if (car.currentLap === leader.currentLap && car.position < leader.position) return car;
      return leader;
    }, null);
  }
  
  getPositionLeader() {
    return this.cars.find(car => car.position === 1);
  }
  
  updatePositions() {
    // Calculate positions based on laps completed and distance on current lap
    const carProgress = this.cars.map(car => {
      // Calculate angle around track (0 to 2π)
      const angle = Math.atan2(car.y - car.track.centerY, car.x - car.track.centerX);
      const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;
      
      // Progress is laps + fraction of current lap
      const lapProgress = normalizedAngle / (Math.PI * 2);
      
      return {
        car: car,
        progress: car.currentLap + lapProgress
      };
    });
    
    carProgress.sort((a, b) => b.progress - a.progress);
    
    carProgress.forEach((item, index) => {
      item.car.position = index + 1;
    });
  }
  
  checkRaceEnd() {
    const leader = this.getLeader();
    if (leader && leader.currentLap >= this.lapsToComplete) {
      this.status = 'finished';
      this.winner = leader;
      return true;
    }
    return false;
  }
}

export class RaceSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Initialize track
    this.track = new Track(canvas.width, canvas.height);
    
    // Initialize cars
    this.cars = this.createCars();
    
    // Initialize race state
    this.raceState = new RaceState(this.cars);
    
    // Initialize betting system
    this.bettingSystem = new BettingSystem();
    
    // Animation frame tracking
    this.lastFrameTime = 0;
    this.animationId = null;
    
    // UI state
    this.showDataPanel = true;
    this.hoveredCar = null;
    
    // Performance monitoring
    this.frameCount = 0;
    this.fps = 60;
    this.fpsLastUpdate = Date.now();
  }
  
  createCars() {
    const teams = Object.values(TEAMS);
    return teams.map((team, index) => {
      return new Car(team, index + 1, this.track);
    });
  }
  
  start() {
    this.raceState.start();
    this.animate();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  animate(currentTime = 0) {
    // Calculate delta time
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Update FPS counter
    this.updateFPS();
    
    // Update simulation
    this.update(deltaTime);
    
    // Render
    this.render();
    
    // Continue animation
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }
  
  update(deltaTime) {
    if (this.raceState.status !== 'racing') return;
    
    // Update betting system
    this.bettingSystem.update(this.raceState);
    
    // Update each car with betting support
    this.cars.forEach(car => {
      const support = this.bettingSystem.getTeamSupport(car.team.id);
      car.update(deltaTime, this.cars, support);
    });
    
    // Update race positions
    this.raceState.updatePositions();
    
    // Check for race end
    if (this.raceState.checkRaceEnd()) {
      this.handleRaceEnd();
    }
    
    // Update race time
    this.raceState.raceTime = Date.now() - this.raceState.startTime;
  }
  
  handleRaceEnd() {
    // Settle bets
    this.bettingSystem.completeRace(this.raceState.winner.team);
    
    // Schedule restart
    setTimeout(() => {
      this.resetRace();
    }, 5000);
  }
  
  resetRace() {
    // Reset cars
    this.cars = this.createCars();
    
    // Reset race state
    this.raceState = new RaceState(this.cars);
    
    // Auto-start new race
    setTimeout(() => {
      this.raceState.start();
    }, 2000);
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw track
    this.track.draw(this.ctx);
    
    // Draw cars
    this.cars.forEach(car => car.draw(this.ctx));
    
    // Draw UI
    this.drawUI();
    
    // Draw data panel if enabled
    if (this.showDataPanel) {
      this.drawDataPanel();
    }
  }
  
  drawUI() {
    const ctx = this.ctx;
    
    // Race status
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Lap ${this.raceState.getLeader()?.currentLap || 0} / ${this.raceState.lapsToComplete}`, 10, 30);
    
    // Position board
    this.drawPositionBoard();
    
    // FPS counter
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(this.fps)} FPS`, this.canvas.width - 10, 20);
  }
  
  drawPositionBoard() {
    const ctx = this.ctx;
    const x = 10;
    const y = 60;
    const lineHeight = 25;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - 5, y - 20, 200, this.cars.length * lineHeight + 10);
    
    this.cars.forEach((car, index) => {
      const yPos = y + index * lineHeight;
      
      // Position number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${car.position}.`, x, yPos);
      
      // Team color indicator
      ctx.fillStyle = car.team.color;
      ctx.fillRect(x + 25, yPos - 12, 20, 16);
      
      // Team name
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(car.team.name, x + 50, yPos);
      
      // Lap time
      const lastLap = car.getLastLapTime();
      if (lastLap) {
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '12px Arial';
        ctx.fillText(`${(lastLap / 1000).toFixed(2)}s`, x + 150, yPos);
      }
    });
  }
  
  drawDataPanel() {
    const ctx = this.ctx;
    const panelWidth = 300;
    const panelX = this.canvas.width - panelWidth - 10;
    const panelY = 60;
    
    // Panel background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(panelX, panelY, panelWidth, this.canvas.height - panelY - 10);
    
    // Betting odds section
    this.drawBettingOdds(panelX + 10, panelY + 20);
    
    // NPC activity feed
    this.drawNPCActivity(panelX + 10, panelY + 150);
  }
  
  drawBettingOdds(x, y) {
    const ctx = this.ctx;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Betting Odds', x, y);
    
    const lineHeight = 25;
    this.cars.forEach((car, index) => {
      const yPos = y + 30 + index * lineHeight;
      const odds = this.bettingSystem.market.getOdds(car.team);
      
      // Team color
      ctx.fillStyle = car.team.color;
      ctx.fillRect(x, yPos - 12, 16, 16);
      
      // Team name and odds
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(`${car.team.name}`, x + 20, yPos);
      
      ctx.fillStyle = '#00ff00';
      ctx.textAlign = 'right';
      ctx.fillText(`${odds.toFixed(2)}x`, x + 250, yPos);
      ctx.textAlign = 'left';
    });
  }
  
  drawNPCActivity(x, y) {
    const ctx = this.ctx;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Betting Activity', x, y);
    
    const lineHeight = 40;
    const maxNPCs = 5;
    
    this.bettingSystem.npcs.slice(0, maxNPCs).forEach((npc, index) => {
      const yPos = y + 30 + index * lineHeight;
      
      // NPC name
      ctx.fillStyle = '#ffcc00';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(npc.name, x, yPos);
      
      // NPC dialogue
      if (npc.lastDialogue && npc.dialogueTimer > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px Arial';
        ctx.fillText(`"${npc.lastDialogue}"`, x, yPos + 15);
      }
      
      // Balance
      ctx.fillStyle = '#00ff00';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`$${npc.balance}`, x + 250, yPos);
      ctx.textAlign = 'left';
    });
  }
  
  updateFPS() {
    this.frameCount++;
    const now = Date.now();
    const elapsed = now - this.fpsLastUpdate;
    
    if (elapsed > 1000) {
      this.fps = (this.frameCount * 1000) / elapsed;
      this.frameCount = 0;
      this.fpsLastUpdate = now;
    }
  }
  
  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if hovering over a car
    this.hoveredCar = null;
    this.cars.forEach(car => {
      const dist = Math.sqrt(Math.pow(car.x - x, 2) + Math.pow(car.y - y, 2));
      if (dist < 20) {
        this.hoveredCar = car;
      }
    });
  }
  
  toggleDataPanel() {
    this.showDataPanel = !this.showDataPanel;
  }
} 