# How to Deploy Math Training Hub

This guide shows you how to put your Math Training Hub online so anyone can use it.

## Quick Start (Easiest Method)

### 1. Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button → **"New repository"**
3. **Repository name**: `mathhub` (or any name you like)
4. Make sure it's **"Public"** (required for free hosting)
5. **Don't** check "Add a README file" (we already have files)
6. Click **"Create repository"**

### 2. Upload Your Files
1. In your new repository, click **"uploading an existing file"**
2. **Drag and drop** these 5 files from your computer:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `DEPLOYMENT.md`
3. **Commit message**: "Add Math Training Hub"
4. Click **"Commit changes"**

### 3. Enable GitHub Pages
1. Go to **"Settings"** tab in your repository
2. Scroll down to **"Pages"** in the left menu
3. **Source**: "Deploy from a branch"
4. **Branch**: "main"
5. **Folder**: "/ (root)"
6. Click **"Save"**

### 4. Your Website is Live!
- **URL**: `https://YOUR_USERNAME.github.io/mathhub`
- **Wait**: It may take 5-10 minutes to go live
- **Check**: The URL will be shown in your Pages settings

## Alternative: Use Git Commands

If you prefer using the terminal:

```bash
# 1. Navigate to your project folder
cd /path/to/your/math-training-hub

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Save changes
git commit -m "Math Training Hub"

# 5. Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/mathhub.git

# 6. Upload to GitHub
git push -u origin main
```

Then follow **Step 3** above to enable GitHub Pages.

## What You Get

✅ **Free Website**: No hosting costs  
✅ **Custom URL**: Your own web address  
✅ **Automatic Updates**: Changes go live automatically  
✅ **Secure**: HTTPS encryption included  
✅ **Mobile Friendly**: Works on all devices  

## Troubleshooting

### Common Problems:

**"Site not loading"**
- Wait 5-10 minutes for GitHub to process
- Check that all files uploaded correctly

**"404 Error"**
- Make sure `index.html` is in the root folder (not in a subfolder)

**"Styling broken"**
- Verify all files (`index.html`, `styles.css`, `script.js`) are uploaded
- Check that file names match exactly

**"Repository not found"**
- Make sure your repository is set to "Public"
- Free GitHub Pages only works with public repositories

### Updating Your Site:
1. Make changes to your files
2. Upload the updated files to GitHub
3. Your site updates automatically (takes a few minutes)

## Next Steps

1. **Test your site**: Visit your URL and try all the math modules
2. **Share it**: Send the link to students, teachers, or friends
3. **Customize**: Modify colors, add new math topics, or change the design
4. **Bookmark**: Save your site for easy access

## Need Help?

- **GitHub Pages Documentation**: [pages.github.com](https://pages.github.com)
- **GitHub Support**: Check GitHub's help center
- **Issues**: Open an issue in this repository if you find bugs

---

**Your Math Training Hub is now live on the internet!** 🌐
