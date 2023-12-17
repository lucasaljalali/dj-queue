export interface IMusic {
  id: number;
  title: string;
  genre: Rock | Jazz | Electronic | Techno | Country | Pop | Funk;
  duration: number;
  votes: number;
}

export type Order = "asc" | "desc";
