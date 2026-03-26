import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Trophy, Crown, Medal, ArrowRight } from "lucide-react";
import { mockDrawings, Drawing } from "@/data/mockData";
import { Button } from "@/components/ui/button";

function VoteCard({ drawing, index, voted, onVote, disabled }: {
  drawing: Drawing & { currentVotes: number };
  index: number;
  voted: boolean;
  onVote: () => void;
  disabled: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-elevated"
    >
      <div className="aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-card text-muted-foreground text-sm italic">
          Desenho de {drawing.artistName}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="font-display font-semibold text-card-foreground">{drawing.artistName}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {drawing.artistCity}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onVote}
            disabled={disabled && !voted}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              voted
                ? "gradient-accent text-accent-foreground"
                : disabled
                ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
            }`}
          >
            <Heart className={`h-4 w-4 ${voted ? "fill-current" : ""}`} />
            {drawing.currentVotes}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

const MEDAL_ICONS = [Crown, Trophy, Medal];
const MEDAL_COLORS = [
  "text-yellow-500",
  "text-muted-foreground",
  "text-orange-400",
];

export default function Voting() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<"voting" | "results">("voting");

  const drawings = useMemo(() => {
    return mockDrawings
      .filter((d) => !battleId || d.battleId === battleId || true)
      .map((d) => ({ ...d, currentVotes: d.votes + (votes[d.id] ? 1 : 0) }));
  }, [votes, battleId]);

  const maxVotes = 3;
  const voteCount = Object.values(votes).filter(Boolean).length;

  const handleVote = (id: string) => {
    setVotes((prev) => {
      const isVoted = prev[id];
      if (isVoted) {
        return { ...prev, [id]: false };
      }
      if (voteCount >= maxVotes) return prev;
      return { ...prev, [id]: true };
    });
  };

  const ranked = useMemo(
    () => [...drawings].sort((a, b) => b.currentVotes - a.currentVotes),
    [drawings]
  );

  const handleFinishVoting = () => {
    setPhase("results");
  };

  if (phase === "results") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <Trophy className="mx-auto mb-3 h-12 w-12 text-primary" />
          </motion.div>
          <h1 className="mb-1 font-display text-4xl font-bold">Resultado da Batalha</h1>
          <p className="text-muted-foreground">&ldquo;{ranked[0]?.theme}&rdquo;</p>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {ranked.map((d, i) => {
            const Icon = MEDAL_ICONS[i] || null;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className={`flex items-center gap-4 rounded-xl border border-border p-4 ${
                  i === 0 ? "bg-primary/5 border-primary/30" : "bg-card"
                }`}
              >
                <span className={`font-display text-2xl font-bold ${i < 3 ? MEDAL_COLORS[i] : "text-muted-foreground"}`}>
                  {i + 1}º
                </span>
                {Icon && <Icon className={`h-5 w-5 ${MEDAL_COLORS[i]}`} />}
                <div className="flex-1">
                  <p className="font-display font-semibold">{d.artistName}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {d.artistCity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-primary">{d.currentVotes}</p>
                  <p className="text-xs text-muted-foreground">votos</p>
                </div>
                {i === 0 && (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    🏆 Vencedor
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate("/battles")}>
            Voltar às Batalhas
          </Button>
          <Button onClick={() => navigate("/leaderboard")} className="gradient-hero border-0 text-primary-foreground">
            Ver Ranking <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Votação Aberta</p>
          <h1 className="mb-1 font-display text-4xl font-bold">&ldquo;{drawings[0]?.theme}&rdquo;</h1>
          <p className="text-muted-foreground">
            Vote nos melhores desenhos ({voteCount}/{maxVotes} votos usados)
          </p>
        </div>
        <Button
          size="lg"
          disabled={voteCount === 0}
          onClick={handleFinishVoting}
          className="gradient-hero border-0 text-primary-foreground font-display font-semibold px-8 hover:opacity-90 transition-opacity"
        >
          Confirmar Votos <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {drawings.map((d, i) => (
          <VoteCard
            key={d.id}
            drawing={d}
            index={i}
            voted={!!votes[d.id]}
            onVote={() => handleVote(d.id)}
            disabled={voteCount >= maxVotes}
          />
        ))}
      </div>
    </div>
  );
}
