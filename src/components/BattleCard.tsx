import { motion } from "framer-motion";
import { Clock, Users, Vote, CheckCircle2 } from "lucide-react";
import { Battle } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const STATUS_CONFIG = {
  waiting: { label: "Aguardando", icon: Clock, className: "bg-secondary text-secondary-foreground" },
  active: { label: "Ao Vivo", icon: Clock, className: "gradient-accent text-accent-foreground animate-pulse-glow" },
  voting: { label: "Votação", icon: Vote, className: "bg-primary text-primary-foreground" },
  finished: { label: "Finalizada", icon: CheckCircle2, className: "bg-muted text-muted-foreground" },
};

function Countdown({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("00:00"); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [endsAt]);

  return <span className="font-display text-lg font-bold text-accent">{timeLeft}</span>;
}

export default function BattleCard({ battle, index }: { battle: Battle; index: number }) {
  const status = STATUS_CONFIG[battle.status];
  const StatusIcon = status.icon;
  const linkTo = battle.status === "voting" ? "/voting" : battle.status === "active" ? `/battle/${battle.id}` : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={linkTo} className="group block">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
          <div className="mb-3 flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
            {battle.status === "active" && battle.endsAt && <Countdown endsAt={battle.endsAt} />}
          </div>

          <h3 className="mb-3 font-display text-lg font-bold leading-tight text-card-foreground">
            &ldquo;{battle.theme}&rdquo;
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{battle.participants}/{battle.maxParticipants} artistas</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
