import { useState, useEffect } from "react";
import type {
  CreateGameDto,
  UpdateGameDto,
  Genre,
  GameDetails,
} from "../types";
import { api } from "../api";
import { useToast } from "../context/ToastContext";

interface GameFormProps {
  game?: GameDetails;
  onSave: () => void;
  onCancel: () => void;
  preSelectedGenreId?: number;
}

export function GameForm({
  game,
  onSave,
  onCancel,
  preSelectedGenreId = 0,
}: GameFormProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: game?.name || "",
    genreId: game?.genreId || preSelectedGenreId || 0,
    price: game?.price || 0,
    releaseDate: game?.releaseDate ? game.releaseDate.split("T")[0] : "",
  });

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await api.getGenres();
        setGenres(genresData);
      } catch (err) {
        setError("Failed to load genres");
        showToast("Failed to load genres", "error");
        console.error(err);
      }
    };
    loadGenres();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (game) {
        // Update existing game
        const updateData: UpdateGameDto = {
          name: formData.name,
          genreId: formData.genreId,
          price: formData.price,
          releaseDate: formData.releaseDate,
        };
        await api.updateGame(game.id, updateData);
        showToast("Game updated successfully", "success");
      } else {
        // Create new game
        const createData: CreateGameDto = {
          name: formData.name,
          genreId: formData.genreId,
          price: formData.price,
          releaseDate: formData.releaseDate,
        };
        await api.createGame(createData);
        showToast("Game created successfully", "success");
      }
      onSave();
    } catch (err) {
      const errorMsg = game ? "Failed to update game" : "Failed to create game";
      setError(errorMsg);
      showToast(errorMsg, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "genreId" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="game-form">
      <h3>{game ? "Edit Game" : "Add New Game"}</h3>

      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={50}
        />
      </div>

      <div className="form-group">
        <label htmlFor="genreId">Genre:</label>
        <select
          id="genreId"
          name="genreId"
          value={formData.genreId}
          onChange={handleChange}
          required
        >
          <option value={0}>Select a genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min={1}
          max={100}
          step={0.01}
        />
      </div>

      <div className="form-group">
        <label htmlFor="releaseDate">Release Date:</label>
        <input
          type="date"
          id="releaseDate"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : game ? "Update Game" : "Create Game"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
