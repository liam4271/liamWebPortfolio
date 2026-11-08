import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-motion-prefs";

export type Project = {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
  /** Ambient color (any CSS color) for the section background. */
  color: string;
};

/**
 * Realistic laptop mockup that rotates in 3D and straightens on scroll,
 * auto-scrolls the screenshot inside, with parallax between screen, text and badges.
 */
export function ProjectShowcase({ project, index, onActive }: { project: Project; index: number; onActive?: (color: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const flip = index % 2 === 1;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current!;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 45%", onToggle: (s) => s.isActive && onActive?.(project.color) });
      if (reduced) return;
      gsap.fromTo(".ps-device", { rotateX: 28, rotateY: flip ? 22 : -22, scale: 0.85, opacity: 0.4 },
        { rotateX: 0, rotateY: 0, scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: 1 } });
      gsap.fromTo(".ps-shot", { yPercent: 0 },
        { yPercent: -70, ease: "none", scrollTrigger: { trigger: el, start: "top center", end: "bottom top", scrub: 1 } });
      gsap.fromTo(".ps-text", { y: 80 }, { y: -40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".ps-badges", { y: 140 }, { y: -80, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, [reduced, flip, project.color, onActive]);

  return (
    <article ref={root} className={`grid items-center gap-12 py-16 md:grid-cols-12 md:py-24`}>
      <div className={`md:col-span-7 ${flip ? "md:order-2" : ""}`} style={{ perspective: 1400 }}>
        <a href={project.link} data-cursor="view" aria-label={`Voir le projet ${project.title}`} className="group block transition-transform duration-500 hover:scale-[1.03]">
          <div className="ps-device" style={{ transformStyle: "preserve-3d" }}>
            {/* Screen */}
            <div className="rounded-t-2xl border-[10px] border-b-[14px] border-ink bg-ink shadow-lift transition-shadow duration-500 group-hover:shadow-[0_50px_100px_-20px_color-mix(in_oklab,var(--violet)_50%,transparent)]">
              <div className="flex items-center gap-1.5 rounded-t-md bg-secondary px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="h-2.5 w-2.5 rounded-full bg-highlight" />
                <span className="h-2.5 w-2.5 rounded-full bg-turquoise" />
                <span className="ml-3 flex-1 truncate rounded-md bg-card px-3 py-0.5 text-xs text-muted-foreground">{project.link.replace(/^https?:\/\//, "")}</span>
              </div>
              <div className="relative aspect-video overflow-hidden bg-card">
                <img src={project.image} alt={`Capture du site ${project.title}`} loading="lazy" width={1024} height={1920} className="ps-shot absolute inset-x-0 top-0 w-full will-change-transform" />
              </div>
            </div>
            {/* Base */}
            <div className="mx-auto h-4 w-[110%] -translate-x-[4.5%] rounded-b-2xl bg-gradient-to-b from-muted-foreground/40 to-muted-foreground/70" />
            <div className="mx-auto h-1.5 w-1/5 rounded-b-lg bg-muted-foreground/50" />
          </div>
        </a>
      </div>
      <div className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
        <div className="ps-text">
          <p className="mb-2 font-display text-sm font-semibold tracking-widest" style={{ color: project.color }}>PROJET 0{index + 1}</p>
          <h3 className="text-3xl font-bold md:text-4xl">{project.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{project.description}</p>
        </div>
        <div className="ps-badges">
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.technologies.map((t, i) => (
            <li key={t} className="rounded-full border bg-card px-3 py-1 text-sm font-medium shadow-soft transition-all duration-300 hover:-translate-y-1" style={{ transitionDelay: `${i * 50}ms` }}>{t}</li>
          ))}
        </ul>
        <a href={project.link} className="mt-8 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
          Voir le site <ExternalLink className="h-4 w-4" />
        </a>
        </div>
      </div>
    </article>
  );
}
