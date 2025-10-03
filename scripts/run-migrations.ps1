# PowerShell helper to run EF Core migrations using docker-compose migrate service
# Usage:
#  - Edit .env and set BACKEND_SRC to the relative path to your backend project folder (the folder containing the .csproj)
#  - Then run this script from the repo root:
#      powershell.exe -ExecutionPolicy Bypass -File .\scripts\run-migrations.ps1

param(
    [string]$BackendSrc = "../backend",
    [string]$MigrationName = "CreatePacientesTable"
)

Write-Host "Running migrations with BACKEND_SRC='$BackendSrc' MIGRATION_NAME='$MigrationName'"

# Run the migration service (one-shot) passing env vars directly to docker-compose run
$cmd = "docker-compose run --rm -e BACKEND_SRC=$BackendSrc -e MIGRATION_NAME=$MigrationName migrate"
Write-Host "Executing: $cmd"
$process = Start-Process -FilePath powershell -ArgumentList "-NoProfile","-Command","$cmd" -Wait -PassThru -NoNewWindow
if ($process.ExitCode -ne 0) {
    Write-Error "docker-compose migrate failed with exit code $($process.ExitCode)"
    exit $process.ExitCode
}
Write-Host "Migrations completed successfully."