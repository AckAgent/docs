# AckAgent Documentation

Public documentation for [AckAgent](https://ackagent.com), served by [GitHub Pages](https://pages.github.com/) with Jekyll and the Cayman theme.

## Local Development

```bash
gem install jekyll bundler
jekyll serve
```

Open http://localhost:4000.

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
├── _config.yml             # Jekyll configuration
├── _includes/
│   └── head-custom.html    # Mermaid.js injection
├── index.md                # Landing page
├── getting-started/        # Installation & setup
├── guides/                 # Use case guides (git, SSH, etc.)
├── security/               # Security & privacy docs
├── reference/              # CLI reference & troubleshooting
└── assets/                 # SVG icons
```

## Adding Content

1. Create a markdown file in the appropriate directory
2. Preview locally with `jekyll serve`
3. Push to `main` to deploy

Supports [Mermaid diagrams](https://mermaid.js.org/) via client-side rendering.

## Related Repos

- [AckAgent/cli](https://github.com/AckAgent/cli) — CLI tool
- [AckAgent/web-sdk](https://github.com/AckAgent/web-sdk) — Web SDK
