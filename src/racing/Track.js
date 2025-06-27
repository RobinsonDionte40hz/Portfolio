// Track class for the racing simulation

export class Track {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    
    // Define track as an oval with inner and outer boundaries
    this.outerRadius = Math.min(width, height) * 0.45;
    this.innerRadius = this.outerRadius * 0.6;
    
    // Track sections for AI decision making
    this.sections = this.generateTrackSections();
    
    // Start/finish line
    this.startLine = {
      x: this.centerX + this.outerRadius * 0.8,
      y: this.centerY,
      width: 60,
      height: 4
    };
    
    // Pit lane
    this.pitLane = {
      entrance: { x: this.centerX - this.outerRadius * 0.8, y: this.centerY + 50 },
      exit: { x: this.centerX - this.outerRadius * 0.8, y: this.centerY - 50 },
      spots: this.generatePitSpots()
    };
  }
  
  generateTrackSections() {
    const sections = [];
    const numSections = 16;
    
    for (let i = 0; i < numSections; i++) {
      const angle = (i / numSections) * Math.PI * 2;
      const nextAngle = ((i + 1) / numSections) * Math.PI * 2;
      
      sections.push({
        id: i,
        startAngle: angle,
        endAngle: nextAngle,
        type: this.getSectionType(angle),
        idealSpeed: this.getIdealSpeed(angle)
      });
    }
    
    return sections;
  }
  
  getSectionType(angle) {
    // Straight sections at 0, π/2, π, 3π/2
    const straightAngles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
    const tolerance = Math.PI / 8;
    
    for (const straight of straightAngles) {
      if (Math.abs(angle - straight) < tolerance) {
        return 'straight';
      }
    }
    
    return 'corner';
  }
  
  getIdealSpeed(angle) {
    const sectionType = this.getSectionType(angle);
    return sectionType === 'straight' ? 1.0 : 0.7;
  }
  
  generatePitSpots() {
    const spots = [];
    for (let i = 0; i < 4; i++) {
      spots.push({
        x: this.centerX,
        y: this.centerY + this.innerRadius - 30 - (i * 40),
        occupied: false,
        teamId: null
      });
    }
    return spots;
  }
  
  getIdealLine(angle) {
    // Calculate the ideal racing line (between inner and outer radius)
    const radius = (this.innerRadius + this.outerRadius) / 2;
    
    // Adjust for corners - take wider line
    const sectionType = this.getSectionType(angle);
    const lineAdjustment = sectionType === 'corner' ? 1.1 : 1.0;
    
    return {
      x: this.centerX + Math.cos(angle) * radius * lineAdjustment,
      y: this.centerY + Math.sin(angle) * radius * lineAdjustment
    };
  }
  
  isOnTrack(x, y) {
    const distance = Math.sqrt(
      Math.pow(x - this.centerX, 2) + 
      Math.pow(y - this.centerY, 2)
    );
    
    return distance >= this.innerRadius && distance <= this.outerRadius;
  }
  
  getCurrentSection(x, y) {
    const angle = Math.atan2(y - this.centerY, x - this.centerX);
    const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;
    
    return this.sections.find(section => 
      normalizedAngle >= section.startAngle && 
      normalizedAngle < section.endAngle
    );
  }
  
  checkStartLineCrossing(previousPos, currentPos) {
    // Simple check if car crossed the start/finish line
    const prevX = previousPos.x;
    const currX = currentPos.x;
    const lineX = this.startLine.x;
    
    // Check if we crossed from left to right
    if (prevX < lineX && currX >= lineX) {
      // Make sure we're in the right Y range
      const lineY = this.startLine.y;
      const tolerance = 50;
      if (Math.abs(currentPos.y - lineY) < tolerance) {
        return true;
      }
    }
    
    return false;
  }
  
  draw(ctx) {
    // Draw track surface
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw track boundaries
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    // Outer boundary
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.outerRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner boundary
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw track surface
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.outerRadius, 0, Math.PI * 2);
    ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, Math.PI * 2, true);
    ctx.fill();
    
    // Draw start/finish line
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      this.startLine.x - this.startLine.width / 2,
      this.startLine.y - this.startLine.height / 2,
      this.startLine.width,
      this.startLine.height
    );
    
    // Draw pit lane
    this.drawPitLane(ctx);
    
    // Draw racing line (subtle)
    this.drawRacingLine(ctx);
  }
  
  drawPitLane(ctx) {
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Draw pit lane entrance/exit
    ctx.beginPath();
    ctx.moveTo(this.pitLane.entrance.x, this.pitLane.entrance.y);
    ctx.lineTo(this.centerX, this.centerY + this.innerRadius - 10);
    ctx.lineTo(this.centerX, this.centerY + this.innerRadius - 150);
    ctx.lineTo(this.pitLane.exit.x, this.pitLane.exit.y);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Draw pit spots
    ctx.fillStyle = '#444444';
    this.pitLane.spots.forEach(spot => {
      ctx.fillRect(spot.x - 15, spot.y - 20, 30, 40);
    });
  }
  
  drawRacingLine(ctx) {
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const point = this.getIdealLine(angle);
      
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
  }
} 