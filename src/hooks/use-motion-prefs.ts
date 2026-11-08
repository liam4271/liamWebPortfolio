import { useEffect, useRef, useState } from "react";

/** True when the user asked the OS to reduce motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** True on touch / coarse-pointer devices (heavy effects get disabled there). */
export function useIsTouch() {
  const [touch, setTouch] = useState(true);
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches || window.innerWidth < 768);
  }, []);
  return touch;
}

/** True when rich effects (cursor, particles, 3D) should run. */
export function useRichEffects() {
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  return !reduced && !touch;
}

/** Live mouse position stored in a ref (no re-render per move). */
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e: MouseEvent) => { pos.current.x = e.clientX; pos.current.y = e.clientY; };
    window.addEventListener("mousemove", on, { passive: true });
    return () => window.removeEventListener("mousemove", on);
  }, []);
  return pos;
}
