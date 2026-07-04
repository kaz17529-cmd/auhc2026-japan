---
name: deploy_static_github_pages
description: Guides the deployment of static web applications to GitHub Pages, especially handling environments without local Git installations, CORS troubleshooting, and desktop file staging for easy drag-and-drop.
---

# Deploying Static Web Apps to GitHub Pages

This skill provides guidelines on how to deploy simple, static HTML/CSS/JS applications to GitHub Pages, specifically tailored for users who might not have local Git installed or who prefer a manual browser-based upload workflow.

## Key Concepts

### 1. CORS Limitation on Local Files
- If an application uses `fetch()` to load local JSON files (e.g., `questions_db.json`), opening `index.html` locally via `file://` protocol will fail due to CORS security policies.
- **Solution**: 
  1. Host the site on a static server (like GitHub Pages or Netlify).
  2. Alternatively, convert JSON to a JS variable (`const DATA = [...]`) to allow local execution without a server.

### 2. Manual Upload Staging (Desktop Staging)
- When a user does not have `git` command installed, or when they want a friction-free manual upload to GitHub's web interface:
  - Create a clean folder on the user's Desktop (e.g., `ADEL公開用ファイル`).
  - Copy **only the necessary production files** (e.g., `index.html`, `style.css`, `app.js`, `questions_db.json`) into this folder.
  - Avoid copying raw source data (like screenshots or OCR intermediate text files).
  - Programmatically open the folder in Windows Explorer so the user can easily drag and drop the files into the GitHub Web UI.

### 3. GitHub Pages Settings Navigation
- Instruct the user to navigate to:
  1. `Settings` (the tab with the gear icon on the repository page).
  2. `Pages` (on the left sidebar menu).
  3. Under `Build and deployment`, set `Branch` to `main` (or `master`) and save.

## Troubleshooting & Platform-Specific Guidelines

### 1. Utilizing GitHub Desktop's Internal Git
- On Windows, if a global `git` installation is missing, check for GitHub Desktop's internal path:
  - `C:\Users\<username>\AppData\Local\GitHubDesktop\app-*\resources\app\git\cmd\git.exe`
- **CAUTION**: Running `git push` asynchronously via command line from background agents can hang indefinitely if GitHub triggers an interactive Credential Manager prompt.
  - **Safe Practice**: Perform local staging and commits via script/command line, but instruct the user to press **"Push origin"** in the GitHub Desktop GUI, or fetch/pull first.

### 2. GitHub Pages Deployment Failures
- Sometimes, the Jekyll `build` job succeeds but the `deploy` job fails with a `failure` state (due to temporary GitHub Page/CDN runner timeouts).
- **Verification**:
  - Query the deployments API: `GET https://api.github.com/repos/{owner}/{repo}/deployments`
  - Fetch statuses for the latest deployment ID: `GET https://api.github.com/repos/{owner}/{repo}/deployments/{id}/statuses`
  - If the status is `failure`, the live site will not show updates despite the source code being updated on GitHub.
- **Fix**:
  - Insert a dummy change (e.g., `<!-- build trigger -->` at the end of `index.html`).
  - Commit and push to force GitHub Actions to spin up a new run.

### 3. CDN & Browser Cache Bypassing
- Even after successful deployment, CDN edge caches or browser cache can serve old HTML.
- **Solution**:
  - Test with a unique query parameter on the public URL: `https://<owner>.github.io/<repo>/?t=<timestamp>` or `?v=<version>`.
  - Ask the user to verify in an Incognito/Private window or on a different device (like mobile data) if standard hard refreshes (Ctrl+F5) fail.
