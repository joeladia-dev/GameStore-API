import type {
  GameSummary,
  GameDetails,
  Genre,
  CreateGameDto,
  UpdateGameDto,
} from "./types";

// Use build-time env var for production (Netlify), fallback to Azure API URL
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL ?? "https://gamestore-api-leojpc.azurewebsites.net";

export const api = {
  // Games
  getGames: async (): Promise<GameSummary[]> => {
    const response = await fetch(`${API_BASE_URL}/games`);
    if (!response.ok) throw new Error("Failed to fetch games");
    return response.json();
  },

  getGame: async (id: number): Promise<GameDetails> => {
    const response = await fetch(`${API_BASE_URL}/games/${id}`);
    if (!response.ok) throw new Error("Failed to fetch game");
    return response.json();
  },

  createGame: async (game: CreateGameDto): Promise<GameDetails> => {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
    if (!response.ok) throw new Error("Failed to create game");
    return response.json();
  },

  updateGame: async (id: number, game: UpdateGameDto): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
    if (!response.ok) throw new Error("Failed to update game");
  },

  deleteGame: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete game");
  },

  // Genres
  getGenres: async (): Promise<Genre[]> => {
    const response = await fetch(`${API_BASE_URL}/genres`);
    if (!response.ok) throw new Error("Failed to fetch genres");
    return response.json();
  },
};
