import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { useReducedMotion, useRichEffects } from "@/hooks/use-motion-prefs";
import { cn } from "@/lib/utils";

/** Fade + translate + blur reveal when scrolled into view. Use `delay` for stagger. */
export function RevealOnScroll({ children, delay = 0, className, y = 40 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Counts from 0 to `value` when it enters the viewport. */
export function AnimatedCounter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) return setN(value);
    const c = animate(0, value, { duration, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, duration, reduced]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/** Button/link pulled toward the cursor, springs back elastically. */
export function MagneticButton({ children, className, href, onClick, type, strength = 0.35, disabled }: {
  children: ReactNode; className?: string; href?: string; onClick?: () => void; type?: "submit" | "button"; strength?: number; disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rich = useRichEffects();
  const [p, setP] = useState({ x: 0, y: 0 });
  const move = (e: MouseEvent) => {
    if (!rich || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setP({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength });
  };
  const cls = cn("inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold font-display transition-shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40", className);
  return (
    <motion.div
      ref={ref}
      data-cursor="hover"
      className="inline-block"
      onMouseMove={move}
      onMouseLeave={() => setP({ x: 0, y: 0 })}
      animate={p}
      transition={{ type: "spring", stiffness: 180, damping: 10, mass: 0.6 }}
    >
      {href ? <a href={href} className={cls}>{children}</a> : <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={cls}>{children}</button>}
    </motion.div>
  );
}

/** 3D tilt on hover + radial spotlight that follows the cursor. */
export function TiltCard({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rich = useRichEffects();
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50, on: false });
  const move = (e: MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    setT({ rx: rich ? (0.5 - py) * max : 0, ry: rich ? (px - 0.5) * max : 0, mx: px * 100, my: py * 100, on: true });
  };
  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={() => setT({ rx: 0, ry: 0, mx: 50, my: 50, on: false })}
        animate={{ rotateX: t.rx, rotateY: t.ry }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={cn("group relative h-full", className)}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{ opacity: t.on ? 1 : 0, background: `radial-gradient(400px circle at ${t.mx}% ${t.my}%, color-mix(in oklab, var(--violet) 14%, transparent), transparent 60%)` }}
        />
        {children}
      </motion.div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, sub, light }: { eyebrow: string; title: ReactNode; sub?: string; light?: boolean }) {
  return (
    <RevealOnScroll className="mx-auto mb-14 max-w-2xl text-center">
      <p className={cn("mb-3 text-sm font-semibold uppercase tracking-[0.2em]", light ? "text-ink-foreground/80" : "text-violet")}>{eyebrow}</p>
      <h2 className={cn("text-3xl font-bold md:text-5xl", light && "text-ink-foreground")}>{title}</h2>
      {sub && <p className={cn("mt-4 text-lg", light ? "text-ink-foreground/75" : "text-muted-foreground")}>{sub}</p>}
    </RevealOnScroll>
  );
}
