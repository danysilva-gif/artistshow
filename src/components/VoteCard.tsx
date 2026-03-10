import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { Drawing } from "@/data/mockData";

export default function VoteCard({ drawing, index }: { drawing: Drawing; index: number }) {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(drawing.votes);

  const handleVote = () => {
    if (voted) {
      setVoted(false);
      setVotes((v) => v - 1);
    } else {
      setVoted(true);
      setVotes((v) => v + 1);
    }
  };

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
            onClick={handleVote}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              voted ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
            }`}
          >
            <Heart className={`h-4 w-4 ${voted ? "fill-current" : ""}`} />
            {votes}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
