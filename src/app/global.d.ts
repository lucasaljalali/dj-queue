export interface IMusic {
  id: string;
  title: string;
  genre: MusicGenre;
  duration: number;
  votes: number;
}
export type MusicGenre = "Rock" | "Jazz" | "Electronic" | "Techno" | "Country" | "Pop" | "Funk";

export type Order = "asc" | "desc";
