import { motion } from "framer-motion";
import { Trophy, Medal, Star, MapPin } from "lucide-react";
import { mockArtists } from "@/data/mockData";

const PODIUM_STYLES = [
  "gradient-hero text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
];

export default function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 font-display text-4xl font-bold">Ranking Nacional</h1>
      <p className="mb-10 text-muted-foreground">Os melhores artistas do Brasil</p>

      {/* Podium */}
      <div className="mb-12 flex items-end justify-center gap-4">
        {[1, 0, 2].map((rank) => {
          const artist = mockArtists[rank];
          const isFirst = rank === 0;
          return (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rank * 0.2 }}
              className="text-center"
            >
              <div className={`mx-auto mb-3 flex items-center justify-center rounded-full font-display text-xl font-bold ${PODIUM_STYLES[rank]} ${isFirst ? "h-20 w-20" : "h-16 w-16"}`}>
                {artist.avatar}
              </div>
              <p className="font-display font-bold">{artist.name}</p>
              <p className="text-xs text-muted-foreground">{artist.city}, {artist.state}</p>
              <p className="mt-1 font-display text-lg font-bold text-primary">{artist.points} pts</p>
              <div className={`mt-2 rounded-t-lg ${PODIUM_STYLES[rank]} mx-auto ${isFirst ? "h-28 w-24" : rank === 1 ? "h-20 w-20" : "h-14 w-20"} flex items-center justify-center font-display text-2xl font-bold`}>
                {rank + 1}º
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 border-b border-border bg-muted px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>#</span><span>Artista</span><span>Vitórias</span><span>Batalhas</span><span>Pontos</span>
        </div>
        {mockArtists.map((artist, i) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center border-b border-border px-5 py-4 last:border-0 hover:bg-muted/50 transition-colors"
          >
            <span className={`font-display text-lg font-bold ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
              {i + 1}
            </span>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${i < 3 ? PODIUM_STYLES[i] : "bg-muted text-muted-foreground"}`}>
                {artist.avatar}
              </div>
              <div>
                <p className="font-semibold">{artist.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {artist.city}, {artist.state}
                </p>
              </div>
            </div>
            <span className="text-center font-display font-semibold">{artist.wins}</span>
            <span className="text-center text-muted-foreground">{artist.battles}</span>
            <span className="text-right font-display font-bold text-primary">{artist.points}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
