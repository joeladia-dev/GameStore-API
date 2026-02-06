import { useState, useEffect } from "react";
import type { GameSummary } from "../types";
import { api } from "../api";
import { useToast } from "../context/ToastContext";

interface GamesListProps {
  onGameSelect?: (game: GameSummary) => void;
  onGameDelete?: (gameId: number) => void;
  onGameEdit?: (game: GameSummary) => void;
}

export function GamesList({
  onGameSelect,
  onGameDelete,

  
  onGameEdit,
}: GamesListProps) {
  const [games, setGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast, showConfirm } = useToast();

  const loadGames = async () => {
    try {
      setLoading(true);
      const gamesData = await api.getGames();
      setGames(gamesData);
      setError(null);
    } catch (err) {
      setError("Failed to load games");
      showToast("Failed to load games", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleDelete = async (gameId: number) => {
    showConfirm("Are you sure you want to delete this game?", async () => {
      try {
        await api.deleteGame(gameId);
        setGames(games.filter((game) => game.id !== gameId));
        onGameDelete?.(gameId);
        showToast("Game deleted successfully", "success");
      } catch (err) {
        setError("Failed to delete game");
        showToast("Failed to delete game", "error");
        console.error(err);
      }
    });
  };

  if (loading) return <div className="loading">Loading games...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="games-list">
      <table className="games-table">
        <thead>
          <tr>
            <th>Game Name</th>
            <th>Genre</th>
            <th>Price</th>
            <th>Release Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>{game.name}</td>
              <td>{game.genre}</td>
              <td>${game.price.toFixed(2)}</td>
              <td>{new Date(game.releaseDate).toLocaleDateString()}</td>
              <td>
                <div className="table-actions">
                  {onGameEdit && (
                    <button
                      onClick={() => onGameEdit(game)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                  )}
                  {onGameSelect && (
                    <button
                      onClick={() => onGameSelect(game)}
                      className="view-btn"
                    >
                      View Details
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {games.length === 0 && (
        <div className="no-games">
          No games available. Create one to get started!
        </div>
      )}
    </div>
  );
}
