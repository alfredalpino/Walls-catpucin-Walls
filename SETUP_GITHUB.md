# GitHub Setup Instructions

Your repository is ready! Follow these steps to push to GitHub:

## Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `Walls-catpucin-Walls` (or any name you prefer)
3. Make it **Public** (required for free GitHub Pages)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

## Step 2: Connect and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/ubaid/Walls-catpucin-Walls

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Walls-catpucin-Walls.git

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/Walls-catpucin-Walls.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in left sidebar)
3. Under **Source**, select:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**
5. Your site will be live at: `https://YOUR_USERNAME.github.io/Walls-catpucin-Walls/`

## Quick Setup Script

You can also run this script (after replacing YOUR_USERNAME):

```bash
cd /Users/ubaid/Walls-catpucin-Walls
git remote add origin https://github.com/YOUR_USERNAME/Walls-catpucin-Walls.git
git push -u origin main
```

## Verification

- ✅ Repository initialized
- ✅ All files committed (342 files including 334 wallpapers)
- ✅ Branch set to `main`
- ✅ `.nojekyll` file created for GitHub Pages
- ✅ `walls-catppuccin-mocha` detached from original remote

Your gallery website is ready to go live! 🎉
