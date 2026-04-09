import { motion } from "framer-motion";
import { ArrowRight, Palette, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

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
              <span className="h-2 w-2 rounded-full gradient-accent animate-pulse" />
              Batalhas de desenho ao vivo
            </div>

            <h1 className="mb-6 font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
              Desenhe. Batalhe.{" "}
              <span className="text-gradient">Vença.</span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Artistas de todo o mundo competem em batalhas de desenho com temas aleatórios.
              15 minutos. Um tema. Quem faz o melhor desenho?
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {user ? (
                <>
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
                </>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="gradient-hero border-0 text-primary-foreground font-display font-semibold text-base px-8 hover:opacity-90 transition-opacity">
                    <LogIn className="mr-2 h-5 w-5" />
                    Fazer Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold">Como funciona?</h2>
            <div className="grid gap-6 sm:grid-cols-3 mt-8">
              {[
                { step: "1", title: "Entre numa batalha", desc: "Um tema aleatório é sorteado para todos" },
                { step: "2", title: "Desenhe em 15 min", desc: "Use as ferramentas de pintura para criar" },
                { step: "3", title: "Vote e ganhe pontos", desc: "A comunidade vota no melhor desenho" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full gradient-hero font-display text-lg font-bold text-primary-foreground">
                    {step}
                  </div>
                  <p className="font-display font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 DesenhaBrasil — Feito com 🎨 para artistas</p>
        </div>
      </footer>
    </div>
  );
}
