# CADPort Deployment Guide

This guide will help you deploy CADPort to GitHub and Vercel.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `CADPort`
   - **Description**: `Free DWG to DXF converter - 100% client-side, privacy-preserving`
   - **Visibility**: Public (recommended for open source) or Private
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd "C:\Users\nikis\Documents\DWG converter"
git remote add origin https://github.com/danieltorresan-boop/CADPort.git
git branch -M master
git push -u origin master
```

**Note**: Replace `danieltorresan-boop` with your GitHub username if different.

## Step 3: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New..." → "Project"
4. Import your `CADPort` repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `out` (auto-filled)
6. Click "Deploy"
7. Wait for deployment to complete (1-2 minutes)
8. Your site will be live at `https://cadport.vercel.app` (or similar)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Deploy
cd "C:\Users\nikis\Documents\DWG converter"
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - What's your project's name? cadport
# - In which directory is your code located? ./
# - Auto-detected framework: Next.js
# - Override settings? No
```

For production deployment:
```bash
vercel --prod
```

## Step 4: Custom Domain (Optional)

If you want a custom domain instead of `cadport.vercel.app`:

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `cadport.com`)
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails on Vercel

Check the build logs. Common issues:
- Node version mismatch (ensure Vercel uses Node 18+)
- Missing dependencies (run `npm install` locally first)

### Git Push Authentication

If you get authentication errors:
```bash
# Use SSH instead of HTTPS
git remote set-url origin git@github.com:danieltorresan-boop/CADPort.git
```

Or configure GitHub credentials:
```bash
# For HTTPS
git config --global credential.helper store
```

## Next Steps

After deployment:

1. **Test the live site** - Upload a DWG file and test conversion
2. **Update README** - Add your live URL
3. **Set up LibreDWG WASM** - Implement actual conversion (currently placeholder)
4. **Monitor usage** - Check Vercel analytics

## URLs

After deployment, you'll have:
- **Production**: `https://cadport.vercel.app` (or your custom domain)
- **GitHub**: `https://github.com/danieltorresan-boop/CADPort`
- **Vercel Dashboard**: `https://vercel.com/danieltorresan-boop/cadport`

---

Need help? Check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Docs](https://docs.github.com)
