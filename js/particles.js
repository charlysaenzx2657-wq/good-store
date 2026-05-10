/* particles.js — partículas doradas + líneas rojas de fondo */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let goldParticles = [];
  let redNodes = [];
  const GOLD_COUNT = 45;
  const RED_COUNT = 18;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  /* ── PARTÍCULAS DORADAS ── */
  class GoldParticle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.6 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.45 + 0.15);
      this.alpha = Math.random() * 0.45 + 0.1;
      this.color = Math.random() > 0.5 ? '#d4a017' : '#f5c842';
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
      ctx.save(); ctx.globalAlpha = this.currentAlpha;
      ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    }
  }

  /* ── NODOS ROJOS (puntos conectados) ── */
  class RedNode {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : Math.random() * H;
      this.r = Math.random() * 2.5 + 1;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.015 + 0.008;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.pulse += this.pulseSpeed;
      this.currentAlpha = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
      // rebotar en bordes
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.save(); ctx.globalAlpha = this.currentAlpha;
      ctx.fillStyle = '#e8412a';
      // halo
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      grad.addColorStop(0, 'rgba(232,65,42,0.6)');
      grad.addColorStop(1, 'rgba(232,65,42,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fill();
      // punto
      ctx.fillStyle = '#ff6b4a';
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawRedLines() {
    for (let i = 0; i < redNodes.length; i++) {
      for (let j = i + 1; j < redNodes.length; j++) {
        const dx = redNodes[i].x - redNodes[j].x;
        const dy = redNodes[i].y - redNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 200) * 0.18;
          ctx.strokeStyle = '#e8412a';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(redNodes[i].x, redNodes[i].y);
          ctx.lineTo(redNodes[j].x, redNodes[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function init() {
    resize();
    goldParticles = Array.from({ length: GOLD_COUNT }, () => new GoldParticle());
    redNodes = Array.from({ length: RED_COUNT }, () => new RedNode());
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Líneas rojas primero (fondo)
    drawRedLines();
    redNodes.forEach(n => { n.update(); n.draw(); });

    // Partículas doradas encima
    goldParticles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(loop);
  }

  init();
})();
