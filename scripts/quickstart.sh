#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker Desktop: https://www.docker.com/get-started" >&2
  exit 1
fi

echo "Building Flux image..."
docker build -t flux-mcp .

echo "Starting Flux web/API..."
docker compose up -d

echo ""
echo "Flux is running: http://localhost:3000"
echo ""
echo "Run MCP (Claude/Codex):"
echo "  docker run -i --rm -v flux-data:/app/packages/data flux-mcp"
