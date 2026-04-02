import { useEffect, useRef } from 'react';

class Star {
  constructor(initial = false) { this.reset(initial); }
  reset(initial = false) {
    this.x = (Math.random() - 0.5) * 4000;
    this.y = (Math.random() - 0.5) * 3000;
    this.z = initial ? Math.random() * 2000 : 2000;
    this.pz = this.z;
    this.isSuper = Math.random() > 0.94;
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.thickness = this.isSuper ? Math.random() * 4 + 3 : Math.random() * 1.5 + 0.5;
  }
  update(currentSpeed) {
    this.pz = this.z;
    this.z -= currentSpeed;
    this.twinklePhase += 0.05;
    if (this.z <= 0) this.reset();
  }
  draw(ctx, project, applyRepulsion) {
    const p1 = project(this.x, this.y, this.z);
    const p2 = project(this.x, this.y, this.pz);
    const r1 = applyRepulsion(p1.x, p1.y);
    const r2 = applyRepulsion(p2.x, p2.y);
    const x1 = p1.x + r1.ox;
    const y1 = p1.y + r1.oy;
    const x2 = p2.x + r2.ox;
    const y2 = p2.y + r2.oy;
    const alpha = Math.max(0, Math.min(1, (1 - this.z / 2000) * 2.5));
    ctx.beginPath();
    ctx.strokeStyle = this.isSuper ? `rgba(180, 220, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = Math.max(0.1, this.thickness * (p1.size / 8));
    ctx.lineCap = 'round';
    ctx.moveTo(x2, y2);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
}

class Cloud {
  constructor(initial = false) { this.reset(initial); }
  reset(initial = false) {
    this.x = (Math.random() - 0.5) * 6000;
    this.y = (Math.random() - 0.5) * 4000;
    this.z = initial ? Math.random() * 3000 : 3000;
    this.radius = Math.random() * 600 + 400;
    this.color = Math.random() > 0.5 ? 'oklch(0.5 0.25 280)' : 'oklch(0.4 0.2 220)';
  }
  update(currentSpeed) { this.z -= currentSpeed * 0.5; if (this.z <= 0) this.reset(); }
  draw(ctx, project, applyRepulsion) {
    const p = project(this.x, this.y, this.z);
    const r = applyRepulsion(p.x, p.y);
    const alpha = Math.max(0, Math.min(1, (1 - this.z / 3000) * 0.15));
    if (alpha <= 0 || isNaN(alpha)) return;
    const radius = Math.max(0.1, this.radius * p.size / 5);
    const grd = ctx.createRadialGradient(p.x + r.ox, p.y + r.oy, 0, p.x + r.ox, p.y + r.oy, radius);
    const colorWithAlpha = this.color.replace(')', ` / ${alpha.toFixed(3)})`);
    grd.addColorStop(0, colorWithAlpha);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x + r.ox, p.y + r.oy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Celestial {
  constructor(initial = false) { this.reset(initial); }
  reset(initial = false) {
    this.x = (Math.random() - 0.5) * 5000;
    this.y = (Math.random() - 0.5) * 4000;
    this.z = initial ? Math.random() * 2500 : 2500;
    this.type = Math.random() > 0.7 ? 'nova' : 'planet';
    this.color = this.type === 'nova' ? 'oklch(0.7 0.25 40)' : 'oklch(0.6 0.1 240)';
    this.size = this.type === 'nova' ? Math.random() * 200 + 100 : Math.random() * 60 + 30;
  }
  update(currentSpeed) { this.z -= currentSpeed * 0.8; if (this.z <= 0) this.reset(); }
  draw(ctx, project, applyRepulsion) {
    const p = project(this.x, this.y, this.z);
    const r = applyRepulsion(p.x, p.y);
    const alpha = Math.max(0, Math.min(1, (1 - this.z / 2500) * 0.9));
    if (alpha <= 0 || isNaN(alpha)) return;
    const size = Math.max(0.1, this.size * p.size / 8);
    const cx = p.x + r.ox;
    const cy = p.y + r.oy;
    if (this.type === 'planet') {
      const grd = ctx.createRadialGradient(cx - size / 3, cy - size / 3, 0, cx, cy, size);
      grd.addColorStop(0, '#ffffff');
      grd.addColorStop(0.3, this.color.replace(')', ` / ${alpha.toFixed(3)})`));
      grd.addColorStop(1, '#000000');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.shadowBlur = 40; ctx.shadowColor = this.color;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath(); ctx.arc(cx, cy, size / 10, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
      grd.addColorStop(0, this.color.replace(')', ` / ${(alpha * 0.6).toFixed(3)})`));
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2); ctx.fill();
    }
  }
}

export const UniverseBackground = () => {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, smoothX: 0, smoothY: 0 });
  const isFirstMove = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const STAR_COUNT = 3000;
    const OBJECT_COUNT = 35;
    const CLOUD_COUNT = 20;

    const BASE_SPEED = 1.2;
    const WARP_SPEED = 20;
    let currentSpeed = BASE_SPEED;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (isFirstMove.current) {
        pointer.current.x = window.innerWidth / 2;
        pointer.current.y = window.innerHeight / 2;
        pointer.current.smoothX = window.innerWidth / 2;
        pointer.current.smoothY = window.innerHeight / 2;
      }
    };

    const project = (x, y, z) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const scale = 1000 / (Math.max(0.1, z));
      return { x: x * scale + centerX, y: y * scale + centerY, size: scale };
    };

    const applyRepulsion = (x, y) => {
      const dx = x - pointer.current.smoothX;
      const dy = y - pointer.current.smoothY;
      const distSq = dx * dx + dy * dy;
      const radius = 250;
      const radiusSq = radius * radius;

      if (distSq < radiusSq) {
        const dist = Math.sqrt(distSq);
        const force = (radius - dist) / radius;
        const push = force * 60;
        return { ox: (dx / (dist || 1)) * push, oy: (dy / (dist || 1)) * push };
      }
      return { ox: 0, oy: 0 };
    };

    const stars = Array.from({ length: STAR_COUNT }, () => new Star(true));
    const clouds = Array.from({ length: CLOUD_COUNT }, () => new Cloud(true));
    const objects = Array.from({ length: OBJECT_COUNT }, () => new Celestial(true));


    const animate = () => {
      pointer.current.smoothX += (pointer.current.x - pointer.current.smoothX) * 0.1;
      pointer.current.smoothY += (pointer.current.y - pointer.current.smoothY) * 0.1;
      currentSpeed += (BASE_SPEED - currentSpeed) * 0.01;

      // Clear with identity transform or fill the exact screen size
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      clouds.forEach(c => { c.update(currentSpeed); c.draw(ctx, project, applyRepulsion); });
      objects.forEach(o => { o.update(currentSpeed); o.draw(ctx, project, applyRepulsion); });
      stars.forEach(s => { s.update(currentSpeed); s.draw(ctx, project, applyRepulsion); });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      isFirstMove.current = false;
    });
    window.addEventListener('scroll', () => currentSpeed = WARP_SPEED, { passive: true });

    resize(); animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
