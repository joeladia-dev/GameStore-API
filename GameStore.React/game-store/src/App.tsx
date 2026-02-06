import { useState, useEffect } from "react";
import "./App.css";
import { GamesList } from "./components/GamesList";
import { GameForm } from "./components/GameForm";
import { Toast } from "./components/Toast";
import { ToastProvider } from "./context/ToastContext";
import type { GameSummary, GameDetails, Genre } from "./types";
import { api } from "./api";

type ViewMode = "list" | "create" | "edit" | "details";

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedGenreId, setSelectedGenreId] = useState<number>(0);

  const loadGenres = async () => {
    try {
      const genresData = await api.getGenres();
      setGenres(genresData);
    } catch (error) {
      console.error("Error loading genres:", error);
    }
  };

  // Load genres on mount
  useEffect(() => {
    loadGenres();
  }, []);

  const handleGameSelect = async (game: GameSummary) => {
    try {
      const gameDetails = await api.getGame(game.id);
      setSelectedGame(gameDetails);
      setCurrentView("details");
    } catch (error) {
      console.error("Error loading game details:", error);
    }
  };

  const handleCreateGame = () => {
    setSelectedGame(null);
    setSelectedGenreId(0);
    setCurrentView("create");
  };

  const handleCreateGameWithGenre = (genreId: number) => {
    setSelectedGame(null);
    setSelectedGenreId(genreId);
    setCurrentView("create");
  };

  const handleEditGame = async (game: GameSummary | GameDetails) => {
    try {
      let gameDetails: GameDetails;
      // If it's a GameSummary, fetch the details. If it's already GameDetails, use it directly
      if ("price" in game && "releaseDate" in game && "genreId" in game) {
        gameDetails = game as GameDetails;
      } else {
        gameDetails = await api.getGame((game as GameSummary).id);
      }
      setSelectedGame(gameDetails);
      setCurrentView("edit");
    } catch (error) {
      console.error("Error loading game details:", error);
    }
  };

  const handleSave = () => {
    setRefreshTrigger((prev) => prev + 1);
    setCurrentView("list");
    setSelectedGame(null);
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedGame(null);
  };

  const handleGameDelete = (gameId: number) => {
    if (selectedGame?.id === gameId) {
      setSelectedGame(null);
      setCurrentView("list");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "create":
        return (
          <GameForm
            onSave={handleSave}
            onCancel={handleCancel}
            preSelectedGenreId={selectedGenreId}
          />
        );

      case "edit":
        return selectedGame ? (
          <GameForm
            game={selectedGame}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : null;

      case "details":
        return selectedGame ? (
          <div className="game-details">
            <h2>{selectedGame.name}</h2>
            <p>
              <strong>Genre ID:</strong> {selectedGame.genreId}
            </p>
            <p>
              <strong>Price:</strong> ${selectedGame.price}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {new Date(selectedGame.releaseDate).toLocaleDateString()}
            </p>
            <div className="game-actions">
              <button
                onClick={() => selectedGame && handleEditGame(selectedGame)}
                className="action-btn edit-btn"
              >
                Edit Game
              </button>
              <button
                onClick={() => setCurrentView("list")}
                className="action-btn back-btn"
              >
                Back to List
              </button>
            </div>
          </div>
        ) : null;

      default:
        return (
          <div>
            <div className="section-header">
              <h2>Games</h2>
              <button onClick={handleCreateGame} className="add-btn">
                Add New Game
              </button>
            </div>
            <GamesList
              key={refreshTrigger}
              onGameSelect={handleGameSelect}
              onGameDelete={handleGameDelete}
              onGameEdit={handleEditGame}
            />
          </div>
        );
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Game Store</h1>
        {currentView !== "list" && (
          <button onClick={() => setCurrentView("list")} className="back-btn">
            ← Back to Games
          </button>
        )}
      </header>
      <main>
        <section>{renderContent()}</section>
        {currentView === "list" && (
          <section>
            <h2>Genres</h2>
            <div className="genres-container">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleCreateGameWithGenre(genre.id)}
                  className="genre-btn"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
      <Toast />
    </ToastProvider>
  );
}

export default App;
