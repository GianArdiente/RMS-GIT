/* ============================================================
   particles.js
   Ambient gold particle canvas animation rendered in the
   background. Self-contained IIFE — no external dependencies.
   ============================================================ */

(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x       = Math.random() * W;
      this.y       = H + 10;
      this.r       = Math.random() * 1.4 + 0.4;
      this.vy      = -(Math.random() * 0.5 + 0.2);
      this.vx      = (Math.random() - 0.5) * 0.25;
      this.life    = 0;
      this.maxLife = Math.random() * 320 + 150;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const t = this.life / this.maxLife;
      this.alpha = t < 0.1 ? t * 6 : t > 0.72 ? (1 - t) * 3.4 : 0.55;
      if (this.life >= this.maxLife) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(166,127,56,${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 45 }, () => new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();