import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { CustomCursor, Preloader, ScrollProgress, SmoothScroll } from "@/components/portfolio/global-fx";
import { CallWidget, Contact, Footer, Hero, Nav, Process, Projects, Services, Tech, Testimonials } from "@/components/portfolio/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alex Martin — Développeur web freelance" },
      { name: "description", content: "Développeur web freelance : sites vitrines, boutiques en ligne et sites sur-mesure rapides et modernes." },
      { property: "og:title", content: "Alex Martin — Développeur web freelance" },
      { property: "og:description", content: "Sites vitrines, e-commerce et développement sur-mesure. Devis gratuit sous 24 h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return (
    <>
      <Preloader onDone={done} />
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Services />
        <Projects />
        <Process />
        <Tech />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <CallWidget />
    </>
  );
}
