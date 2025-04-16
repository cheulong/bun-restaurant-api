simple api to return content of hero section of bun resturant landing page
## Getting Started

### Prerequisites

- Node.js
- Docker

### Running the app

```bash
docker compose -f compose.dev.yaml up
```

### Stopping the app

```bash
docker compose -f compose.dev.yaml down 'api' --rmi local --volumes
```

### Building the app

```bash
docker build -f Dockerfile.prod -t <username>:bun-restaurant-api:1.0.0 .
```

## Pushing the app to Docker Hub

```bash
docker push <username>/bun-restaurant-api:1.0.0
```
