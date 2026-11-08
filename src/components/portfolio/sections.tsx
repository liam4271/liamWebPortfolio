import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Code2, ShoppingBag, Gauge, Search, Palette, Wrench, MessageSquare, PenTool, Rocket,
  Lightbulb, Quote, ChevronLeft, ChevronRight, Mail, Phone, MapPin,
} from "lucide-react";
import { MagneticButton, RevealOnScroll, SectionHeading, TiltCard } from "./primitives";
import { ProjectShowcase, type Project } from "./ProjectShowcase";
import { useReducedMotion, useRichEffects } from "@/hooks/use-motion-prefs";
import p1 from "@/assets/projet-1.jpg";
import p2 from "@/assets/projet-2.jpg";
import p3 from "@/assets/projet-3.jpg";

const ParticlesCanvas = lazy(() => import("./ParticlesCanvas"));

const NAME = "Liam ";

/* ---------------- NAV ---------------- */
export function Nav() {
  const links = [["#services", "Services"], ["#projets", "Projets"], ["#process", "Process"], ["#contact", "Contact"]];
  return (
    <header className="fixed inset-x-0 top-1 z-50 px-4">
      <nav aria-label="Navigation principale" className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full border bg-card/80 px-5 py-2.5 shadow-soft backdrop-blur-md">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground"><Code2 className="h-4 w-4" /></span>
          {NAME}
        </a>
        <ul className="hidden gap-7 text-sm font-medium md:flex">
          {links.map(([h, l]) => <li key={h}><a href={h} className="transition-colors hover:text-primary">{l}</a></li>)}
        </ul>
        <a href="#contact" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">Me contacter</a>
      </nav>
    </header>
  );
}

/* ---------------- HERO ---------------- */
const WORDS = ["sites vitrines", "boutiques en ligne", "sites sur-mesure"];

function Typewriter() {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const full = WORDS[i] ?? "";
    const t = setTimeout(() => {
      if (!del) { setTxt(full.slice(0, txt.length + 1)); if (txt.length + 1 === full.length) setTimeout(() => setDel(true), 1400); }
      else { setTxt(full.slice(0, txt.length - 1)); if (txt.length - 1 === 0) { setDel(false); setI((i + 1) % WORDS.length); } }
    }, del ? 45 : 90);
    return () => clearTimeout(t);
  }, [txt, del, i]);
  return <span className="text-gradient">{txt}<span className="ml-0.5 inline-block w-[3px] animate-pulse bg-violet align-middle" style={{ height: "0.9em" }} /></span>;
}

function HeroMockup() {
  const rich = useRichEffects();
  const [r, setR] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!rich) return;
    const on = (e: MouseEvent) => setR({ x: (e.clientY / innerHeight - 0.5) * -14, y: (e.clientX / innerWidth - 0.5) * 18 });
    addEventListener("mousemove", on, { passive: true });
    return () => removeEventListener("mousemove", on);
  }, [rich]);
  return (
    <div className="animate-float" style={{ perspective: 1200 }}>
      <motion.div animate={{ rotateX: r.x, rotateY: r.y }} transition={{ type: "spring", stiffness: 60, damping: 15 }} style={{ transformStyle: "preserve-3d" }}>
        <div className="rounded-2xl border-[8px] border-ink bg-ink shadow-lift">
          <div className="flex gap-1.5 rounded-t-md bg-secondary px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive" /><span className="h-2.5 w-2.5 rounded-full bg-highlight" /><span className="h-2.5 w-2.5 rounded-full bg-turquoise" />
          </div>
          <div className="space-y-3 rounded-b-md bg-card p-5" style={{ transform: "translateZ(30px)" }}>
            <div className="h-24 rounded-lg bg-brand-gradient" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-lg bg-accent" /><div className="h-16 rounded-lg bg-secondary" /><div className="h-16 rounded-lg bg-warm-gradient opacity-80" />
            </div>
            <div className="h-3 w-3/4 rounded bg-muted" /><div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        </div>
        <div className="absolute -left-6 bottom-8 rounded-xl border bg-card px-4 py-3 shadow-soft" style={{ transform: "translateZ(70px)" }}>
          <p className="text-xs text-muted-foreground">Score Lighthouse</p>
          <p className="font-display text-2xl font-bold text-turquoise">98</p>
        </div>
      </motion.div>
    </div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const rich = useRichEffects();
  const words = "Je crée des sites web qui font grandir votre activité.".split(" ");
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-orb absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="animate-orb absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl" style={{ animationDelay: "-6s" }} />
        <div className="animate-orb absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-highlight/15 blur-3xl" style={{ animationDelay: "-12s" }} />
        {rich && <Suspense fallback={null}><ParticlesCanvas /></Suspense>}
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-2">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : {}} className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium shadow-soft">
            <span className="h-2 w-2 rounded-full bg-turquoise animate-pulse-ring" /> Développeur web freelance · Disponible
          </motion.p>
          <h1 className="text-4xl font-extrabold leading-[1.1] md:text-6xl">
            {words.map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                <motion.span className="inline-block" initial={{ y: "110%" }} animate={ready ? { y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.9 }} className="mt-6 text-xl text-muted-foreground md:text-2xl">
            Spécialiste des <Typewriter />
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1 }} className="mt-9 flex flex-wrap gap-4">
            <MagneticButton href="#contact" className="bg-warm-gradient text-highlight-foreground shadow-lift">Démarrer un projet <ArrowRight className="h-4 w-4" /></MagneticButton>
            <MagneticButton href="#projets" className="border-2 border-primary bg-card text-primary">Voir mes projets</MagneticButton>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.5, duration: 1 }} className="relative hidden md:block">
          <HeroMockup />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- SERVICES ---------------- */
const SERVICES = [
  { icon: Palette, title: "Sites vitrines", text: "Un site élégant qui présente votre activité et convertit vos visiteurs en clients." },
  { icon: ShoppingBag, title: "E-commerce", text: "Boutiques en ligne rapides, sécurisées et simples à gérer au quotidien." },
  { icon: Code2, title: "Développement sur-mesure", text: "Applications web et outils métier pensés pour vos besoins précis." },
  { icon: Gauge, title: "Performance", text: "Des pages qui s'affichent en moins d'une seconde, sur tous les appareils." },
  { icon: Search, title: "Référencement SEO", text: "Une structure optimisée pour être trouvé sur Google par vos futurs clients." },
  { icon: Wrench, title: "Maintenance", text: "Mises à jour, sauvegardes et évolutions : je veille sur votre site." },
];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading eyebrow="Services" title={<>Ce que je fais <span className="text-gradient">pour vous</span></>} sub="De l'idée à la mise en ligne, un accompagnement complet et transparent." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <RevealOnScroll key={s.title} delay={i * 0.08}>
            <TiltCard className="gradient-border rounded-2xl border bg-card p-8 shadow-soft">
              <div style={{ transform: "translateZ(40px)" }}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                  <s.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </div>
            </TiltCard>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

/* ---------------- PROJECTS ---------------- */
const PROJECTS: Project[] = [
  { title: "[Projet 1] AGS", description: "Boutique en ligne pour un torréfacteur artisanal : catalogue, paiement sécurisé et abonnement café.", technologies: ["Shopify", "React", "Tailwind", "Stripe"], image: p1, link: "https://example.com", color: "oklch(0.72 0.18 50)" },
  { title: "[Projet 2] Skyline Architects", description: "Site vitrine pour un cabinet d'architectes, avec portfolio filtrable et formulaire de devis.", technologies: ["Next.js", "Sanity", "GSAP", "SEO"], image: p2, link: "https://example.com", color: "oklch(0.6 0.11 190)" },
  { title: "[Projet 3] NovaDash", description: "Landing page et tableau de bord pour une startup SaaS d'analyse de données.", technologies: ["TypeScript", "React", "Framer Motion", "Supabase"], image: p3, link: "https://example.com", color: "oklch(0.541 0.247 293)" },
];

export function Projects() {
  const [color, setColor] = useState(PROJECTS[0]!.color);
  const onActive = useCallback((c: string) => setColor(c), []);
  return (
    <section id="projets" className="relative py-20 transition-colors duration-700" style={{ backgroundColor: `color-mix(in oklab, ${color} 9%, var(--background))` }}>
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Réalisations" title={<>Projets <span className="text-gradient">récents</span></>} sub="Une sélection de sites conçus et développés pour mes clients." />
        {PROJECTS.map((p, i) => <ProjectShowcase key={p.title} project={p} index={i} onActive={onActive} />)}
      </div>
    </section>
  );
}

/* ---------------- PROCESS ---------------- */
const STEPS = [
  { icon: MessageSquare, title: "Échange", text: "On discute de vos objectifs, de votre cible et de votre budget." },
  { icon: Lightbulb, title: "Stratégie", text: "Je propose une arborescence, un planning et un devis clair." },
  { icon: PenTool, title: "Design", text: "Maquettes interactives validées ensemble avant le développement." },
  { icon: Code2, title: "Développement", text: "Code propre, rapide et accessible, avec des points d'étape réguliers." },
  { icon: Rocket, title: "Lancement", text: "Mise en ligne, formation et suivi pour faire vivre votre site." },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(-1);
  const reduced = useReducedMotion();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".pr-line", { scaleY: reduced ? 1 : 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 60%", scrub: true, onUpdate: (s) => setLit(Math.floor(s.progress * STEPS.length - 0.05)) },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section id="process" className="mx-auto max-w-4xl px-5 py-28">
      <SectionHeading eyebrow="Méthode" title={<>Un process <span className="text-gradient">simple</span></>} sub="Cinq étapes claires, sans jargon ni mauvaise surprise." />
      <div ref={ref} className="relative pl-14 md:pl-0">
        <div className="absolute bottom-0 left-5 top-0 w-1 rounded bg-border md:left-1/2 md:-translate-x-1/2" />
        <div className="pr-line absolute bottom-0 left-5 top-0 w-1 origin-top rounded bg-brand-gradient md:left-1/2 md:-translate-x-1/2" />
        {STEPS.map((s, i) => {
          const on = i <= lit;
          return (
            <div key={s.title} className={`relative mb-14 last:mb-0 md:flex ${i % 2 ? "md:flex-row-reverse" : ""}`}>
              <div className={`absolute -left-14 top-0 md:left-1/2 md:-translate-x-1/2 flex h-11 w-11 items-center justify-center rounded-full border-4 transition-all duration-500 ${on ? "border-violet bg-brand-gradient text-primary-foreground animate-pulse-ring" : "border-border bg-card text-muted-foreground"}`}>
                <s.icon className="h-5 w-5" aria-hidden />
              </div>
              <div className={`md:w-1/2 ${i % 2 ? "md:pl-16" : "md:pr-16 md:text-right"}`}>
                <RevealOnScroll>
                  <p className={`font-display text-sm font-semibold transition-colors ${on ? "text-violet" : "text-muted-foreground"}`}>Étape {i + 1}</p>
                  <h3 className="text-2xl font-bold">{s.title}</h3>
                  <p className="mt-1 text-muted-foreground">{s.text}</p>
                </RevealOnScroll>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- TECH ---------------- */
const TECH = ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "Figma", "WordPress", "Shopify", "GSAP", "Supabase", "Vercel", "Stripe"];

export function Tech() {
  const [slow, setSlow] = useState(false);
  return (
    <section className="overflow-hidden bg-ink py-24 text-ink-foreground">
      <SectionHeading light eyebrow="Technologies" title="Mes outils du quotidien" />
      <div onMouseEnter={() => setSlow(true)} onMouseLeave={() => setSlow(false)} className="relative [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="animate-marquee flex w-max gap-5 py-4" style={{ animationDuration: slow ? "80s" : "30s" }}>
          {[...TECH, ...TECH].map((t, i) => (
            <li key={i} aria-hidden={i >= TECH.length} className="animate-float whitespace-nowrap rounded-2xl border border-ink-foreground/15 bg-ink-foreground/5 px-7 py-4 font-display text-lg font-semibold" style={{ animationDelay: `${(i % 6) * -0.8}s` }}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
const TESTI = [
  { name: "Claire Dubois", role: "Gérante, Atelier Lumière", text: "Alex a compris notre besoin en un rendez-vous. Le site est magnifique et nos demandes de devis ont doublé." },
  { name: "Marc Lefèvre", role: "Fondateur, NovaDash", text: "Réactif, rigoureux et force de proposition. Notre landing page convertit enfin comme on l'espérait." },
  { name: "Sophie Martin", role: "Directrice, Bean & Bloom", text: "Notre boutique en ligne est rapide et facile à gérer. Un vrai partenaire, pas juste un prestataire." },
  { name: "Thomas Bernard", role: "Architecte, Skyline", text: "Un travail soigné jusque dans les moindres détails. Je recommande sans hésiter." },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const n = TESTI.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading eyebrow="Témoignages" title={<>Ils m'ont fait <span className="text-gradient">confiance</span></>} />
      <div className="relative h-80" style={{ perspective: 1200 }} aria-roledescription="carrousel">
        {TESTI.map((t, k) => {
          let off = k - i; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
          const abs = Math.abs(off);
          return (
            <motion.figure
              key={t.name}
              drag={off === 0 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              animate={{ x: `${off * 60}%`, scale: 1 - abs * 0.15, rotateY: off * -25, opacity: abs > 1 ? 0 : 1 - abs * 0.5, zIndex: 10 - abs }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              aria-hidden={off !== 0}
              className="absolute inset-x-0 mx-auto w-full max-w-lg cursor-grab rounded-3xl border bg-card p-8 shadow-lift active:cursor-grabbing"
            >
              <Quote className="h-10 w-10 text-violet" aria-hidden />
              <blockquote className="mt-4 text-lg leading-relaxed">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient font-bold text-primary-foreground">{t.name[0]}</span>
                <span><b className="block">{t.name}</b><span className="text-sm text-muted-foreground">{t.role}</span></span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} aria-label="Témoignage précédent" className="rounded-full border bg-card p-3 shadow-soft transition hover:bg-primary hover:text-primary-foreground"><ChevronLeft className="h-5 w-5" /></button>
        {TESTI.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Témoignage ${k + 1}`} className={`h-2.5 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2.5 bg-border"}`} />)}
        <button onClick={() => go(1)} aria-label="Témoignage suivant" className="rounded-full border bg-card p-3 shadow-soft transition hover:bg-primary hover:text-primary-foreground"><ChevronRight className="h-5 w-5" /></button>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
export const PHONE_DISPLAY = "07 77 36 05 35";
export const PHONE_TEL = "tel:+33777360535";

export function Contact() {
  return (
    <section id="contact" className="bg-mesh relative overflow-hidden py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <RevealOnScroll className="text-primary-foreground">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] opacity-80">Contact</p>
          <h2 className="text-4xl font-bold md:text-5xl">Parlons de votre projet</h2>
          <p className="mt-4 text-lg opacity-85">Le plus simple : appelez-moi directement. Réponse sous 24 h, devis gratuit et sans engagement.</p>
          <ul className="mt-10 space-y-4 text-lg">
            <li className="flex items-center justify-center gap-3"><Mail className="h-5 w-5 shrink-0" /> contact@alexmartin.dev</li>
            <li className="flex items-center justify-center gap-3"><Phone className="h-5 w-5 shrink-0" /> {PHONE_DISPLAY}</li>
            <li className="flex items-center justify-center gap-3"><MapPin className="h-5 w-5 shrink-0" /> Lyon · Remote partout en France</li>
          </ul>
          <div className="mt-10 flex justify-center">
            <MagneticButton href={PHONE_TEL} className="bg-warm-gradient text-highlight-foreground shadow-lift">
              <Phone className="h-4 w-4" /> Appeler maintenant
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

/* ---------------- CALL WIDGET ---------------- */
export function CallWidget() {
  return (
    <a
      href={PHONE_TEL}
      aria-label={`Appeler le ${PHONE_DISPLAY}`}
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-warm-gradient py-3 pl-4 pr-3 text-highlight-foreground shadow-lift transition-transform hover:scale-105"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card/20">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-card/30" />
        <Phone className="relative h-5 w-5" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-56">
        {PHONE_DISPLAY} — Discutons de votre projet
      </span>
    </a>
  );
}

/* ---------------- FOOTER ---------------- */
export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [launch, setLaunch] = useState(false);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ft-letter", { yPercent: 110 }, { yPercent: 0, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 90%", end: "bottom bottom", scrub: 1 } });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);
  const top = () => {
    setLaunch(true);
    const l = (window as unknown as { __lenis?: { scrollTo: (n: number) => void } }).__lenis;
    if (l) l.scrollTo(0); else scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setLaunch(false), 1200);
  };
  return (
    <footer ref={ref} className="bg-ink px-5 pb-10 pt-20 text-ink-foreground">
      <div className="mx-auto max-w-6xl">
        <p className="overflow-hidden font-display text-[14vw] font-extrabold leading-none tracking-tighter md:text-[10rem]" aria-label={NAME}>
          {NAME.split("").map((c, i) => <span key={i} aria-hidden className="ft-letter inline-block text-gradient">{c === " " ? "\u00A0" : c}</span>)}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink-foreground/15 pt-6 text-sm opacity-80">
          <p>© 2026 {NAME} — Développeur web freelance</p>
          <button onClick={top} data-cursor="hover" className="group flex items-center gap-2 rounded-full border border-ink-foreground/20 px-5 py-2.5 font-semibold transition hover:bg-ink-foreground/10">
            Retour en haut
            <motion.span animate={launch ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="inline-block group-hover:-translate-y-1 transition-transform"><Rocket className="h-4 w-4 -rotate-45" /></motion.span>
          </button>
        </div>
      </div>
    </footer>
  );
}
