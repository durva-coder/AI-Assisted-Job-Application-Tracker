# AI-Assisted Job Application Tracker

A full-stack web application for tracking job applications using a Kanban board, with AI-powered job description parsing and resume suggestion generation.

## 🚀 Quick Deploy

Want to deploy quickly? Check our deployment guides:

- **Docker**: `docker-compose up -d` (one command deployment)
- **Cloud Platforms**: Render, Railway, Vercel, Netlify
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Auth**: JWT with bcrypt
- **AI**: OpenAI API (GPT-4o-mini)
- **State**: TanStack Query (React Query)
- **Drag & Drop**: dnd-kit

## Features

### Core
- **Authentication**: Register/login with email & password, JWT-protected routes, persistent sessions
- **Kanban Board**: 5 columns (Applied, Phone Screen, Interview, Offer, Rejected) with draggable cards
- **AI Job Description Parser**: Paste a JD and AI extracts company, role, skills, seniority, location
- **AI Resume Suggestions**: Generates 3-5 tailored bullet points for each application
- **Application Management**: Create, edit, delete applications with rich fields

### Stretch Goals (All Implemented)
- **Dashboard**: Stats overview with total applications, interview rate, offers, and status breakdown
- **Search & Filter**: Search by company/role, filter by status on the Kanban board
- **Export to CSV**: Download all applications as a CSV file
- **Dark Mode**: Toggle between light and dark themes, persists preference

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- OpenAI API key

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing (use a strong random string) |
| `JWT_EXPIRES_IN` | Token expiration time |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NODE_ENV` | Environment (development/production) |

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
# Edit .env with your actual values
npm install
npm run dev
```

The backend will start on `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` and proxy API requests to the backend.

### 4. Open the app

Navigate to `http://localhost:5173` in your browser.

## 🐳 Docker Deployment

The easiest way to deploy the entire stack:

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access the app at `http://localhost` (frontend) and `http://localhost:5000` (backend API).

## ☁️ Cloud Deployment

For production deployment to cloud platforms, see our comprehensive [DEPLOYMENT.md](./DEPLOYMENT.md) guide covering:

- **Render**: Free tier available, easy setup
- **Railway**: One-click deployment from GitHub
- **Vercel**: Deploy frontend with global CDN
- **Netlify**: Alternative frontend hosting
- **MongoDB Atlas**: Free cloud database (512MB)

### Quick Production Checklist

1. ✅ Set up MongoDB Atlas (free tier)
2. ✅ Deploy backend to Render/Railway
3. ✅ Deploy frontend to Vercel/Netlify
4. ✅ Configure CORS with your frontend URL
5. ✅ Use strong JWT_SECRET (32+ characters)
6. ✅ Add OpenAI API key (optional)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose schemas (User, Application)
│   │   ├── routes/          # Express route handlers (auth, applications, ai)
│   │   ├── services/        # Business logic (OpenAI service layer)
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/           # Database connection
│   │   └── server.ts        # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API client and endpoints
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth context/provider
│   │   ├── pages/           # Page components (Login, Register, Kanban, Dashboard)
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # React app entry with routing
│   └── package.json
└── README.md
```

## Architecture Decisions

### OpenAI Service Layer
The OpenAI logic is isolated in `backend/src/services/openai.ts` rather than being inside route handlers. This follows separation of concerns and makes the AI logic testable independently.

### Structured JSON Output
Both AI endpoints use `response_format: { type: 'json_object' }` to ensure consistent, parseable responses. The service layer validates the structure before returning.

### JWT Persistence
Tokens are stored in localStorage and attached via Axios interceptors. The auth context persists user state across refreshes by reading from localStorage on mount.

### Drag & Drop
Uses `@dnd-kit` for the Kanban board. Cards are sortable within columns, and dropping on a column triggers a status update via React Query mutation.

### Error Handling
- Frontend: Loading spinners, error banners, empty states for all data views
- Backend: Try/catch in all route handlers, validation with express-validator, proper HTTP status codes
- Graceful degradation: AI failures don't crash the app; they show error messages

### Dark Mode
Implemented via Tailwind's `dark:` variant with a class-based toggle on `<html>`. Preference is stored in localStorage and initialized before React hydrates to prevent flash.

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Applications
- `GET /api/applications` - List all applications
- `GET /api/applications/:id` - Get single application
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `PATCH /api/applications/:id/status` - Update status only
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/stats` - Get dashboard stats

### AI
- `POST /api/ai/parse-jd` - Parse job description
- `POST /api/ai/resume-suggestions` - Generate resume bullets

## License

MIT
