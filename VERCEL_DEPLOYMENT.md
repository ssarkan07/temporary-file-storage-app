# Hosting Guide: Deploying to Vercel

This guide provides step-by-step instructions to connect your GitHub repository and host this Vite React application on **Vercel** with client-side routing and Supabase integration.

---

## Prerequisites
1. A [GitHub](https://github.com/) account (the project has already been pushed to `https://github.com/ssarkan07/temporary-file-storage-app.git`).
2. A [Vercel](https://vercel.com/) account.
3. Your Supabase URL and Anon Key (from your `.env` file).

---

## Step 1: Import Project to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** → **Project**.
3. Under **Import Git Repository**, find your repository `temporary-file-storage-app` and click **Import**.
   - *Note: If the repo is not appearing, click "Configure GitHub App" to grant Vercel access to it.*

---

## Step 2: Configure Project Settings
Once imported, configure the following settings in the Vercel deployment wizard:

- **Project Name**: `temporary-file-storage-app` (or your preferred URL prefix)
- **Framework Preset**: Select **Vite** (Vercel should auto-detect this).
- **Root Directory**: `./` (or default).
- **Build and Output Settings**:
  - Build Command: `npm run build` (or `vite build`)
  - Output Directory: `dist`
  - Install Command: `npm install`

---

## Step 3: Add Environment Variables
Expand the **Environment Variables** section and add the two custom Supabase keys from your local `.env` file:

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | *Your project URL (starts with `https://`)* |
| `VITE_SUPABASE_ANON_KEY` | *Your anon/public key* |

Click **Add** for each variable. These will be securely injected into your Vite bundle during compile time.

---

## Step 4: Deploy!
Click the **Deploy** button. Vercel will:
1. Clone your repository.
2. Install project dependencies (`npm install`).
3. Run the compiler build step (`npm run build`).
4. Serve the generated `dist` assets globally on their edge CDN.

---

## Step 5: Verify Routing
We have already included a [vercel.json](vercel.json) file in the root of the project:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This configuration is processed by Vercel automatically to rewrite all subroutes (like `/access` and `/upload`) to `index.html`. This ensures that refreshing the browser or opening subpages directly does not result in a `404 Not Found` error.
