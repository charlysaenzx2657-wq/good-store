/* particles.js — partículas multicolor + red roja visible */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let dots = [];
  let nodes = [];
  const DOT_COUNT  = 50;
  const NODE_COUNT = 22;

  // Colores de partículas flotantes
  const DOT_COLORS = ['#f5c842','#e8412a','#3b82f6','#22c55e','#ffffff','#d4a017'];
  // Colores de nodos conectados
  const NODE_COLORS = ['#e8412a','#ff6b4a','#ff3a1a'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── PARTÍCULAS FLOTANTES ── */
  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 8;
      this.r     = Math.random() * 2 + 0.5;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = -(Math.random() * 0.5 + 0.15);
      this.alpha = Math.random() * 0.55 + 0.2;
      this.color = DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];
      this.flicker = Math.random() * Math.PI * 2;
      this.fSpeed  = Math.random() * 0.025 + 0.008;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.flicker += this.fSpeed;
      this.ca = this.alpha * (0.65 + 0.35 * Math.sin(this.flicker));
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.ca;
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ── NODOS CONECTADOS (red roja) ── */
  class Node {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : Math.random() * H;
      this.r     = Math.random() * 3 + 1.5;
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.5 + 0.3;
      this.pulse = Math.random() * Math.PI * 2;
      this.pSpeed= Math.random() * 0.018 + 0.008;
      this.color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.pulse += this.pSpeed;
      this.ca = this.alpha * (0.55 + 0.45 * Math.sin(this.pulse));
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      // Halo
      ctx.save();
      ctx.globalAlpha = this.ca * 0.4;
      const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*5);
      g.addColorStop(0, this.color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r*5, 0, Math.PI*2);
      ctx.fill();
      // Punto
      ctx.globalAlpha = this.ca;
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 12;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawLines() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 220) {
          const alpha = (1 - dist/220) * 0.55;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#e8412a';
          ctx.lineWidth   = 1;
          ctx.shadowBlur  = 4;
          ctx.shadowColor = '#e8412a';
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function init() {
    resize();
    dots  = Array.from({length: DOT_COUNT},  () => new Dot());
    nodes = Array.from({length: NODE_COUNT}, () => new Node());
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    nodes.forEach(n => { n.update(); n.draw(); });
    dots.forEach(d  => { d.update(); d.draw(); });
    requestAnimationFrame(loop);
  }

  init();
})();
