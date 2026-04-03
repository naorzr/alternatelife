import type { ReactNode } from "react";

interface BottomNavProps {
  left: ReactNode;
  right: ReactNode;
}

export default function BottomNav({ left, right }: BottomNavProps) {
  return (
    <div className="safe-pad-bottom shrink-0 border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="viewport-frame flex flex-wrap items-center justify-between gap-3 py-3">
        {left}
        {right}
      </div>
    </div>
  );
}
