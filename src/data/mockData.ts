export interface Artist {
  id: string;
  name: string;
  avatar: string;
  city: string;
  state: string;
  wins: number;
  battles: number;
  points: number;
}

export interface Battle {
  id: string;
  theme: string;
  status: "waiting" | "active" | "voting" | "finished";
  participants: number;
  maxParticipants: number;
  endsAt?: string;
}

export interface Drawing {
  id: string;
  artistId: string;
  artistName: string;
  artistCity: string;
  battleId: string;
  imageUrl: string;
  votes: number;
  theme: string;
}

export const mockArtists: Artist[] = [
  { id: "1", name: "Ana Beatriz", avatar: "AB", city: "São Paulo", state: "SP", wins: 42, battles: 67, points: 3240 },
  { id: "2", name: "Carlos Silva", avatar: "CS", city: "Rio de Janeiro", state: "RJ", wins: 38, battles: 55, points: 2890 },
  { id: "3", name: "Mariana Costa", avatar: "MC", city: "Salvador", state: "BA", wins: 35, battles: 50, points: 2650 },
  { id: "4", name: "Pedro Henrique", avatar: "PH", city: "Belo Horizonte", state: "MG", wins: 31, battles: 48, points: 2410 },
  { id: "5", name: "Julia Santos", avatar: "JS", city: "Curitiba", state: "PR", wins: 28, battles: 45, points: 2180 },
  { id: "6", name: "Rafael Lima", avatar: "RL", city: "Recife", state: "PE", wins: 25, battles: 40, points: 1950 },
  { id: "7", name: "Fernanda Alves", avatar: "FA", city: "Fortaleza", state: "CE", wins: 22, battles: 38, points: 1720 },
  { id: "8", name: "Lucas Oliveira", avatar: "LO", city: "Porto Alegre", state: "RS", wins: 20, battles: 35, points: 1540 },
  { id: "9", name: "Isabela Rocha", avatar: "IR", city: "Brasília", state: "DF", wins: 18, battles: 32, points: 1380 },
  { id: "10", name: "Thiago Mendes", avatar: "TM", city: "Manaus", state: "AM", wins: 15, battles: 28, points: 1150 },
];

export const mockBattles: Battle[] = [
  { id: "b1", theme: "Floresta encantada", status: "active", participants: 8, maxParticipants: 12, endsAt: new Date(Date.now() + 12 * 60000).toISOString() },
  { id: "b2", theme: "Carnaval dos sonhos", status: "voting", participants: 12, maxParticipants: 12 },
  { id: "b3", theme: "O fundo do oceano", status: "waiting", participants: 3, maxParticipants: 12 },
  { id: "b4", theme: "Noite estrelada no Rio", status: "waiting", participants: 6, maxParticipants: 12 },
  { id: "b5", theme: "Vida no sertão", status: "finished", participants: 10, maxParticipants: 12 },
];

export const mockDrawings: Drawing[] = [
  { id: "d1", artistId: "1", artistName: "Ana Beatriz", artistCity: "São Paulo, SP", battleId: "b2", imageUrl: "/placeholder.svg", votes: 24, theme: "Carnaval dos sonhos" },
  { id: "d2", artistId: "2", artistName: "Carlos Silva", artistCity: "Rio de Janeiro, RJ", battleId: "b2", imageUrl: "/placeholder.svg", votes: 19, theme: "Carnaval dos sonhos" },
  { id: "d3", artistId: "3", artistName: "Mariana Costa", artistCity: "Salvador, BA", battleId: "b2", imageUrl: "/placeholder.svg", votes: 31, theme: "Carnaval dos sonhos" },
  { id: "d4", artistId: "4", artistName: "Pedro Henrique", artistCity: "Belo Horizonte, MG", battleId: "b2", imageUrl: "/placeholder.svg", votes: 15, theme: "Carnaval dos sonhos" },
  { id: "d5", artistId: "5", artistName: "Julia Santos", artistCity: "Curitiba, PR", battleId: "b2", imageUrl: "/placeholder.svg", votes: 22, theme: "Carnaval dos sonhos" },
  { id: "d6", artistId: "6", artistName: "Rafael Lima", artistCity: "Recife, PE", battleId: "b2", imageUrl: "/placeholder.svg", votes: 17, theme: "Carnaval dos sonhos" },
];
