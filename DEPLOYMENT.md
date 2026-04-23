# Deployment Guide

This document covers deploying the WriteSpace Blog application to production. WriteSpace is a fully client-side single-page application (SPA) with no backend server or environment variables required.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build for Production](#build-for-production)
- [Vercel Deployment](#vercel-deployment)
  - [Auto-Deploy via Git](#auto-deploy-via-git)
  - [Manual Deploy via Vercel CLI](#manual-deploy-via-vercel-cli)
  - [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Other Static Hosts](#other-static-hosts)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Generic Static Server](#generic-static-server)
- [Environment Requirements](#environment-requirements)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)
  - [SPA Routing Issues](#spa-routing-issues)
  - [localStorage Issues](#localstorage-issues)
  - [Build Failures](#build-failures)

---

## Prerequisites

- **Node.js 18+** and **npm** installed locally (for building the project)
- A Git repository hosted on GitHub, GitLab, or Bitbucket (for auto-deploy workflows)
- A [Vercel](https://vercel.com) account (recommended) or any static hosting provider

## Build for Production

Run the following commands from the project root:

```bash
# Install dependencies
npm install

# Build optimized production bundle
npm run build
```

This uses Vite to compile and bundle the application. The output is written to the `dist/` directory, which contains:

- `index.html` — The single HTML entry point
- `assets/` — Hashed JavaScript and CSS bundles

You can preview the production build locally before deploying:

```bash
npm run preview
```

This serves the `dist/` directory at `http://localhost:4173` by default.

## Vercel Deployment

Vercel is the recommended hosting platform for WriteSpace. It auto-detects Vite projects and requires minimal configuration.

### Auto-Deploy via Git

1. **Push your repository** to GitHub, GitLab, or Bitbucket.

2. **Import the project** in the [Vercel Dashboard](https://vercel.com/new):
   - Select your Git provider and repository.
   - Vercel will auto-detect the framework as **Vite**.

3. **Confirm the build settings** (these should be auto-detected):

   | Setting          | Value            |
   | ---------------- | ---------------- |
   | Framework Preset | Vite             |
   | Build Command    | `npm run build`  |
   | Output Directory | `dist`           |
   | Install Command  | `npm install`    |

4. **Click Deploy**. Vercel will build and deploy the application.

5. **Automatic redeployments**: Every push to the default branch (e.g., `main`) will trigger a new production deployment. Pull requests will generate preview deployments automatically.

### Manual Deploy via Vercel CLI

If you prefer deploying from the command line:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy from the project root
vercel

# Deploy directly to production
vercel --prod
```

The CLI will prompt you to confirm project settings on the first run. Subsequent deployments will reuse the saved configuration.

### SPA Rewrite Configuration

WriteSpace uses client-side routing via React Router DOM. All routes (e.g., `/blogs`, `/blog/123`, `/dashboard`) must be served by `index.html` so that React Router can handle them in the browser.

The project includes a `vercel.json` file that configures this rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel to serve `index.html` for every request path, regardless of whether a matching file exists. Vite's hashed asset files in `dist/assets/` are still served correctly because Vercel checks for static files before applying rewrite rules.

**Do not remove or modify `vercel.json`** unless you are migrating to a different hosting provider. Without this rewrite rule, navigating directly to any route other than `/` (e.g., refreshing the page on `/blogs`) will return a 404 error.

## Other Static Hosts

WriteSpace can be deployed to any static hosting provider. The key requirement is that **all requests must be rewritten to `index.html`** for client-side routing to work.

### Netlify

Create a `netlify.toml` file in the project root (or configure via the Netlify dashboard):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Alternatively, create a `public/_redirects` file:

```
/*    /index.html   200
```

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. You have two options:

1. **Use a 404.html workaround**: Copy `dist/index.html` to `dist/404.html` after building. GitHub Pages will serve `404.html` for unknown routes, which loads the app and lets React Router handle the path.

   ```bash
   npm run build
   cp dist/index.html dist/404.html
   ```

2. **Use HashRouter instead of BrowserRouter**: This changes URLs from `/blogs` to `/#/blogs`, avoiding the need for server-side rewrites. This requires modifying `src/App.jsx` to import `HashRouter` instead of `BrowserRouter`.

### Generic Static Server

If you are serving the `dist/` directory with a generic HTTP server (e.g., Nginx, Apache, Caddy), configure a fallback to `index.html`.

**Nginx example:**

```nginx
server {
    listen 80;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache example** (`.htaccess` in the `dist/` directory):

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Environment Requirements

WriteSpace is a fully client-side application. **No environment variables, API keys, or backend services are required.**

- There is no `.env` file needed.
- There are no server-side dependencies.
- All data (users, posts, sessions) is stored in the browser's `localStorage`.
- The default admin account (`admin` / `admin123`) is hard-coded in the application source.

This means the deployment process is simply: build the static files and serve them.

## CI/CD Pipeline

### Vercel Auto-Deploy (Recommended)

When connected to a Git repository, Vercel provides a fully managed CI/CD pipeline:

| Trigger                        | Result                          |
| ------------------------------ | ------------------------------- |
| Push to `main` (or default)    | Production deployment           |
| Push to any other branch       | Preview deployment              |
| Pull request opened/updated    | Preview deployment with PR link |
| Pull request merged to `main`  | Production deployment           |

No additional CI/CD configuration files are needed. Vercel handles dependency installation, building, and deployment automatically.

### Custom CI/CD (GitHub Actions Example)

If you want to run additional checks (e.g., linting) before deploying, you can set up a GitHub Actions workflow:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Verify dist output
        run: ls -la dist/
```

If using Vercel with GitHub, the Vercel GitHub integration will still handle the actual deployment. The workflow above is useful for running additional validation steps.

## Troubleshooting

### SPA Routing Issues

**Symptom:** Navigating directly to a URL like `/blogs` or `/blog/123` (by typing it in the address bar or refreshing the page) returns a 404 error or a blank page.

**Cause:** The hosting provider is looking for a file at that path (e.g., `dist/blogs/index.html`) instead of serving `index.html` and letting React Router handle the route.

**Solutions:**

1. **Verify `vercel.json` exists** in the project root with the correct rewrite rule:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. **Redeploy after adding `vercel.json`**. If the file was added after the initial deployment, Vercel may not have picked it up. Push a new commit or trigger a manual redeploy from the Vercel dashboard.

3. **Check your hosting provider's rewrite/redirect configuration** if not using Vercel. See the [Other Static Hosts](#other-static-hosts) section above.

4. **Confirm the build output** contains `index.html` at the root of the `dist/` directory:
   ```bash
   npm run build
   ls dist/index.html
   ```

---

### localStorage Issues

**Symptom:** Data (posts, users, sessions) is missing or not persisting between page loads.

**Possible causes and solutions:**

1. **Different domains or subdomains**: localStorage is scoped to the origin (protocol + domain + port). Data stored on `https://writespace.vercel.app` is not accessible from `https://writespace-git-feature.vercel.app` (Vercel preview deployments use different subdomains). This is expected behavior — each deployment preview has its own isolated localStorage.

2. **Browser private/incognito mode**: Some browsers restrict or clear localStorage in private browsing mode. Test in a regular browser window.

3. **localStorage is full**: Browsers typically limit localStorage to 5–10 MB per origin. If you have a very large number of posts or users, you may hit this limit. Clear old data or check usage:
   ```javascript
   // Run in browser console to check localStorage usage
   const total = Object.keys(localStorage).reduce(
     (acc, key) => acc + localStorage.getItem(key).length,
     0
   );
   console.log(`localStorage usage: ${(total / 1024).toFixed(2)} KB`);
   ```

4. **localStorage is disabled**: Some browser extensions or security settings disable localStorage entirely. Check the browser console for errors like `SecurityError: The operation is insecure` or `QuotaExceededError`.

5. **Data not shared across browsers/devices**: This is a known limitation. WriteSpace stores all data client-side. Data created in Chrome is not available in Firefox, and data on your laptop is not available on your phone.

---

### Build Failures

**Symptom:** `npm run build` fails or Vercel deployment fails during the build step.

**Solutions:**

1. **Check Node.js version**: WriteSpace requires Node.js 18 or later. Verify your version:
   ```bash
   node --version
   ```

2. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Check for JSX in `.js` files**: Vite only processes JSX syntax in files with a `.jsx` extension. If you see errors like `Unexpected token '<'`, ensure all files containing JSX use the `.jsx` extension.

4. **Check Vercel build logs**: In the Vercel dashboard, navigate to your project → Deployments → click the failed deployment → view the build logs for specific error messages.

5. **Verify `vite.config.js`** includes the React plugin:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
   })
   ```

6. **Verify Tailwind CSS configuration**: Ensure `tailwind.config.js` includes the correct content paths and that `postcss.config.js` is present with the Tailwind and Autoprefixer plugins.