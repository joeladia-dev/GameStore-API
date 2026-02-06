export interface GameSummary {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: string;
}

export interface GameDetails {
  id: number;
  name: string;
  genreId: number;
  price: number;
  releaseDate: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CreateGameDto {
  name: string;
  genreId: number;
  price: number;
  releaseDate: string;
}

export interface UpdateGameDto {
  name: string;
  genreId: number;
  price: number;
  releaseDate: string;
}