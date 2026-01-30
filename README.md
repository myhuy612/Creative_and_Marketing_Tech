# InnovAIte – Marketing Website (Marketing Stream)

This repository contains the **Marketing Website** for the InnovAIte project (Marketing Stream).  
The app provides AI-powered features such as **text generation**, **image generation**, **target audience**, **persona outputs**, and **insights / engagement prediction (mock or WIP depending on workflow availability)**.

---

## Tech Stack
- **Next.js + React**
- **TypeScript**
- **Node.js**
- **n8n** (workflow automation / orchestration)
- AI services (e.g., **Gemini / Imagen** depending on configured provider)

---

## Prerequisites
Make sure you have:
- **Node.js** (LTS recommended)
- **npm** (or pnpm/yarn if your team uses it)
- Access to required API keys (AI provider + n8n endpoint)

---

## Getting Started (Local Setup)

### 1 Clone the repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_PROJECT_FOLDER>

### 2 attach the environment file
touch .env.local

### 3 attach the keys folder with vertex-sa.json in it
create a private key and past it in

# App
NEXT_PUBLIC_APP_NAME="InnovAIte Marketing"

# n8n workflow base URL (example)
N8N_BASE_URL="https://<your-n8n-domain>"
N8N_WEBHOOK_URL="https://<your-n8n-domain>/webhook/<id>"

# AI Provider Keys (examples - use what your project actually uses)
GOOGLE_API_KEY="YOUR_KEY"
IMAGEN_API_KEY="YOUR_KEY"

# Optional: database (if used)
SUPABASE_URL=""
SUPABASE_ANON_KEY=""


## 6. Project Structure



```bash
Creative_and_Marketing_Tech/
├── .git/                     → Git version control  
├── .gitignore                → Ignored files config  
├── .env.local                → Environment variables (API keys etc.)  
├── README.md                 → Project overview and setup  
├── apphosting.yaml           → Deployment config (Google App Hosting)  
├── components.json           → UI/Components metadata  
├── docs/                     → Documentation folder (SRS, Design Flow, etc.)  
├── firebase/                 → Firebase backend setup & config  
│   ├── src/                  → (Firebase-specific code if any)  
│   └── ...  
├── next-env.d.ts             → Next.js type definitions  
├── next.config.ts            → Next.js configuration  
├── node_modules/             → Installed dependencies (auto-generated)  
├── package-lock.json         → Dependency lock file  
├── package.json              → Dependencies & scripts  
├── postcss.config.mjs        → PostCSS config (used by Tailwind)  
├── public/                   → Public assets (favicons, images, etc.)  
├── src/                      → Frontend application code  
│   ├── ai/                   → AI flows & schemas  
│   ├── app/                  → Next.js App Router pages & APIs  
│   │   ├── api/              → API routes (e.g. `/api/generate`)  
│   │   └── ...  
│   ├── components/           → Reusable UI components & forms  
│   ├── hooks/                → Custom React hooks  
│   ├── lib/                  → Utility functions  
│   └── styles/               → Global styles (if any beyond Tailwind)  
├── tailwind.config.ts        → Tailwind CSS configuration  
└── tsconfig.json             → TypeScript configuration  


### How to get the API key - Google AI studio
### How to get the private key - Google studio -> Vertex AI -> generate private key