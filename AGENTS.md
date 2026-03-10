# Repository Guidelines

## Project Structure & Module Organization
This repo is a public Jekyll site. Top-level pages live in `index.md`; guided content lives in `getting-started/`, `guides/`, `reference/`, and `security/`; shared HTML snippets live in `_includes/`; static assets live in `assets/`.

## Build, Test, and Development Commands
- `jekyll serve`: run the site locally on `http://localhost:4000`.
- `bundle exec jekyll serve`: preferred if you are using Bundler-managed gems.

## Content Guidance
Keep content public-safe. Do not document private repo layout, internal service topology, secrets, or operational details that do not belong on the public docs site. Prefer linking to public repos and public product behavior.

## Commit & Pull Request Guidelines
Keep PRs scoped to one documentation topic or journey. Preview locally before merging when you touch navigation, Mermaid content, or shared includes.
