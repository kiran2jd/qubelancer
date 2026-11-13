# QubeLancer — Vercel Demo & Namecheap DNS Deployment Guide

This guide details how to link the **`qubelancer`** GitHub repository to **Vercel** for client testing and demonstration without needing an active backend server, as well as how to configure the domain **`qubelancer.com`** registered at **Namecheap**.

---

## 1. Local Codebase & Git Status Summary

All changes have been staged, verified, and committed locally:
- **Git Commit:** `381eb06` (*"feat: rebrand to QubeLancer, add form validations, AI copilot, standalone demo fallbacks, and Vercel/Hetzner deployment configs"*)
- **Target Git Remote:** `https://github.com/kiran2jd/qubelancer.git`
- **Build Status:** `tsc -b && vite build` passed cleanly with **0 errors**.
- **Test Suite:** **10/10 Vitest tests passed** across all test suites (100% pass rate).
- **Working Tree:** Clean (all 56 modified and newly created files committed).

### Push to GitHub

In your terminal (VS Code terminal or PowerShell), run:

```bash
git push -u origin main
```

> If your GitHub account uses 2-Factor Authentication (2FA), Git Credential Manager will open a browser window to authorize your GitHub credentials with one click. Once authorized, all branches and tags will be pushed to `https://github.com/kiran2jd/qubelancer.git`.

---

## 2. Deploying Frontend to Vercel (Step-by-Step)

Vercel provides zero-configuration hosting with continuous deployment (every git push automatically updates the preview/production site).

### Step 1: Log in & Import Repository
1. Open [https://vercel.com/new](https://vercel.com/new) in your browser.
2. Sign in with your GitHub account (`kiran2jd`).
3. Under **Import Git Repository**, locate `qubelancer` (or search for `qubelancer`).
4. Click **Import**.

### Step 2: Configure Project Settings
In the **Configure Project** screen:

| Setting | Value / Action | Why |
| :--- | :--- | :--- |
| **Project Name** | `qubelancer` | Sets your Vercel project name |
| **Framework Preset** | `Vite` | Automatically detected |
| **Root Directory** | Click **Edit** → select `frontend` | Focuses the build on the React 19 app |
| **Build Command** | `npm run build` | Compiles TypeScript and creates optimized bundles |
| **Output Directory** | `dist` | Default Vite build output folder |
| **Install Command** | `npm install` | Installs frontend dependencies |

> Both `frontend/vercel.json` and a root `vercel.json` have been configured in the repository. Even if you deploy without changing the root directory, the monorepo configuration will automatically handle SPA rewrites and dependencies.

### Step 3: Deploy
1. Click the blue **Deploy** button.
2. Vercel will clone the repo, install packages, and execute `vite build` (~25–30 seconds).
3. Once finished, you will receive a live URL:
   `https://qubelancer.vercel.app` (or similar).

---

## 3. Connecting Namecheap Domain (`qubelancer.com`) to Vercel

To point your custom domain `qubelancer.com` from **Namecheap** to this Vercel deployment:

### Step 1: Add Domain in Vercel
1. In your Vercel project, go to **Settings** → **Domains**.
2. Type `qubelancer.com` and click **Add**.
3. Vercel will ask if you want to redirect `www.qubelancer.com` to `qubelancer.com` (recommended). Select **Yes**.
4. Vercel will display the required DNS records:
   - **Apex Domain (`@`):** `A` record pointing to `76.76.21.21`
   - **Subdomain (`www`):** `CNAME` record pointing to `cname.vercel-dns.com`

---

### Step 2: Configure Namecheap Advanced DNS
1. Log in to [Namecheap.com](https://www.namecheap.com).
2. Go to **Dashboard** → **Domain List**.
3. Find **`qubelancer.com`** and click the **Manage** button on the right.
4. Click on the **Advanced DNS** tab at the top.
5. In the **Host Records** table:
   - **Delete** any existing default parking records (such as `URL Redirect Record` or `Parking CNAME`).
   - Click **Add New Record** and create the following two records:

| Type | Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` | Automatic (or 1 min) |
| **CNAME Record** | `www` | `cname.vercel-dns.com.` | Automatic (or 1 min) |

6. Click the green checkmark (Save All Changes).

> DNS propagation typically takes **5 to 30 minutes**. Once propagated, Vercel will automatically provision a free, automated Let's Encrypt SSL certificate for both `qubelancer.com` and `www.qubelancer.com`.

---

## 4. Standalone Demo Features Verified & Available to Client

The frontend has been built with complete offline fallbacks so the client can explore the entire flow without a backend running:

### Key Client Showcase Highlights
1. **1-Click Instant Demo Login:**
   - On the `/login` page, two quick access buttons allow instant sign-in:
     - **👤 Client Demo** (`Priya Sharma` — Customer Dashboard)
     - **💼 Consultant Demo** (`Arjun Mehta` — Verified AI Consultant Dashboard)
2. **Autonomous AI Voice & Text Copilot:**
   - Floating AI button on the bottom right and dedicated intake on Post Project page.
   - Converts natural voice or typed descriptions into structured requirements, estimated budget ($ USD & ₹ INR), timeline, and required skills.
3. **Form Validations:**
   - Strict real-time inline validation with live error indicators on Registration, Login, Project Posting, Proposal Bidding, Credential Verification, and Reviews.
4. **Dual-Currency Engine:**
   - Marketplace listings displayed in **$ USD** with real-time conversion and simulated Razorpay settlement in **₹ INR** ($1 = ₹84.00).
5. **Contract & Milestone Execution:**
   - Full milestone pipeline: Escrow funding simulation, deliverable submission with audit notes, deliverable approvals, and star ratings/reviews.
