# GitHub Pages Setup Guide

This guide will help you deploy this wallpaper gallery to GitHub Pages.

## Steps to Deploy

1. **Fork the Repository**
   - Go to the original repository: https://github.com/orangci/walls-catppuccin-mocha
   - Click the "Fork" button to create your own copy

2. **Enable GitHub Pages**
   - Go to your forked repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" (or "master") branch
   - Select "/ (root)" folder
   - Click "Save"

3. **Wait for Deployment**
   - GitHub Pages will automatically deploy your site
   - It may take a few minutes for the first deployment
   - Your site will be available at: `https://YOUR-USERNAME.github.io/walls-catppuccin-mocha/`

4. **Update Remote (if needed)**
   ```bash
   cd walls-catppuccin-mocha
   git remote set-url origin https://github.com/YOUR-USERNAME/walls-catppuccin-mocha.git
   git add .
   git commit -m "Add beautiful gallery website"
   git push origin main
   ```

## Features

- ✅ Fast lazy loading with Intersection Observer
- ✅ Responsive grid layout
- ✅ Fullscreen image viewer
- ✅ Download functionality
- ✅ Search/filter wallpapers
- ✅ Keyboard navigation (Arrow keys, Escape)
- ✅ Beautiful Catppuccin Mocha theme
- ✅ Smooth animations and transitions

## Local Testing

To test locally before deploying:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000

# Then open http://localhost:8000 in your browser
```

## Notes

- The `images.json` file contains the list of all wallpapers
- If you add new wallpapers, regenerate `images.json`:
  ```bash
  find . -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" \) ! -name "README.md" -exec basename {} \; | sort | jq -R -s 'split("\n") | map(select(length > 0))' > images.json
  ```
