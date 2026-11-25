"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrandMark } from "@/components/brand-mark";
import { GREETINGS } from "@/config/greetings";

const ROTATE_MS = 60_000;

function randomIndex(exclude?: number): number {
  if (GREETINGS.length <= 1) return 0;
  let index = Math.floor(Math.random() * GREETINGS.length);
  while (index === exclude) index = Math.floor(Math.random() * GREETINGS.length);
  return index;
}

// one sentence per minute. Fixed on the server so hydration matches, picked
// at random once mounted (Math.random differs between server and client)
export function ComposerIntro() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // randomize after mount, outside React's sync flow: the only way to avoid both
    // hydration mismatch and a value stuck at 0 on every visit
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((current) => randomIndex(current));
    const interval = setInterval(() => {
      setIndex((current) => randomIndex(current));
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pb-6 md:px-6">
      <AnimatePresence mode="wait">
        <FitLine key={index}>
          <BrandMark className="size-9 rounded-xl md:size-11" />
          {GREETINGS[index]}
        </FitLine>
      </AnimatePresence>
    </div>
  );
}

// single line, never wrapped: the font shrinks to fit instead of wrapping or truncating
function FitLine({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const fit = () => {
      const available = container.clientWidth;
      // no `w-full` or `justify-center` here: width must stay the content's so
      // offsetWidth gives the natural width, transform or not (scrollWidth misses
      // symmetric overflow)
      const natural = line.offsetWidth;
      setScale(natural > available ? available / natural : 1);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex w-full items-center justify-center overflow-hidden"
    >
      <span
        ref={lineRef}
        style={{ transform: `scale(${scale})` }}
        className="font-display flex origin-center items-center gap-3 text-3xl font-medium whitespace-nowrap tracking-tight md:text-5xl py-3"
      >
        {children}
      </span>
    </motion.div>
  );
}
