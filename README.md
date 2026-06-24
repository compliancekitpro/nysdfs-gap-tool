# NYSDFS 23 NYCRR 500 Compliance Readiness Tool

Free compliance checker included with the NYSDFS Compliance Kit.

**Tool features:**
- 31 questions across 6 categories: Governance, Risk/Asset Inventory, Access/MFA, TPSP/Vulnerability, Incident Response, Retention/Class A
- Live compliance score with examination-risk levels
- Priority Action Plan mapping each gap to the specific template (01-14) that fixes it
- Built-in Class A Company Determination sub-tool (3-question test)
- Special callout for the dual-signature Annual Certification — personal liability for CEO/CISO

---

## Deploy to Vercel (5 minutes, free)

### Option A: GitHub + Vercel (recommended)

1. Create a free account at **github.com**
2. Create a new repo called `nysdfs-readiness-tool`
3. Upload all files from this folder — including the `src` folder with all 3 files inside
4. Go to **vercel.com** → sign up free with GitHub
5. Click **Add New Project** → import `nysdfs-readiness-tool`
6. Click **Deploy** — Vite/React auto-detected
7. Live at: `https://nysdfs-readiness-tool.vercel.app`

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel
```

---

## After Deploying

1. Copy your live Vercel URL
2. Open `src/App.jsx`
3. Replace `YOUR_SHOP_NAME` in both Etsy URLs with your actual shop name
4. Commit — Vercel auto-redeploys in ~30 seconds

## Update Your Etsy ZIP

Add the live URL to README.txt inside NYSDFS_Compliance_Kit_2026.zip:

```
FREE COMPLIANCE READINESS TOOL:
https://nysdfs-readiness-tool.vercel.app
```

---

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
