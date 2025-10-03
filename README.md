# JAMA

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

```markdown
# JAMA

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

```

1) From this folder (`JAMA.FE`) build and run:

```powershell
# Build images and start containers in foreground
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

2) Frontend will be available at http://localhost:4200 and will forward API calls to the backend at http://localhost:5000 via the `backend` container.

Notes about the backend path on Windows

- Your backend path is: `C:\Users\bladi\OneDrive\Documentos\AMA Respaldo Amatista, Semifinal\Backend` which contains spaces. In `docker-compose.yml` the volume mapping uses the quoted absolute path so Docker for Windows can mount it. If Docker Desktop is configured to use WSL2, and the backend is inside a OneDrive folder, you might run into permission or file-sync issues — consider moving the backend to a simple path (e.g., `C:\projects\backend`) or ensure Docker Desktop has access to the drive.

How to deliver to your client

Option A — Deliver docker-compose bundle (recommended):

- Provide the `docker-compose.yml`, `Dockerfile`, `nginx.conf`, and the frontend code (the repository). The client will run `docker-compose up --build`.

Option B — Provide built images:

- Build images locally and push them to a registry (Docker Hub, private registry). Example:

```powershell
# Tag and push frontend
docker build -t yourdockerhubuser/jama-frontend:latest .
docker push yourdockerhubuser/jama-frontend:latest

# For backend, either provide an image or let the client build from source.
```

Option C — Provide static build of the frontend:

- Run `npm run build` locally, then give the client the `dist/` folder and the `nginx.conf` if they want a simple nginx deployment.

Troubleshooting

- If the backend uses environment variables, ensure `docker-compose.yml` sets them or the backend reads from a .env file.
- If the backend listens only on 127.0.0.1, change it to listen on 0.0.0.0 so Docker container can accept outside connections.

Database migrations (EF Core)
--------------------------------
This repository includes an optional one-shot `migrate` service in `docker-compose.yml` that runs the .NET SDK image and executes EF Core migrations against the `sqlserver` service.

Two options to run migrations:

1) Quick (PowerShell helper) — from repo root on Windows:

```powershell
# Edit .env or set a path to your backend project if it's not the default
# Example: .\scripts\run-migrations.ps1 -BackendSrc "C:\path\to\backend" -MigrationName "CreatePacientesTable"
powershell.exe -ExecutionPolicy Bypass -File .\scripts\run-migrations.ps1 -BackendSrc "../Backend" -MigrationName "CreatePacientesTable"
```

2) Docker Compose manual run — cross-platform:

Set these environment variables (either in `.env` or inline):

- BACKEND_SRC: path to the backend project folder (must contain the .csproj)
- MIGRATION_NAME: the name for the migration to add (default CreatePacientesTable)

Then run:

```bash
# from repo root
BACKEND_SRC=../backend MIGRATION_NAME=CreatePacientesTable docker-compose run --rm migrate
```

Notes and assumptions:
- The `migrate` service uses the .NET SDK image (6.0 in the compose file). Adjust the image tag if your project targets a different SDK.
- The service mounts your backend source into `/app` inside the container and runs `dotnet restore`, `dotnet build`, `dotnet ef migrations add $MIGRATION_NAME` and `dotnet ef database update`.
- If you prefer migrations to run automatically at container start, we can wire them into the backend container start sequence — I didn't do that to keep control for the user and avoid unexpected codegen in the repo.
- Running `dotnet ef migrations add` will create files in the backend project folder. Because the compose service mounts the source as writable by default in our setup, migration files will appear on the host.

Dockerization example (integrated stack)

Below are example commands and docker-compose setup to run the full stack: SQL Server (DB), the backend image `amatistaariza/jama-backend:latest`, and this frontend.

1) Quick manual steps (you already provided these):

BD
```
docker pull mcr.microsoft.com/mssql/server

docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Amatista123!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server
```

BACK
docker pull amatistaariza/jama-backend:latest

docker network create jama 2>$null
docker network connect jama sqlserver 2>$null

docker run -d -p 5000:5000 --name jama-backend_local --network backvacunas_net `-e "ASPNETCORE_ENVIRONMENT=Production" `-e "ASPNETCORE_URLS=http://+:5000" `-e "ConnectionStrings__Conexion=Server=sqlserver,1433;Database=VacunasBD;User Id=sa;Password=Amatista123!;TrustServerCertificate=True;" `amatistaariza/jama-backend:latest
docker run -d -p 5000:5000 --name jama-backend_local --network backvacunas_net `-e "ASPNETCORE_ENVIRONMENT=Production" `-e "ASPNETCORE_URLS=http://+:5000" `-e "ConnectionStrings__Conexion=Server=sqlserver,1433;Database=VacunasBD;User Id=sa;Password=Amatista123!;TrustServerCertificate=True;" `amatistaariza/jama-backend:latest
```

2) Recommended: run the integrated stack with docker-compose (from this repo root):

```
# Build frontend image and start services (foreground)
docker-compose up --build

# Or in background
docker-compose up -d --build
```

This `docker-compose.yml` starts three services:

- `frontend` (built from this repository) — served by nginx on port 4200 on the host.
	- `backend` (pulls `amatistaariza/jama-backend:latest`) — exposed on port 5000 on the host.
- `sqlserver` (Microsoft SQL Server) — exposed on port 1433 on the host.

Notes and troubleshooting

- If you run the manual `docker run` commands, ensure the backend and sqlserver are attached to the same Docker network (example uses `jama`).
- On Windows, when mounting host paths into containers, prefer paths without spaces. If you need to mount a Windows path containing spaces, quote it in `docker-compose.yml` and ensure Docker Desktop has file sharing permissions for the drive.
- The SQL Server service may take a minute to become healthy; the compose file includes a healthcheck and `depends_on` ordering to help.

Security note

- The sample SA password `Amatista123!` is included only as an example coming from your message. Use a strong secret in production and store it in a secrets manager or environment variables — do not commit real passwords to source control.

If you want, I can:

- Add a .env file and wire `docker-compose.yml` to read passwords and connection strings from it.
- Publish a prebuilt frontend image to Docker Hub and update compose to pull it instead of building locally.
- Add a small health-check or readiness endpoint verification for the backend.
