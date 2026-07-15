# Ecole Directe Badge Bypass

Static web application used to create a custom Ecole Directe badge.

## Repository layout

- `site/`: snapshot of the website that was served in production before the
  Dokploy migration.
- `nginx/default.conf`: static-file routing, cache policy, health endpoint, and
  compatibility-safe security headers.
- `Dockerfile`: pinned, unprivileged Nginx image.
- `compose.yaml`: hardened runtime used by Dokploy.
- `checksums/site.sha256`: file-level integrity manifest for the migrated site.

The production snapshot was captured from the legacy Raspberry Pi on
2026-07-15. The old `.vscode` directory is retained only in the cold migration
archive and is intentionally not published by this image.

## Local container

```bash
docker build -t ed-badge-bypass .
docker run --rm -p 8080:8080 ed-badge-bypass
```

Open `http://localhost:8080`. The health endpoint is available at
`http://localhost:8080/healthz`.

## Deployment

Dokploy builds `compose.yaml` from this repository and routes
`ed-badge-bypass.fr` to the `web` service on port `8080`. TLS termination is
handled by Traefik.
