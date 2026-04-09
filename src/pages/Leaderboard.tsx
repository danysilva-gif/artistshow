import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";

export default function Leaderboard() {
  // No real users yet - show empty state
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 font-display text-4xl font-bold">Ranking</h1>
      <p className="mb-10 text-muted-foreground">Os melhores artistas aparecem aqui</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 text-center"
      >
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Trophy className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-bold">Nenhum artista ainda</h2>
        <p className="max-w-md text-muted-foreground">
          Quando artistas reais participarem das batalhas e receberem votos, o ranking aparecerá aqui.
        </p>
      </motion.div>
    </div>
  );
}
