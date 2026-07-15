# Ecole Directe Badge Bypass

Local-first React application used to compose an Ecole Directe badge preview.
User data and imported photos stay in the browser.

## Development

```bash
bun install --frozen-lockfile
bun run dev
```

Quality gates:

```bash
bun run lint
bun run typecheck
bun run build
```

## Production image

The Dockerfile uses two stages:

1. Bun installs the locked dependencies and creates the minified Vite build.
2. An unprivileged Nginx image receives only the generated `dist` files.

No source files, development dependencies, or local user data are included in
the runtime image.

```bash
docker build -t ed-badge-bypass .
docker run --rm -p 8080:8080 ed-badge-bypass
```

Open `http://localhost:8080`. The health endpoint is
`http://localhost:8080/healthz`.

## Dokploy

Create or update a Compose application with these settings:

- repository: `Fefedu973/Ecole-Directe-Badge-Bypass`;
- Compose file: `compose.yaml`;
- service: `web`;
- container port: `8080`;
- branch: `main`;
- domain and HTTPS: configured in Dokploy and terminated by Traefik.

Do not publish a host port in Compose. Dokploy reaches the exposed container
port through its internal network. Automatic deployments can be enabled from
the repository integration after the target branch is selected.

The Compose service runs read-only, drops Linux capabilities, forbids privilege
escalation, and uses the image healthcheck. Nginx provides the SPA fallback,
short caching for public files, and long caching for hashed Vite assets.
