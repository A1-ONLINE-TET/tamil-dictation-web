# Cloudflare Pages Deployment Guide

## Method 1: Drag & Drop (Fastest — 2 minutes!)

1. Go to https://pages.cloudflare.com
2. Login / Sign up (free)
3. Click "Create a project" → "Direct Upload"
4. Project name: `tamil-dictation`
5. **Drag this entire folder** into the upload box
6. Click "Deploy site"
7. ✅ Your app is live at: `tamil-dictation.pages.dev`

## Method 2: GitHub (Auto-deploy on updates)

1. Create GitHub account (if not already)
2. Create new repo: `tamil-dictation-web`
3. Upload all files in this folder
4. Go to https://pages.cloudflare.com
5. "Create project" → "Connect to Git" → Select your repo
6. Build settings:
   - Build command: (empty)
   - Build output directory: `/`
7. Click "Save and Deploy"
8. ✅ Auto-deploys on every git push!

## Custom Domain (Optional)

After deployment:
1. Cloudflare Pages → Your project → "Custom domains"
2. Add: `dictation.tamilnanban.com` (or any domain)
3. DNS CNAME: `dictation → tamil-dictation.pages.dev`

## App Features

✅ Works on ALL mobile browsers (Chrome, Safari, Firefox)
✅ Tamil TTS (Text-to-Speech) — needs internet for voice
✅ Grade 1-8 word lists built-in
✅ Score tracking saved on device
✅ PWA — Add to Home Screen → works like a native app!
✅ Offline support (after first visit)

## Add to Home Screen (Mobile)

**Android Chrome:**
1. Open the website
2. Menu (⋮) → "Add to Home screen"
3. Tap "Add"
4. App icon appears on home screen!

**iPhone Safari:**
1. Open the website
2. Share (□↑) → "Add to Home Screen"
3. Tap "Add"
4. App icon appears on home screen!
