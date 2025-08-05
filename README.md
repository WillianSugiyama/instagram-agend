# Instagram Agent

AI-powered Instagram content generator with A/B testing.

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- OpenAI API Key
- Google AI API Key

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd instagram-agent
```

2. Copy and configure environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` and add your API keys:
```env
OPENAI_KEY=your-openai-api-key-here
GOOGLE_AI_API_KEY=your-google-ai-api-key-here
```

**Important**: You must provide valid API keys for the application to work!

4. Start the application:
```bash
docker-compose up -d
```

5. Open the frontend:
```bash
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:5173`

## Manual Setup (Without Docker)

### Backend

```bash
cd backend
npm install

# Create .env file with:
DATABASE_URL="postgresql://postgres:password@localhost:5432/instagram_agent?schema=public"
JWT_SECRET="your-jwt-secret"
OPENAI_KEY="your-openai-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Run migrations
npx prisma migrate dev

# Start server
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Default Ports

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Features

- Generate Instagram posts and stories using AI
- A/B testing for content variations
- Content history and analytics
- Multi-language support