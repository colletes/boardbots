/**
 * Eleven: Football Manager — Persistent Championship / League Table (v1)
 *
 * Models the official 6-week season league table for Eleven.
 * Supports:
 * - 6-week fixtures schedule across divisions (England, Spain, France, Brazil)
 * - Automatic points, goal difference, win/draw/loss calculation
 * - Tie-breaker hierarchy: PTS -> GD (SG) -> GF (GP) -> Alphabetical
 * - Promotion and Relegation zones
 * - Persistent storage in localStorage ('boardbots_eleven_league_v1')
 * - Direct bridge from Match Solver to record results
 * - Realistic AI fixture simulation for other division teams
 * - Import / Export JSON & Reset confirmation
 */

const ELEVEN_LEAGUE_STORAGE_KEY = 'boardbots_eleven_league_v1';

const ElevenLeague = {
  data: {
    league: 'official',
    division: '3',
    userTeam: 'Brickton FC',
    week: 1,
    teams: [],
    fixtures: [] // 6 rounds of matches
  },

  // Generates round-robin fixtures for teams over 6 weeks
  generateFixtures: function(teams, totalWeeks = 6) {
    if (!teams || teams.length < 2) return [];
    
    let pool = [...teams];
    if (pool.length % 2 !== 0) {
      pool.push('Folga');
    }
    
    const n = pool.length;
    const roundsCount = totalWeeks;
    const fixtures = [];
    
    let rotation = [...pool];
    
    for (let r = 0; r < roundsCount; r++) {
      const roundMatches = [];
      const half = n / 2;
      for (let i = 0; i < half; i++) {
        const home = rotation[i];
        const away = rotation[n - 1 - i];
        if (home !== 'Folga' && away !== 'Folga') {
          const isHomeFirst = (r + i) % 2 === 0;
          roundMatches.push({
            id: `w${r + 1}_m${i + 1}`,
            home: isHomeFirst ? home : away,
            away: isHomeFirst ? away : home,
            homeScore: null,
            awayScore: null,
            played: false
          });
        }
      }
      fixtures.push({
        week: r + 1,
        matches: roundMatches
      });
      
      const fixed = rotation[0];
      const rest = rotation.slice(1);
      rest.unshift(rest.pop());
      rotation = [fixed, ...rest];
    }
    
    return fixtures;
  },

  // Initializes or resets the league for given country & division
  initLeague: function(league = 'official', division = '3', userTeam = null) {
    const divisionTeams = (typeof TEAM_DATA !== 'undefined' && TEAM_DATA[league] && TEAM_DATA[league][division])
      ? [...TEAM_DATA[league][division]].slice(0, 8)
      : ['Brickton FC', 'Middleham FC', 'Dafton United', 'Royalford Town', 'Blackston Kings', 'Redbridge Rovers', 'Eastwood City', 'Southgate Athletic'];

    const chosenUserTeam = userTeam && divisionTeams.includes(userTeam) 
      ? userTeam 
      : divisionTeams[0];

    const teams = divisionTeams.map(name => ({
      name,
      isUser: name === chosenUserTeam
    }));

    const fixtures = this.generateFixtures(divisionTeams, 6);

    this.data = {
      league,
      division,
      userTeam: chosenUserTeam,
      week: 1,
      teams,
      fixtures
    };

    this.saveState();
    return this.data;
  },

  // Calculates current standings based on played matches
  computeStandings: function() {
    const statsMap = {};
    this.data.teams.forEach(t => {
      statsMap[t.name] = {
        name: t.name,
        isUser: t.name === this.data.userTeam,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        points: 0
      };
    });

    this.data.fixtures.forEach(round => {
      round.matches.forEach(m => {
        if (m.played && m.homeScore !== null && m.awayScore !== null) {
          const h = statsMap[m.home];
          const a = statsMap[m.away];
          if (h && a) {
            h.played++;
            a.played++;
            h.goalsFor += m.homeScore;
            h.goalsAgainst += m.awayScore;
            a.goalsFor += m.awayScore;
            a.goalsAgainst += m.homeScore;

            if (m.homeScore > m.awayScore) {
              h.won++;
              h.points += 3;
              a.lost++;
            } else if (m.homeScore === m.awayScore) {
              h.drawn++;
              h.points += 1;
              a.drawn++;
              a.points += 1;
            } else {
              a.won++;
              a.points += 3;
              h.lost++;
            }
          }
        }
      });
    });

    const standings = Object.values(statsMap).map(s => {
      s.goalDiff = s.goalsFor - s.goalsAgainst;
      return s;
    });

    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.name.localeCompare(b.name);
    });

    return standings;
  },

  // Records a match score
  setMatchScore: function(weekNum, matchId, homeScore, awayScore) {
    const round = this.data.fixtures.find(f => f.week === weekNum);
    if (!round) return false;
    const match = round.matches.find(m => m.id === matchId);
    if (!match) return false;

    if (homeScore === '' || awayScore === '' || homeScore === null || awayScore === null) {
      match.homeScore = null;
      match.awayScore = null;
      match.played = false;
    } else {
      match.homeScore = parseInt(homeScore, 10);
      match.awayScore = parseInt(awayScore, 10);
      match.played = true;
    }

    this.saveState();
    return true;
  },

  // Bridge from Solver: applies the solved match to the user's match in current week
  applySolverMatch: function(userGoals, opponentGoals) {
    const currentWeek = this.data.week || 1;
    const round = this.data.fixtures.find(f => f.week === currentWeek);
    if (!round) return null;

    const userMatch = round.matches.find(m => m.home === this.data.userTeam || m.away === this.data.userTeam);
    if (!userMatch) return null;

    if (userMatch.home === this.data.userTeam) {
      userMatch.homeScore = userGoals;
      userMatch.awayScore = opponentGoals;
    } else {
      userMatch.homeScore = opponentGoals;
      userMatch.awayScore = userGoals;
    }
    userMatch.played = true;

    this.saveState();
    return { week: currentWeek, match: userMatch };
  },

  // Simulates remaining unplayed matches for a given week with realistic Eleven scores
  simulateRemainingWeekMatches: function(weekNum) {
    const round = this.data.fixtures.find(f => f.week === weekNum);
    if (!round) return 0;

    let simCount = 0;
    const generateGoals = () => {
      const r = Math.random();
      if (r < 0.28) return 0;
      if (r < 0.62) return 1;
      if (r < 0.86) return 2;
      if (r < 0.96) return 3;
      return 4;
    };

    round.matches.forEach(m => {
      if (!m.played) {
        m.homeScore = generateGoals();
        m.awayScore = generateGoals();
        m.played = true;
        simCount++;
      }
    });

    this.saveState();
    return simCount;
  },

  // Changes active user team
  setUserTeam: function(newTeamName) {
    this.data.userTeam = newTeamName;
    this.data.teams.forEach(t => {
      t.isUser = (t.name === newTeamName);
    });
    this.saveState();
  },

  // Advance or jump to week
  setWeek: function(w) {
    if (w >= 1 && w <= 6) {
      this.data.week = w;
      this.saveState();
    }
  },

  // Save / Load / Export / Import
  saveState: function() {
    try {
      localStorage.setItem(ELEVEN_LEAGUE_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save Eleven League state:", e);
    }
  },

  loadState: function() {
    try {
      const raw = localStorage.getItem(ELEVEN_LEAGUE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.fixtures) && Array.isArray(parsed.teams)) {
          this.data = parsed;
          return true;
        }
      }
    } catch (e) {
      console.error("Failed to load Eleven League state:", e);
    }
    return false;
  },

  exportJSON: function() {
    return JSON.stringify(this.data, null, 2);
  },

  importJSON: function(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.fixtures) && Array.isArray(parsed.teams)) {
        this.data = parsed;
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error("Invalid Eleven League JSON:", e);
    }
    return false;
  }
};

if (typeof window !== 'undefined') {
  window.ElevenLeague = ElevenLeague;
  window.ELEVEN_LEAGUE_STORAGE_KEY = ELEVEN_LEAGUE_STORAGE_KEY;
}

if (typeof module !== 'undefined') {
  module.exports = { ElevenLeague, ELEVEN_LEAGUE_STORAGE_KEY };
}
