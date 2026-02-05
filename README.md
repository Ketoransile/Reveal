# Reveal - AI Competitor Analysis Platform

A powerful SaaS platform that helps businesses analyze their competitors using AI agents.

## Features

- **AI-Powered Analysis**: Deep dive into competitor strategies, strengths, and weaknesses.
- **Interactive Chat**: Chat with your analysis data to ask specific questions.
- **Subscription Support**: Free, Pro, and Agency tiers with credit-based usage.
- **Glassmorphic UI**: Premium design with Framer Motion animations.
- **Supabase Backend**: Secure authentication and scalable database.

## Prerequisites

- Node.js 18+
- Supabase Project (for Auth & Database)

## Environment Variables

Create a file named `.env.local` in the root directory and add the following keys from your Supabase project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Setup

Run the SQL scripts located in the root directory in your Supabase SQL Editor:
1. `supabase-schema.sql` (Base schema)
2. `supabase-add-name-field.sql` (Migration)
3. `supabase-add-subscription-plan.sql` (Migration)

## Deployment

### Vercel

1. Push your code to GitHub.
2. Import the project in Vercel.
3. **IMPORTANT**: In the Vercel Project Settings > Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Supabase
- **AI**: OpenAI (Integration pending in API folder)
- **Deployment**: Vercel

