/* particles.js — partículas doradas de fondo */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 55;
  const COLORS = ['#d4a017', '#f5c842', '#ffffff'];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.flicker = Math.random() * Math.PI * 2;
      this.flickerSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.flicker += this.flickerSpeed;
      this.currentAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.flicker));
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save(); ctx.globalAlpha = this.currentAlpha; ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.save(); ctx.globalAlpha = (1 - dist / 110) * 0.12;
          ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); ctx.restore();
        }
      }
    }
    requestAnimationFrame(loop);
  }

  init();
})();
