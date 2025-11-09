# GitHub Pages Deployment Guide

This guide will help you deploy your Prompt Formatter app to GitHub Pages.

## Pre-Deployment Checklist

- [x] Updated package.json metadata
- [x] Added favicon
- [x] Configured build optimization
- [x] Set base path in vite.config.js
- [x] Created GitHub Actions workflow

## Quick Start

Your app is already configured for GitHub Pages! Just follow these steps:

### Step 1: Push to GitHub

If you haven't already pushed your code to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**

![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/images/help/pages/creating-a-custom-github-actions-workflow-to-publish-your-site.png)

### Step 3: Wait for Deployment

The GitHub Actions workflow will automatically:
- Install dependencies
- Build your app
- Deploy to GitHub Pages

You can watch the progress under the **Actions** tab in your repository.

### Step 4: Access Your Site

Once deployed, your app will be available at:

**https://YOUR_USERNAME.github.io/prompt-md-json-formatter/**

(Replace `YOUR_USERNAME` with your GitHub username)

---

## Testing Locally Before Deploy

To test the production build on your local machine:

```bash
npm install
npm run build
npm run preview
```

This will serve the production build at `http://localhost:4173`

---

## Troubleshooting

### Blank Page After Deployment

If you see a blank page:

1. Check browser console (F12) for errors
2. Verify the repository name matches `prompt-md-json-formatter` in `vite.config.js`
3. If your repo has a different name, update the `base` path in `vite.config.js`:

```javascript
base: '/YOUR-REPO-NAME/',
```

### Build Fails in GitHub Actions

1. Check the **Actions** tab for error details
2. Common issues:
   - Missing dependencies → The workflow runs `npm ci` automatically
   - Node version → The workflow uses Node 20
   - Syntax errors → Test locally with `npm run build`

### Changes Not Showing Up

- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Wait a few minutes for CDN to update

---

## Making Updates

After deploying, any time you want to update your site:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

The GitHub Actions workflow will automatically rebuild and redeploy!

---

## Custom Domain (Optional)

To use a custom domain like `www.yoursite.com`:

1. Create a file `public/CNAME` with your domain:
   ```
   www.yoursite.com
   ```

2. Update `vite.config.js` base path:
   ```javascript
   base: '/',  // Change to root for custom domain
   ```

3. Configure DNS records with your domain provider:
   - Add a `CNAME` record pointing to `YOUR_USERNAME.github.io`

4. In GitHub Settings → Pages, enter your custom domain

---

## What's Been Configured

Your app is ready to deploy with:
- ✓ Optimized production build
- ✓ Code splitting (vendor, markdown chunks)
- ✓ GitHub Actions workflow for automatic deployment
- ✓ Proper base path for GitHub Pages
- ✓ Favicon and meta tags
- ✓ Build artifacts in `dist/` folder

---

## GitHub Actions Workflow

The workflow at `.github/workflows/deploy.yml` automatically:
1. Triggers on push to `main` branch
2. Checks out your code
3. Sets up Node.js 20
4. Installs dependencies with `npm ci`
5. Builds with `npm run build`
6. Deploys to GitHub Pages

You don't need to do anything manually - just push!

