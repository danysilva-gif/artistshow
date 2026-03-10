import { motion } from "framer-motion";
import { ArrowRight, Palette, Trophy, Users, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BattleCard from "@/components/BattleCard";
import { mockBattles, mockArtists } from "@/data/mockData";

export default function Index() {
  const activeBattles = mockBattles.filter((b) => b.status !== "finished");
  const topArtists = mockArtists.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-[0.07]" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <span className="h-2 w-2 rounded-full gradient-accent animate-pulse-glow" />
              Batalhas ao vivo agora
            </div>

            <h1 className="mb-6 font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
              Desenhe. Batalhe.{" "}
              <span className="text-gradient">Conquiste o Brasil.</span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Artistas de todo o Brasil competem em batalhas de desenho com temas aleatórios.
              19 minutos. Um tema. Quem faz o melhor desenho?
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/battles">
                <Button size="lg" className="gradient-hero border-0 text-primary-foreground font-display font-semibold text-base px-8 hover:opacity-90 transition-opacity">
                  Entrar numa Batalha
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline" size="lg" className="font-display font-semibold text-base px-8">
                  Ver Ranking
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 py-8">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 md:grid-cols-4">
          {[
            { icon: Users, value: "2.4k", label: "Artistas" },
            { icon: Palette, value: "12.8k", label: "Desenhos" },
            { icon: Trophy, value: "890", label: "Batalhas" },
            { icon: Timer, value: "19 min", label: "Por batalha" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="font-display text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active Battles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold">Batalhas Ativas</h2>
              <p className="mt-1 text-muted-foreground">Entre agora e mostre seu talento</p>
            </div>
            <Link to="/battles" className="text-sm font-semibold text-primary hover:underline">
              Ver todas <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeBattles.map((battle, i) => (
              <BattleCard key={battle.id} battle={battle} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Artists Preview */}
      <section className="border-t border-border bg-card/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold">Top Artistas</h2>
              <p className="mt-1 text-muted-foreground">Os melhores do ranking nacional</p>
            </div>
            <Link to="/leaderboard" className="text-sm font-semibold text-primary hover:underline">
              Ranking completo <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {topArtists.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-bold ${i === 0 ? "gradient-hero text-primary-foreground" : i === 1 ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}>
                  {artist.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold">{artist.name}</p>
                  <p className="text-sm text-muted-foreground">{artist.city}, {artist.state}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-primary">{artist.points}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 DesenhaBrasil — Feito com 🎨 para artistas brasileiros</p>
        </div>
      </footer>
    </div>
  );
}
