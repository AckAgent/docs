# AckAgent Documentation

Public documentation for [AckAgent](https://ackagent.com), built with [MkDocs](https://www.mkdocs.org/) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

## Local Development

### Prerequisites

- Python 3.12+

### Serve locally

```bash
make serve
```

This automatically creates a `.venv`, installs dependencies (`mkdocs`, `mkdocs-material`, `pymdown-extensions`), and starts a live-reload server at http://localhost:8000.

To rebuild from scratch:

```bash
make clean
make serve
```

## Publishing

Documentation is deployed to GitHub Pages on push to `main` or via manual workflow dispatch.

### GitHub Pages Setup (one-time)

1. Go to repository **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. If using a custom domain, configure it under **Custom domain**

### Manual Deployment

Go to **Actions → Deploy Documentation** → **Run workflow**.

## Structure

```
├── mkdocs.yml              # Site configuration
├── docs/
│   ├── index.md            # Landing page
│   ├── getting-started/    # Installation & setup
│   ├── guides/             # Use case guides (git, SSH, etc.)
│   ├── security/           # Security & privacy docs
│   └── reference/          # CLI reference & troubleshooting
├── overrides/              # MkDocs theme overrides
└── site/                   # Build output (gitignored)
```

## Adding Content

1. Create a markdown file in the appropriate directory
2. Add it to the `nav` section in `mkdocs.yml`
3. Preview locally with `make serve`

Supports [Mermaid diagrams](https://mermaid.js.org/), [admonitions](https://squidfunk.github.io/mkdocs-material/reference/admonitions/), and [content tabs](https://squidfunk.github.io/mkdocs-material/reference/content-tabs/).

## Related Repos

- [AckAgent/cli](https://github.com/AckAgent/cli) — CLI tool
- [AckAgent/web-sdk](https://github.com/AckAgent/web-sdk) — Web SDK
