import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Send, CheckCircle } from "lucide-react";
import DrawingCanvas from "@/components/DrawingCanvas";
import TimerComponent from "@/components/Timer";
import { mockBattles } from "@/data/mockData";
import { getRandomTheme } from "@/data/themes";
import { Button } from "@/components/ui/button";

export default function BattleRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const battle = mockBattles.find((b) => b.id === id) || mockBattles[0];
  const [startedAt] = useState(Date.now());
  const [theme] = useState(battle?.theme || getRandomTheme());
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!submitted) return;
    if (countdown <= 0) {
      navigate(`/voting/${id || battle.id}`);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [submitted, countdown, navigate, id, battle.id]);

  if (submitted) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full gradient-hero">
            <CheckCircle className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mb-2 font-display text-3xl font-bold">Desenho Enviado!</h2>
          <p className="text-muted-foreground">Indo para votação em {countdown}s… 🎨</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Tema da Batalha</p>
          <h1 className="font-display text-3xl font-bold">&ldquo;{theme}&rdquo;</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {battle.participants} artistas
          </div>
          <TimerComponent startedAt={startedAt} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <DrawingCanvas />
        <div className="mt-4 flex justify-end">
          <Button
            size="lg"
            onClick={() => setSubmitted(true)}
            className="gradient-hero border-0 text-primary-foreground font-display font-semibold px-8 hover:opacity-90 transition-opacity"
          >
            <Send className="mr-2 h-5 w-5" />
            Enviar Desenho
          </Button>
        </div>
      </div>
    </div>
  );
}
