import VoteCard from "@/components/VoteCard";
import { mockDrawings } from "@/data/mockData";

export default function Voting() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">Votação Aberta</p>
        <h1 className="mb-1 font-display text-4xl font-bold">&ldquo;Carnaval dos sonhos&rdquo;</h1>
        <p className="text-muted-foreground">Vote nos melhores desenhos — você não pode votar no seu próprio!</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockDrawings.map((d, i) => (
          <VoteCard key={d.id} drawing={d} index={i} />
        ))}
      </div>
    </div>
  );
}
