import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRandomTheme } from "@/data/themes";

export default function ThemeReveal() {
  const [theme, setTheme] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const revealTheme = () => {
    setIsRevealing(true);
    setTheme(null);

    // Rapid shuffle animation
    let count = 0;
    const interval = setInterval(() => {
      setTheme(getRandomTheme());
      count++;
      if (count > 12) {
        clearInterval(interval);
        setTheme(getRandomTheme());
        setIsRevealing(false);
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-2 font-display text-4xl font-bold">Tema da Batalha</h1>
        <p className="mb-12 text-muted-foreground">
          Clique para sortear um tema aleatório para desenhar
        </p>

        <div className="relative mb-10 flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-[0.04]" />

          <AnimatePresence mode="wait">
            {theme ? (
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10 px-8 py-6"
              >
                <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  &ldquo;{theme}&rdquo;
                </p>
              </motion.div>
            ) : !isRevealing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 text-muted-foreground"
              >
                <Sparkles className="h-10 w-10" />
                <p className="font-display text-lg">Clique para sortear</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <Button
          size="lg"
          onClick={revealTheme}
          disabled={isRevealing}
          className="gradient-hero border-0 text-primary-foreground font-display font-semibold text-base px-10 hover:opacity-90 transition-opacity"
        >
          {isRevealing ? (
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {theme ? "Sortear Outro Tema" : "Sortear Tema"}
        </Button>

        {theme && !isRevealing && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Mais de 2.600 temas disponíveis — cada sorteio é único!
          </motion.p>
        )}
      </div>
    </div>
  );
}
