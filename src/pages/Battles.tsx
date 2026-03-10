import BattleCard from "@/components/BattleCard";
import { mockBattles } from "@/data/mockData";

export default function Battles() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 font-display text-4xl font-bold">Batalhas</h1>
      <p className="mb-8 text-muted-foreground">Escolha uma batalha e entre na arena</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockBattles.map((b, i) => (
          <BattleCard key={b.id} battle={b} index={i} />
        ))}
      </div>
    </div>
  );
}
