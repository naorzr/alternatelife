"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  formatter?: (n: number) => string;
}

export default function AnimatedNumber({
  value,
  duration = 2000,
  className,
  style,
  formatter,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    const from = prevValue.current;
    const to = value;
    prevValue.current = value;

    if (from === to) {
      setDisplay(to);
      return;
    }

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);

      setDisplay(current);

      if (progress < 1) {
        animFrame.current = requestAnimationFrame(tick);
      }
    }

    animFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame.current);
  }, [value, duration]);

  const formatted = formatter ? formatter(display) : display.toLocaleString("en-US");

  return (
    <span className={className} style={style}>
      {formatted}
    </span>
  );
}
