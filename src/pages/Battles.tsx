import { motion } from "framer-motion";
import { Swords } from "lucide-react";

export default function Battles() {
  // No real battles yet - show empty state
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 font-display text-4xl font-bold">Batalhas</h1>
      <p className="mb-8 text-muted-foreground">Escolha uma batalha e entre na arena</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 text-center"
      >
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Swords className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-bold">Nenhuma batalha ativa</h2>
        <p className="max-w-md text-muted-foreground">
          Quando batalhas reais forem criadas, elas aparecerão aqui. Fique de olho!
        </p>
      </motion.div>
    </div>
  );
}
