# 🚀 Domain Deployment Guide

## Current Setup
- **Subdirectory**: `https://averagegio.github.io/goldeneye` (automatic)
- **Custom Domain**: `https://goldeneyeco.com` (manual)

## 🔄 How to Switch Deployments

### 📁 Current: Subdirectory Deployment
Your site automatically deploys to `https://averagegio.github.io/goldeneye` on every push.

### 🌐 Switch to Custom Domain (goldeneyeco.com)

1. **Update DNS in GoDaddy:**
   ```
   Type: A | Name: @ | Value: 185.199.108.153
   Type: A | Name: @ | Value: 185.199.109.153
   Type: A | Name: @ | Value: 185.199.110.153
   Type: A | Name: @ | Value: 185.199.111.153
   Type: CNAME | Name: www | Value: averagegio.github.io
   ```

2. **Run Custom Domain Workflow:**
   - Go to GitHub repo → Actions
   - Click "Deploy to Custom Domain"
   - Click "Run workflow"
   - Enter domain: `goldeneyeco.com`
   - Click "Run workflow"

3. **Configure GitHub Pages:**
   - Go to Settings → Pages
   - Custom domain will be auto-configured
   - Check "Enforce HTTPS"

### 📁 Switch Back to Subdirectory

1. **Remove Custom Domain:**
   - Go to Settings → Pages
   - Remove custom domain field
   - Save

2. **Push Any Change:**
   - The subdirectory workflow will run automatically
   - Site will be available at `https://averagegio.github.io/goldeneye`

## ✅ Benefits of This Setup

- **Maintains appearance**: Same styling and functionality in both modes
- **No code changes**: Just switch workflows
- **Easy switching**: Can go back and forth anytime
- **Safe**: Subdirectory always works as fallback 