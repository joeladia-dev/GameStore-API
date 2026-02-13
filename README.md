# GameStore Deployment & Secrets Guide

Short notes to keep secrets out of Git and configure environments for a smooth deploy.

**Backend (Azure App Service)**

- **Connection string**: Configure `DefaultConnection` in Azure App Service → Settings → Environment variables → Connection strings (type: SQLAzure). This overrides values in your app at runtime.
- **Do not commit secrets**: Keep production SQL credentials out of source control. The root ignore file [\.gitignore](.gitignore) excludes [GameStore.Api/appsettings.json](GameStore.Api/appsettings.json).
- **Local development**: Use [GameStore.Api/appsettings.Development.json](GameStore.Api/appsettings.Development.json) (SQLite or local DB). The app reads `ASPNETCORE_ENVIRONMENT=Development` when running locally.
- **Managed Identity (optional, recommended)**: Use `Authentication=Active Directory Default` in the `DefaultConnection` and create an Entra ID user for the Web App’s managed identity in SQL (grant `db_datareader` and `db_datawriter`).

**Frontend (Netlify)**

- **API base URL**: Set a build-time env var in Netlify → Site settings → Build & deploy → Environment:
  - `VITE_API_BASE_URL = https://gamestore-api-leojpc.azurewebsites.net`
- **Code expects env var**: See [GameStore.React/game-store/src/api.ts](GameStore.React/game-store/src/api.ts). It reads `VITE_API_BASE_URL`, falling back to the Azure API URL for production builds.
- **Optional SPA routing**: Add `netlify.toml` with a `/* → /index.html` rewrite if you have client-side routes.

**Git hygiene**

- Ignored by design: `**/bin/`, `**/obj/`, `**/.vs/`, `**/publish/`, `publish-api/`, archives like `deploy.zip`, local DB [GameStore.Api/GameStore.db](GameStore.Api/GameStore.db), React `node_modules/`, `dist/`, `.env` files.
- Quick checks before push:
  ```powershell
  git status
  git check-ignore -v GameStore.Api/appsettings.json
  git grep -n -I "Password=" || echo No inline passwords found
  git grep -n -I "ConnectionString" || echo No inline connection strings found
  ```

**Local build/test (optional)**

- React build (production):
  ```powershell
  cd GameStore.React\game-store
  npm ci
  set VITE_API_BASE_URL=https://gamestore-api-leojpc.azurewebsites.net & npm run build
  ```
- API quick run (development):
  ```powershell
  cd GameStore.Api
  dotnet run
  ```
- Endpoint smoke test:
  ```powershell
  Invoke-WebRequest https://gamestore-api-leojpc.azurewebsites.net/games
  Invoke-WebRequest https://gamestore-api-leojpc.azurewebsites.net/genres
  ```
