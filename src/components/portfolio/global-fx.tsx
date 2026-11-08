import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, useRichEffects } from "@/hooks/use-motion-prefs";

/** Lenis smooth scroll, synced with GSAP ScrollTrigger. */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    // Smooth anchor links
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href")!;
      const el = id === "#" ? document.body : document.querySelector(id);
      if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement, { offset: -70 }); }
    };
    document.addEventListener("click", onClick);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); document.removeEventListener("click", onClick); };
  }, [reduced]);
  return null;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-brand-gradient" />;
}

/** Dot + lerped ring. Grows over [data-cursor] elements, shows "Voir" on projects. */
export function CustomCursor() {
  const rich = useRichEffects();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"none" | "hover" | "view">("none");
  useEffect(() => {
    if (!rich) return;
    document.documentElement.classList.add("has-custom-cursor");
    const m = { x: innerWidth / 2, y: innerHeight / 2 }, r = { ...m };
    let raf = 0;
    const move = (e: MouseEvent) => {
      m.x = e.clientX; m.y = e.clientY;
      const t = (e.target as HTMLElement).closest("[data-cursor], a, button") as HTMLElement | null;
      setMode(t ? (t.dataset["cursor"] === "view" ? "view" : "hover") : "none");
    };
    const loop = () => {
      r.x += (m.x - r.x) * 0.15; r.y += (m.y - r.y) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${m.x}px,${m.y}px,0) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${r.x}px,${r.y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("mousemove", move, { passive: true });
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("mousemove", move); document.documentElement.classList.remove("has-custom-cursor"); };
  }, [rich]);
  if (!rich) return null;
  const size = mode === "view" ? 88 : mode === "hover" ? 56 : 34;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={dot} className="absolute left-0 top-0 h-2 w-2 rounded-full bg-violet" />
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className="flex items-center justify-center rounded-full border-2 text-xs font-bold text-primary-foreground transition-all duration-300 ease-out"
          style={{
            width: size, height: size,
            borderColor: mode === "none" ? "var(--primary)" : "var(--violet)",
            background: mode === "view" ? "var(--violet)" : mode === "hover" ? "color-mix(in oklab, var(--violet) 15%, transparent)" : "transparent",
          }}
        >
          {mode === "view" && "Voir"}
        </div>
      </div>
    </div>
  );
}

/** 0→100% counter, SVG logo drawing, then gradient curtain lift. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (reduced) { setShow(false); onDone(); return; }
    const start = performance.now(), dur = 1800;
    let raf = 0;
    const loop = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(loop);
      else setTimeout(() => { setShow(false); onDone(); }, 250);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onDone]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-gradient text-primary-foreground"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg width="96" height="96" viewBox="0 0 100 100" fill="none" aria-label="Logo">
            <motion.path
              d="M35 25 L12 50 L35 75 M65 25 L88 50 L65 75 M57 18 L43 82"
              stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
          <p className="mt-6 font-display text-6xl font-bold tabular-nums">{n}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
