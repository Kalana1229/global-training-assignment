# GlobalTNA – Mini Service Request Board

A full-stack web application where homeowners can post service requests and tradespeople can browse, view, update, and manage them.

Built for the GlobalTNA Full-Stack Developer Intern Technical Assessment.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (App Router) + Tailwind CSS |
| Backend    | Node.js + Express                   |
| Database   | MongoDB (Atlas or local)            |
| ODM        | Mongoose                            |
| Testing    | Jest + Supertest                    |

---

## Project Structure

```
globaltna/
├── backend/                  # Express REST API
│   ├── models/
│   │   └── JobRequest.js     # Mongoose model
│   ├── routes/
│   │   └── jobs.js           # All /api/jobs endpoints
│   ├── middleware/
│   │   └── errorHandler.js   # Global error handler
│   ├── __tests__/
│   │   └── jobs.test.js      # Jest + Supertest API tests
│   ├── seed.js               # Seed script (10 sample jobs)
│   ├── server.js             # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # Next.js App Router
    └── src/
        ├── app/
        │   ├── page.js               # Home – job list + filters + search
        │   ├── layout.js             # Root layout with nav
        │   ├── globals.css
        │   └── jobs/
        │       ├── new/page.js       # New job form
        │       └── [id]/page.js      # Job detail + status update + delete
        ├── components/
        │   ├── JobCard.js
        │   ├── StatusBadge.js
        │   └── CategoryBadge.js
        └── lib/
            └── api.js                # All fetch calls to Express API
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v8 or higher
- **MongoDB** — either:
  - [MongoDB Atlas](https://www.mongodb.com/atlas) free tier (recommended), or
  - MongoDB installed locally

---

## Environment Variables

### Backend — `backend/.env`

Copy `.env.example` and fill in your values:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=5000

# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/globaltna

# MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/globaltna?retryWrites=true&w=majority
```

### Frontend — `frontend/.env.local`

```bash
cp frontend/.env.local.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Setup & Run Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/globaltna-service-board.git
cd globaltna-service-board
```

---

### 2. Start the Backend

```bash
cd backend
npm install
```

Create your `.env` file (see above), then:

```bash
npm run dev        # Development (auto-reload with nodemon)
# or
npm start          # Production
```

The API will be running at **http://localhost:5000**

To verify: visit `http://localhost:5000` — you should see:
```json
{ "message": "GlobalTNA API is running", "status": "ok" }
```

---

### 3. (Optional) Seed the Database

Inserts 10 sample job requests:

```bash
cd backend
npm run seed
```

---

### 4. Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at **http://localhost:3000**

---

## API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint          | Description                                      |
|--------|-------------------|--------------------------------------------------|
| GET    | `/api/jobs`       | List all jobs (supports `?category=`, `?status=`, `?search=`) |
| GET    | `/api/jobs/:id`   | Get a single job                                 |
| POST   | `/api/jobs`       | Create a new job                                 |
| PATCH  | `/api/jobs/:id`   | Update job status only                           |
| DELETE | `/api/jobs/:id`   | Delete a job                                     |

### Example POST body

```json
{
  "title": "Leaking kitchen tap",
  "description": "The tap has been dripping for two weeks",
  "category": "Plumbing",
  "location": "Glasgow",
  "contactName": "Jane Smith",
  "contactEmail": "jane@example.com"
}
```

### Example PATCH body

```json
{ "status": "In Progress" }
```

Valid statuses: `"Open"` | `"In Progress"` | `"Closed"`

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover:
- `GET /api/jobs` — list all, filter by category, filter by status, keyword search
- `POST /api/jobs` — valid creation, missing title, missing description, invalid email
- `PATCH /api/jobs/:id` — status update, invalid status, 404
- `DELETE /api/jobs/:id` — successful delete, 404

---

## Bonus Features Implemented

- ✅ **Keyword search** across `title` and `description` via `?search=` query param
- ✅ **Seed script** with 10 realistic sample jobs (`npm run seed`)
- ✅ **Unit tests** on all API endpoints (Jest + Supertest)

---

## Deployment

### Frontend → Vercel

1. Push repo to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

### Backend → Render

1. Create a new **Web Service** at [render.com](https://render.com)
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `MONGODB_URI` and `PORT`

---

## Notes

- The frontend communicates **exclusively** with the Express API — no direct MongoDB calls or Next.js API routes are used for data
- All API responses follow a consistent shape: `{ success: true|false, data: ..., error: "..." }`
- Proper HTTP status codes are used throughout (200, 201, 400, 404, 500)
- A global error handler in Express catches all unhandled errors
