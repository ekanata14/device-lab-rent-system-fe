"use client";

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endTime: string;
  onFinish?: () => void;
}

export function CountdownTimer({ endTime, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // Reset the ref if the endTime changes
    hasFinishedRef.current = false;
  }, [endTime]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Finishing...");
        if (!hasFinishedRef.current && onFinish) {
          hasFinishedRef.current = true;
          onFinish();
        }
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h > 0 ? h + "h " : ""}${m}m ${s}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center gap-2 text-secondary font-medium animate-pulse">
      <Clock className="w-4 h-4" />
      <span className="tabular-nums">{timeLeft}</span>
    </div>
  );
}
