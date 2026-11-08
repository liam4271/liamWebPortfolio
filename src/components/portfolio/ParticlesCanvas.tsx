import { useEffect, useRef } from "react";

/** Native canvas particle network that is repelled by the mouse. Lazy-loaded, desktop only. */
export default function ParticlesCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const colors = ["--primary", "--violet", "--highlight", "--turquoise"].map((v) => css.getPropertyValue(v).trim());
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999 };
    type P = { x: number; y: number; vx: number; vy: number; c: string; r: number };
    let ps: P[] = [];
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(80, Math.floor((w * h) / 16000));
      ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, c: colors[Math.floor(Math.random() * 4)] ?? "#1D4ED8", r: 1.5 + Math.random() * 2 }));
    };
    const onMove = (e: MouseEvent) => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { p.vx += (dx / d) * 0.3; p.vy += (dy / d) * 0.3; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.vx += (Math.random() - 0.5) * 0.02; p.vy += (Math.random() - 0.5) * 0.02;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i]!, b = ps[j]!, d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) { ctx.globalAlpha = (1 - d / 130) * 0.35; ctx.strokeStyle = a.c; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.globalAlpha = 0.8;
      for (const p of ps) { ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
      raf = requestAnimationFrame(loop);
    };
    resize(); loop();
    addEventListener("resize", resize); addEventListener("mousemove", onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("mousemove", onMove); };
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
