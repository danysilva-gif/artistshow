import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const TOTAL_SECONDS = 15 * 60;

export default function Timer({ startedAt }: { startedAt: number }) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    const update = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setSecondsLeft(Math.max(0, TOTAL_SECONDS - elapsed));
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [startedAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / TOTAL_SECONDS;
  const isUrgent = secondsLeft < 120;

  return (
    <div className={`flex items-center gap-3 rounded-xl border-2 px-5 py-3 font-display ${isUrgent ? "border-accent bg-accent/10" : "border-primary bg-primary/5"}`}>
      <Clock className={`h-5 w-5 ${isUrgent ? "text-accent" : "text-primary"}`} />
      <span className={`text-3xl font-bold tabular-nums ${isUrgent ? "text-accent" : "text-primary"}`}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      <div className="ml-2 h-2 w-24 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${isUrgent ? "gradient-accent" : "gradient-hero"}`}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
