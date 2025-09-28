# Creative and Marketing Tech

A **prototype web application** built in the **AI Prototyping Lab (InnovAIte-Deakin)**.  
It demonstrates how artificial intelligence can support marketers by generating content such as **Instagram captions, blog posts, and ad copy**.

---

## 1. Project Purpose

The aim of this prototype is to explore how AI can streamline marketing workflows.  
It showcases how marketers can save time, improve creativity, and maintain brand consistency by leveraging AI tools.

---

## 2. Key Features

- **AI Content Generation**  
  Generate marketing copy tailored to brand tone, length, and campaign goals.  

- **Frontend Prototype**  
  Built with **Next.js**, **TypeScript**, and **Tailwind CSS** for a responsive, modern UI.  

- **Backend Integration**  
  Connects with AI APIs to deliver real-time content generation.  

- **Customizable Inputs**  
  Supports brand name, campaign objectives, keywords, and content types (Instagram captions, blogs, ads).  

---

## 3. Tech Stack

- **Frontend**: Next.js (React framework), TypeScript  
- **Styling**: Tailwind CSS  
- **Backend/Hosting**: Firebase setup included in repo  
- **Other**: Google AI API integration  

---

## 4. Getting Started

### 4.1 Prerequisites
- Node.js (v16 or later)  
- npm (or yarn) package manager  

### 4.2 Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/InnovAIte-Deakin/Creative_and_Marketing_Tech.git
cd Creative_and_Marketing_Tech
npm install
```

## 4.3 Enivornment Variables 
Update your .env.local file with your AI API key before running otherwise the project wont work
Create your own Google GEMINI API and update the .env.local file 

```bash
AI_API_KEY=your_api_key_here
```
## 4.4 Run Locally

bash
npm run dev

Visit http://localhost:3000 in your browser.

## 5. Documentation

SRS (Software Requirements Specification) - 

Design Flow Document - 

##6. Project Structure

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

