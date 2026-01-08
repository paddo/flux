$ErrorActionPreference = "Stop"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error "Docker is required. Install Docker Desktop: https://www.docker.com/get-started"
  exit 1
}

Write-Host "Building Flux image..."
docker build -t flux-mcp .

Write-Host "Starting Flux web/API..."
docker compose up -d

Write-Host ""
Write-Host "Flux is running: http://localhost:3000"
Write-Host ""
Write-Host "Run MCP (Claude/Codex):"
Write-Host "  docker run -i --rm -v flux-data:/app/packages/data flux-mcp"
