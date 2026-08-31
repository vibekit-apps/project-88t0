// Pickleball Pro - AI Coaching App
const App = {
  player: null,
  selectedFocus: null,
  trainingActive: false,
  trainingTimer: null,
  sessionStartTime: null,
  currentDrill: 0,
  drills: [
    { name: 'Cross-Court Exchanges', duration: 10, desc: 'Controlled forehand exchanges across the court. Focus on consistent contact and depth.' },
    { name: 'Inside-Out Shots', duration: 8, desc: 'Target the opposite corner with inside-out forehands. Build angle and placement.' },
    { name: 'Pace Variation', duration: 6, desc: 'Alternate between soft drop shots and hard drives. Learn to control pace strategically.' },
    { name: 'Match Play Simulation', duration: 11, desc: 'Point play scenarios with realistic situations. Apply all learned skills under pressure.' }
  ],

  skills: [
    { id: 'forehand', name: 'Forehand', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
    { id: 'backhand', name: 'Backhand', icon: 'M12 2l10 5-10 5L2 7l10-5z' },
    { id: 'speed', name: 'Speed', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
    { id: 'strength', name: 'Strength', icon: 'M6.5 6.5l11 11M6.5 17.5l11-11M4 12h4M16 12h4M12 4v4M12 16v4' },
    { id: 'topspin', name: 'Topspin', icon: 'M12 2v20M2 12c2-2 4-4 10-4s8 2 10 4c-2 2-4 4-10 4s-8-2-10-4z' },
    { id: 'slice', name: 'Slice', icon: 'M4 20l4-4m4-4l4-4m4-4l4-4' },
    { id: 'volleys', name: 'Volleys', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    { id: 'decision', name: 'Decision Making', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5v4m0 4h.01' },
    { id: 'serve', name: 'Serve', icon: 'M12 22V8M5 12l7-7 7 7' },
    { id: 'return', name: 'Return', icon: 'M12 22V12M12 12l-7-7M12 12l7-7' },
    { id: 'footwork', name: 'Footwork', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { id: 'defense', name: 'Defense', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'reaction', name: 'Reaction', icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
    { id: 'consistency', name: 'Consistency', icon: 'M3 3v18h18M9 17V9m4 8V5m4 13v-5' },
    { id: 'gameiq', name: 'Game IQ', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }
  ],

  init() {
    this.loadPlayer();
    this.bindEvents();
    this.renderSkills();
    this.renderFocusAreas();
    this.updateDisplay();
  },

  loadPlayer() {
    const saved = localStorage.getItem('pickleballPlayer');
    if (saved) {
      this.player = JSON.parse(saved);
    } else {
      this.player = {
        name: 'Jake Patterson',
        username: 'jakep',
        location: 'Denver, CO',
        initials: 'JP',
        overall: 137.42,
        wins: 24,
        losses: 8,
        practiceHours: 47.5,
        weeklyHours: 2.5,
        sessionsThisWeek: 2,
        unlimitedTrainingUntil: null,
        isPro: false,
        skills: {
          forehand: { rating: 94.7, level: 9 },
          backhand: { rating: 76.3, level: 7 },
          speed: { rating: 88.9, level: 8 },
          strength: { rating: 72.1, level: 7 },
          topspin: { rating: 81.4, level: 8 },
          slice: { rating: 68.9, level: 6 },
          volleys: { rating: 95.2, level: 9 },
          decision: { rating: 83.7, level: 8 },
          serve: { rating: 91.3, level: 9 },
          return: { rating: 78.6, level: 7 },
          footwork: { rating: 86.2, level: 8 },
          defense: { rating: 79.5, level: 7 },
          reaction: { rating: 84.1, level: 8 },
          consistency: { rating: 88.3, level: 8 },
          gameiq: { rating: 90.1, level: 9 }
        },
        badges: ['speed', 'matches50'],
        recentSessions: [
          { focus: 'Forehand', duration: 45, date: new Date().toLocaleDateString() },
          { focus: 'Speed', duration: 30, date: 'Yesterday' }
        ]
      };
      this.savePlayer();
    }
  },

  savePlayer() {
    localStorage.setItem('pickleballPlayer', JSON.stringify(this.player));
  },

  bindEvents() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterMatches(btn.dataset.filter);
      });
    });

    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.getElementById('add-match-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitMatch();
    });
  },

  switchTab(tab) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tab);
    });
  },

  renderSkills() {
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = '';

    this.skills.forEach(skill => {
      const data = this.player.skills[skill.id] || { rating: 0, level: 1 };
      const progress = (data.rating % 10) * 10;
      const nextLevel = this.getNextLevelRating(data.rating);

      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `
        <div class="skill-header">
          <div class="skill-name">
            <div class="skill-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="${skill.icon}"/>
              </svg>
            </div>
            ${skill.name}
          </div>
          <div class="rating-level">${data.level}</div>
        </div>
        <div class="skill-rating">
          <span class="rating-value">${data.rating.toFixed(1)}</span>
        </div>
        <div class="skill-progress">
          <div class="progress-fill-skill" style="width: ${progress}%"></div>
        </div>
        <div class="skill-details">
          <span>${data.rating.toFixed(1)} / ${nextLevel}</span>
          <span>${(100 - progress).toFixed(0)}% to Lv ${data.level + 1}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  renderFocusAreas() {
    const grid = document.getElementById('focus-grid');
    grid.innerHTML = '';

    const mainSkills = ['forehand', 'backhand', 'speed', 'serve', 'volleys', 'defense', 'reaction', 'footwork'];

    mainSkills.forEach(id => {
      const skill = this.skills.find(s => s.id === id);
      const data = this.player.skills[id];
      if (!skill) return;

      const btn = document.createElement('button');
      btn.className = 'focus-btn';
      btn.innerHTML = `
        <div class="si-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="${skill.icon}"/>
          </svg>
        </div>
        <span>${skill.name}</span>
      `;
      btn.addEventListener('click', () => this.selectFocus(skill.id));
      grid.appendChild(btn);
    });
  },

  selectFocus(skillId) {
    if (this.player.sessionsThisWeek <= 0 && !this.player.isPro && !this.hasUnlimitedTraining()) {
      alert('No training sessions remaining this week!');
      return;
    }

    this.selectedFocus = skillId;
    const skill = this.skills.find(s => s.id === skillId);
    document.getElementById('modal-focus-title').textContent = `${skill.name} Training`;
    document.getElementById('training-modal').classList.add('active');
  },

  closeTrainingModal() {
    document.getElementById('training-modal').classList.remove('active');
  },

  startTraining() {
    if (this.trainingActive) return;

    if (!this.player.isPro && !this.hasUnlimitedTraining()) {
      this.player.sessionsThisWeek--;
      this.savePlayer();
    }

    this.trainingActive = true;
    this.currentDrill = 0;
    this.sessionStartTime = Date.now();
    this.closeTrainingModal();

    document.getElementById('active-training').style.display = 'block';
    document.getElementById('session-focus').textContent = `${this.skills.find(s => s.id === this.selectedFocus).name} Training`;
    this.updateTrainingDisplay();

    this.trainingTimer = setInterval(() => this.tick(), 1000);
  },

  tick() {
    if (!this.trainingActive) return;

    const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('session-time').textContent = `${mins}:${secs}`;
  },

  updateTrainingDisplay() {
    const drill = this.drills[this.currentDrill];
    document.getElementById('drill-description').textContent = drill.desc;
    document.getElementById('session-drill').textContent = `Drill ${this.currentDrill + 1} of ${this.drills.length}`;

    const progress = ((this.currentDrill) / this.drills.length) * 100;
    document.getElementById('session-progress-fill').style.width = `${progress}%`;
  },

  endTraining() {
    if (!this.trainingActive) return;

    clearInterval(this.trainingTimer);
    this.trainingActive = false;

    const skillId = this.selectedFocus;
    const data = this.player.skills[skillId];
    const prevRating = data.rating;
    const prevLevel = data.level;

    // Simulate rating gain
    const gain = 0.2 + Math.random() * 0.3;
    data.rating = Math.min(100, data.rating + gain);
    data.level = this.calculateLevel(data.rating);

    // Update weekly hours
    const elapsed = (Date.now() - this.sessionStartTime) / (1000 * 60 * 60);
    this.player.practiceHours += elapsed;
    this.player.weeklyHours += elapsed;

    // Add to recent sessions
    this.player.recentSessions.unshift({
      focus: this.skills.find(s => s.id === skillId).name,
      duration: Math.round(elapsed * 60),
      date: new Date().toLocaleDateString()
    });

    // Check for level up
    if (data.level > prevLevel) {
      this.showLevelUp(this.skills.find(s => s.id === skillId).name, prevLevel + 1, prevRating, data.rating);
    }

    this.savePlayer();
    this.updateDisplay();
    this.renderSkills();

    document.getElementById('active-training').style.display = 'none';
  },

  calculateLevel(rating) {
    if (rating >= 100) return 10;
    if (rating >= 95) return 9;
    if (rating >= 90) return 8;
    if (rating >= 85) return 7;
    if (rating >= 80) return 6;
    if (rating >= 70) return 5;
    if (rating >= 60) return 4;
    if (rating >= 50) return 3;
    if (rating >= 30) return 2;
    return 1;
  },

  getNextLevelRating(rating) {
    if (rating >= 100) return 100;
    if (rating >= 95) return 100;
    if (rating >= 90) return 95;
    if (rating >= 85) return 90;
    if (rating >= 80) return 85;
    if (rating >= 70) return 80;
    if (rating >= 60) return 70;
    if (rating >= 50) return 60;
    if (rating >= 30) return 50;
    return 30;
  },

  showLevelUp(skillName, newLevel, prevRating, currentRating) {
    document.getElementById('levelup-skill').textContent = `${skillName} reached`;
    document.getElementById('levelup-number').textContent = `Level ${newLevel}`;
    document.getElementById('levelup-prev').textContent = prevRating.toFixed(1);
    document.getElementById('levelup-current').textContent = currentRating.toFixed(1);
    document.getElementById('levelup-modal').classList.add('active');
  },

  closeLevelUp() {
    document.getElementById('levelup-modal').classList.remove('active');
  },

  hasUnlimitedTraining() {
    if (!this.player.unlimitedTrainingUntil) return false;
    return new Date(this.player.unlimitedTrainingUntil) > new Date();
  },

  updateDisplay() {
    // Player card
    document.getElementById('player-name').textContent = this.player.name;
    document.getElementById('player-username').textContent = `@${this.player.username} • ${this.player.location}`;
    document.getElementById('player-avatar').textContent = this.player.initials;
    document.getElementById('overall-rating').textContent = this.player.overall.toFixed(2);
    document.getElementById('wins').textContent = this.player.wins;
    document.getElementById('losses').textContent = this.player.losses;
    document.getElementById('matches').textContent = this.player.wins + this.player.losses;
    document.getElementById('practice-hours').textContent = `${this.player.practiceHours.toFixed(1)} hrs`;

    const maxHours = 100;
    const hoursProgress = Math.min(100, (this.player.practiceHours / maxHours) * 100);
    document.getElementById('hours-progress').style.width = `${hoursProgress}%`;

    // Top level
    const maxSkill = Math.max(...Object.values(this.player.skills).map(s => s.level));
    document.getElementById('top-level').textContent = maxSkill;

    // Top skills
    const topSkills = Object.entries(this.player.skills)
      .sort((a, b) => b[1].rating - a[1].rating)
      .slice(0, 3);

    const topSkillsEl = document.getElementById('top-skills');
    topSkillsEl.innerHTML = topSkills.map(([id, data]) => {
      const skill = this.skills.find(s => s.id === id);
      return `<span class="skill-tag">${skill.name}</span>`;
    }).join('');

    // Training limit
    if (this.player.isPro || this.hasUnlimitedTraining()) {
      document.getElementById('training-limit').innerHTML = `
        <span class="limit-label">Unlimited Training</span>
        <span class="limit-value" style="color: var(--success);">Active</span>
      `;
    } else {
      document.getElementById('sessions-left').textContent = this.player.sessionsThisWeek;
    }

    // Weekly goal
    const goalProgress = document.getElementById('goal-progress');
    const goalStatus = document.getElementById('goal-status');

    if (this.hasUnlimitedTraining()) {
      const remaining = Math.ceil((new Date(this.player.unlimitedTrainingUntil) - new Date()) / (1000 * 60 * 60 * 24));
      goalProgress.textContent = `Unlimited training active!`;
      goalStatus.innerHTML = `<span class="status-active">${remaining} days left</span>`;
    } else {
      goalProgress.textContent = `${this.player.weeklyHours.toFixed(1)} / 4.0 hours this week`;
      const needed = Math.max(0, 4 - this.player.weeklyHours);
      goalStatus.innerHTML = `<span class="status-locked">${needed.toFixed(1)} hrs needed</span>`;
    }
  },

  filterMatches(filter) {
    const cards = document.querySelectorAll('.match-card');
    cards.forEach(card => {
      const type = card.querySelector('.mc-type').textContent.toLowerCase().replace(' ', '');
      if (filter === 'all') {
        card.style.display = 'flex';
      } else if (filter === 'official' && (type === 'official' || type === 'win' || type === 'loss')) {
        card.style.display = 'flex';
      } else if (filter === 'pending' && type.includes('pending')) {
        card.style.display = 'flex';
      } else if (filter === 'practice' && type.includes('practice')) {
        card.style.display = 'flex';
      } else {
        card.style.display = filter === 'official' && (card.classList.contains('won') || card.classList.contains('lost')) ? 'flex' : 'none';
      }
    });
  },

  showAddMatch() {
    document.getElementById('add-match-modal').classList.add('active');
  },

  closeAddMatch() {
    document.getElementById('add-match-modal').classList.remove('active');
  },

  submitMatch() {
    const yourScore = parseInt(document.getElementById('your-score').value);
    const oppScore = parseInt(document.getElementById('opp-score').value);
    const oppName = document.getElementById('opp-name').value;
    const type = document.querySelector('.type-btn.active').dataset.type;

    const won = yourScore > oppScore;

    if (won) {
      this.player.wins++;
      const gain = 1.5 + Math.random() * 1.5;
      this.player.overall = Math.min(999, this.player.overall + gain);

      // Boost a random skill
      const skillIds = Object.keys(this.player.skills);
      const randomSkill = skillIds[Math.floor(Math.random() * skillIds.length)];
      this.player.skills[randomSkill].rating = Math.min(100, this.player.skills[randomSkill].rating + 0.3);
    } else {
      this.player.losses++;
      const loss = 0.8 + Math.random() * 1;
      this.player.overall = Math.max(0, this.player.overall - loss);
    }

    this.savePlayer();
    this.updateDisplay();
    this.closeAddMatch();
    document.getElementById('add-match-form').reset();
  }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => App.init());