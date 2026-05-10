/* particles.js — fluido, multicolor, red roja giratoria */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, dots = [], nodes = [], angle = 0;
  const DOT_COLORS  = ['#f5c842','#e8412a','#3b82f6','#22c55e','#ffffff','#a855f7'];
  const NODE_COLORS = ['#e8412a','#ff6b4a','#ff3a1a'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 8;
      this.r  = Math.random() * 1.8 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.a  = Math.random() * 0.55 + 0.2;
      this.color = DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];
      this.fl = Math.random() * Math.PI * 2;
      this.fs = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.fl += this.fs;
      this.ca = this.a * (0.6 + 0.4 * Math.sin(this.fl));
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.ca;
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 8; ctx.shadowColor = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }

  class Node {
    constructor(i, total) {
      this.index = i; this.total = total;
      this.orbitR = 120 + Math.random() * (Math.min(W,H)*0.3);
      this.speed  = (Math.random() * 0.003 + 0.001) * (Math.random()>0.5?1:-1);
      this.offset = (i / total) * Math.PI * 2;
      this.r      = Math.random() * 3 + 1.5;
      this.a      = Math.random() * 0.5 + 0.3;
      this.pulse  = Math.random() * Math.PI * 2;
      this.ps     = Math.random() * 0.02 + 0.008;
      this.color  = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
      // Centro de órbita aleatorio
      this.cx = W * (0.2 + Math.random() * 0.6);
      this.cy = H * (0.2 + Math.random() * 0.6);
    }
    update() {
      this.offset += this.speed;
      this.pulse  += this.ps;
      this.x = this.cx + Math.cos(this.offset + angle) * this.orbitR;
      this.y = this.cy + Math.sin(this.offset + angle) * this.orbitR;
      this.ca = this.a * (0.55 + 0.45 * Math.sin(this.pulse));
    }
    draw() {
      ctx.save();
      // Halo
      ctx.globalAlpha = this.ca * 0.35;
      const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*6);
      g.addColorStop(0, this.color); g.addColorStop(1,'transparent');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r*6,0,Math.PI*2); ctx.fill();
      // Punto
      ctx.globalAlpha = this.ca;
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 14; ctx.shadowColor = this.color;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }

  function drawLines() {
    for (let i=0; i<nodes.length; i++) {
      for (let j=i+1; j<nodes.length; j++) {
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d<240) {
          ctx.save();
          ctx.globalAlpha = (1-d/240)*0.6;
          ctx.strokeStyle = '#e8412a';
          ctx.lineWidth   = 1;
          ctx.shadowBlur  = 6; ctx.shadowColor='#e8412a';
          ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y);
          ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function init() {
    resize();
    dots  = Array.from({length:50}, ()=>new Dot());
    nodes = Array.from({length:20}, (_,i)=>new Node(i,20));
    window.addEventListener('resize', ()=>{ resize(); nodes=Array.from({length:20},(_,i)=>new Node(i,20)); });
    loop();
  }

  let last=0;
  function loop(ts=0) {
    const dt = Math.min((ts-last)/16, 3); // delta cap para fluidez
    last = ts;
    angle += 0.002 * dt; // rotación global de la red
    ctx.clearRect(0,0,W,H);
    drawLines();
    nodes.forEach(n=>{ n.update(); n.draw(); });
    dots.forEach(d=>{ d.update(); d.draw(); });
    requestAnimationFrame(loop);
  }

  init();
})();
