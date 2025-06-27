// Betting System for the racing simulation
import { NPCS, BETTING_CONFIG } from './constants';

export class NPC {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.riskTolerance = config.riskTolerance;
    this.betSize = config.betSize;
    this.strategy = config.strategy;
    this.dialogue = config.dialogue;
    
    this.balance = BETTING_CONFIG.STARTING_BALANCE;
    this.currentBet = null;
    this.betHistory = [];
    this.lastDialogue = null;
    this.dialogueTimer = 0;
  }
  
  update(raceState, bettingMarket) {
    // Update dialogue timer
    if (this.dialogueTimer > 0) {
      this.dialogueTimer--;
    }
    
    // Place bet if haven't already
    if (!this.currentBet && raceState.status === 'racing') {
      this.placeBet(raceState, bettingMarket);
    }
    
    // React to race events
    if (this.currentBet && Math.random() < 0.01) {
      this.reactToRace(raceState);
    }
  }
  
  placeBet(raceState, bettingMarket) {
    const team = this.selectTeam(raceState, bettingMarket);
    const amount = this.calculateBetAmount();
    
    if (amount > 0 && amount <= this.balance) {
      this.currentBet = {
        team: team,
        amount: amount,
        odds: bettingMarket.getOdds(team),
        timestamp: Date.now()
      };
      
      this.balance -= amount;
      bettingMarket.placeBet(team, amount, this.id);
      
      this.showDialogue(this.getBettingDialogue(team));
    }
  }
  
  selectTeam(raceState, bettingMarket) {
    switch (this.strategy) {
      case 'emotional':
        // Mad Max - bet on whoever's leading or most exciting
        const leader = raceState.getLeader();
        return leader ? leader.team : raceState.cars[0].team;
        
      case 'statistical':
        // Calculator Kate - bet on best average lap time
        let bestAvg = Infinity;
        let bestTeam = null;
        raceState.cars.forEach(car => {
          const avg = car.getAverageLapTime();
          if (avg < bestAvg) {
            bestAvg = avg;
            bestTeam = car.team;
          }
        });
        return bestTeam || raceState.cars[0].team;
        
      case 'follow_leader':
        // Momentum Mike - bet on current race leader
        const currentLeader = raceState.getPositionLeader();
        return currentLeader ? currentLeader.team : raceState.cars[0].team;
        
      case 'anti_popular':
        // Contrarian Carol - bet on least popular
        const leastPopular = bettingMarket.getLeastBetTeam();
        return leastPopular || raceState.cars[0].team;
        
      case 'random_learning':
        // Rookie Robert - random with slight bias towards previous winners
        const randomIndex = Math.floor(Math.random() * raceState.cars.length);
        return raceState.cars[randomIndex].team;
        
      default:
        return raceState.cars[0].team;
    }
  }
  
  calculateBetAmount() {
    const baseAmount = {
      'small': 50,
      'medium': 200,
      'large': 500,
      'calculated': this.balance * 0.1
    }[this.betSize] || 100;
    
    // Apply risk tolerance
    const variance = baseAmount * 0.5 * this.riskTolerance;
    const amount = baseAmount + (Math.random() - 0.5) * variance;
    
    return Math.min(Math.floor(amount), this.balance);
  }
  
  getBettingDialogue(team) {
    const teamDialogue = {
      'emotional': [
        `All in on ${team.name}!`,
        `${team.name} is on fire today!`,
        `I can feel it - ${team.name} takes this!`
      ],
      'statistical': [
        `Data shows ${team.name} with ${Math.floor(Math.random() * 20 + 60)}% win probability`,
        `${team.name}'s lap consistency is optimal`,
        `Statistical edge clearly favors ${team.name}`
      ],
      'follow_leader': [
        `${team.name} is leading - can't argue with that!`,
        `Going with the flow on ${team.name}`,
        `The momentum is with ${team.name}`
      ],
      'anti_popular': [
        `Everyone's sleeping on ${team.name}`,
        `${team.name} at these odds? Yes please!`,
        `Time to go against the grain with ${team.name}`
      ],
      'random_learning': [
        `I'll try ${team.name} this time!`,
        `${team.name} looks good... I think?`,
        `Learning as I go - ${team.name} it is!`
      ]
    };
    
    const phrases = teamDialogue[this.strategy] || this.dialogue;
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  reactToRace(raceState) {
    if (this.dialogueTimer > 0) return;
    
    const myTeamCar = raceState.cars.find(car => car.team.id === this.currentBet.team.id);
    if (!myTeamCar) return;
    
    // React based on position changes
    const reactions = {
      'emotional': [
        myTeamCar.position === 1 ? "YES! That's what I'm talking about!" : "Come on, push harder!",
        "This is intense!",
        "My heart can't take this!"
      ],
      'statistical': [
        `Current probability adjustment: ${myTeamCar.position <= 2 ? '+' : '-'}${Math.floor(Math.random() * 10)}%`,
        "Lap times remain consistent",
        "Data tracking as expected"
      ],
      'follow_leader': [
        myTeamCar.position === 1 ? "Still in the lead!" : "Need to get back up there!",
        "Following the action closely",
        "The race is developing nicely"
      ],
      'anti_popular': [
        "Just wait, you'll all see",
        "The odds are shifting in my favor",
        "Patience pays off"
      ],
      'random_learning': [
        "Is this good? I think this is good!",
        "Oh! Something happened!",
        "Still figuring this out..."
      ]
    };
    
    const phrases = reactions[this.strategy] || ["Watching closely..."];
    this.showDialogue(phrases[Math.floor(Math.random() * phrases.length)]);
  }
  
  showDialogue(text) {
    this.lastDialogue = text;
    this.dialogueTimer = 180; // 3 seconds at 60fps
  }
  
  completeBet(won, payout) {
    this.betHistory.push({
      ...this.currentBet,
      won: won,
      payout: payout
    });
    
    if (won) {
      this.balance += payout;
      this.showDialogue(this.getWinDialogue());
    } else {
      this.showDialogue(this.getLoseDialogue());
    }
    
    this.currentBet = null;
  }
  
  getWinDialogue() {
    const winPhrases = {
      'emotional': ["YESSS! I knew it!", "What a rush!", "That's how it's done!"],
      'statistical': ["Calculation correct", "Probability in my favor", "Data doesn't lie"],
      'follow_leader': ["Following the winner!", "The trend continues!", "Momentum pays off!"],
      'anti_popular': ["Told you so!", "Against all odds!", "Who's laughing now?"],
      'random_learning': ["I won? I WON!", "Hey, I'm getting good at this!", "Lucky guess!"]
    };
    
    const phrases = winPhrases[this.strategy] || ["Winner!"];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  getLoseDialogue() {
    const losePhrases = {
      'emotional': ["No! How could this happen?", "Next time for sure!", "I can't believe it..."],
      'statistical': ["Anomaly detected", "Recalculating...", "Statistical outlier"],
      'follow_leader': ["Even leaders fall", "Time to reassess", "The tide has turned"],
      'anti_popular': ["Sometimes the crowd wins", "I'll show them next time", "Contrarian life is hard"],
      'random_learning': ["Oops... still learning", "Maybe next time?", "That didn't work..."]
    };
    
    const phrases = losePhrases[this.strategy] || ["Better luck next time"];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
}

export class BettingMarket {
  constructor() {
    this.bets = new Map(); // team.id -> array of bets
    this.totalPool = 0;
    this.odds = new Map(); // team.id -> current odds
  }
  
  placeBet(team, amount, npcId) {
    if (!this.bets.has(team.id)) {
      this.bets.set(team.id, []);
    }
    
    this.bets.get(team.id).push({
      npcId: npcId,
      amount: amount,
      timestamp: Date.now()
    });
    
    this.totalPool += amount;
    this.updateOdds();
  }
  
  updateOdds() {
    // Simple parimutuel odds calculation
    this.bets.forEach((bets, teamId) => {
      const teamTotal = bets.reduce((sum, bet) => sum + bet.amount, 0);
      const odds = teamTotal > 0 ? this.totalPool / teamTotal : BETTING_CONFIG.BASE_ODDS;
      this.odds.set(teamId, Math.max(1.1, odds)); // Minimum 1.1x payout
    });
  }
  
  getOdds(team) {
    return this.odds.get(team.id) || BETTING_CONFIG.BASE_ODDS;
  }
  
  getLeastBetTeam() {
    let minBets = Infinity;
    let leastPopularTeam = null;
    
    this.bets.forEach((bets, teamId) => {
      const totalBets = bets.reduce((sum, bet) => sum + bet.amount, 0);
      if (totalBets < minBets) {
        minBets = totalBets;
        leastPopularTeam = teamId;
      }
    });
    
    return leastPopularTeam;
  }
  
  getTeamBettingSupport(teamId) {
    const teamBets = this.bets.get(teamId) || [];
    const teamTotal = teamBets.reduce((sum, bet) => sum + bet.amount, 0);
    return this.totalPool > 0 ? teamTotal / this.totalPool : 0;
  }
  
  settleBets(winningTeam, npcs) {
    const winningBets = this.bets.get(winningTeam.id) || [];
    const winningOdds = this.getOdds(winningTeam);
    
    winningBets.forEach(bet => {
      const npc = npcs.find(n => n.id === bet.npcId);
      if (npc) {
        const payout = bet.amount * winningOdds;
        npc.completeBet(true, payout);
      }
    });
    
    // Notify losing NPCs
    this.bets.forEach((bets, teamId) => {
      if (teamId !== winningTeam.id) {
        bets.forEach(bet => {
          const npc = npcs.find(n => n.id === bet.npcId);
          if (npc) {
            npc.completeBet(false, 0);
          }
        });
      }
    });
    
    // Reset for next race
    this.bets.clear();
    this.totalPool = 0;
    this.odds.clear();
  }
}

export class BettingSystem {
  constructor() {
    this.npcs = Object.values(NPCS).map(config => new NPC(config));
    this.market = new BettingMarket();
  }
  
  update(raceState) {
    this.npcs.forEach(npc => npc.update(raceState, this.market));
  }
  
  getTeamSupport(teamId) {
    return this.market.getTeamBettingSupport(teamId);
  }
  
  completeRace(winningTeam) {
    this.market.settleBets(winningTeam, this.npcs);
  }
} 