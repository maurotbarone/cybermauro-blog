# MERN Blog

Mongo:
cybermauro-blog
cSxPFflet0TNdP3W



A full-stack blog with responsive design:
- **Desktop**: 3×2 card grid with topic filtering
- **Mobile**: Full-screen cards, swipe left/right to change topics, scroll up/down for posts
- **Card flip animation** on click (mobile), slide to detail on desktop
- **Swipe left** on detail → Share (WhatsApp, Email, Twitter, Telegram, LinkedIn)
- **Swipe right** on detail → Back to posts

## Tech Stack
- **Backend**: Node.js + Express + MongoDB (Mongoose) + JWT auth
- **Frontend**: React 18 + CSS (no UI library, hand-crafted)
- **Deployment**: Render.com (backend as Web Service, frontend as Static Site)

---

## 🚀 Deploy to Render.com

### Step 1 – MongoDB Atlas (Database)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create free cluster
2. Create a database user + whitelist all IPs (`0.0.0.0/0`)
3. Copy the connection string (format: `mongodb+srv://user:pass@cluster.mongodb.net/mern-blog`)

### Step 2 – Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USER/mern-blog.git
git push -u origin main
```

### Step 3 – Deploy Backend on Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = any random secret (e.g. `openssl rand -hex 32`)
   - `CLIENT_URL` = your frontend URL (add after deploying frontend)
5. Deploy → copy the service URL (e.g. `https://mern-blog-backend.onrender.com`)

### Step 4 – Deploy Frontend on Render
1. New → Static Site
2. Connect same GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = your backend URL from Step 3
5. Add Rewrite Rule: `/*` → `/index.html` (for React Router)
6. Deploy

### Step 5 – Seed Initial Data
After deployment, visit these URLs in your browser:
```
POST https://your-backend.onrender.com/api/topics/seed
POST https://your-backend.onrender.com/api/posts/seed/demo
```
(Use Postman, curl, or any REST client)

```bash
curl -X POST https://your-backend.onrender.com/api/topics/seed
curl -X POST https://your-backend.onrender.com/api/posts/seed/demo
```

---

## 🛠️ Local Development

```bash
# Install all dependencies
npm run install-all

# Create backend .env
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI

# Create frontend .env
cp frontend/.env.example frontend/.env
# Edit frontend/.env: REACT_APP_API_URL=http://localhost:5000

# Start both servers (requires concurrently)
npm install
npm run dev
```

Backend runs on http://localhost:5000  
Frontend runs on http://localhost:3000

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login → JWT token |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/topics` | All topics |
| POST | `/api/topics/seed` | Seed default topics |
| GET | `/api/posts` | All published posts |
| GET | `/api/posts/topic/:slug` | Posts by topic |
| GET | `/api/posts/:slug` | Single post |
| POST | `/api/posts` | Create post (auth required) |
| PUT | `/api/posts/:id` | Update post (author/admin) |
| DELETE | `/api/posts/:id` | Delete post (author/admin) |
| POST | `/api/posts/seed/demo` | Seed demo posts |

---

## 📁 Project Structure

```
mern-blog/
├── backend/
│   ├── models/
│   │   ├── User.js        # User schema + password hashing
│   │   ├── Post.js        # Post schema + auto-slug
│   │   └── Topic.js       # Topic schema
│   ├── routes/
│   │   ├── auth.js        # Register, login, me
│   │   ├── posts.js       # CRUD + seed
│   │   └── topics.js      # Topic management
│   ├── middleware/
│   │   └── auth.js        # JWT middleware
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global auth state
│   │   ├── hooks/
│   │   │   └── useApi.js       # Data fetching hooks
│   │   ├── components/
│   │   │   ├── PostCard.js     # Card with flip animation
│   │   │   └── ShareModal.js   # Share sheet
│   │   ├── pages/
│   │   │   ├── DesktopView.js  # 3×2 grid layout
│   │   │   ├── MobileView.js   # Swipe topic/scroll posts
│   │   │   └── PostDetail.js   # Full article + swipe gestures
│   │   ├── App.js              # Responsive routing
│   │   └── index.css           # Global design system
│   └── package.json
├── render.yaml                  # Render.com IaC config
└── README.md
```

## 🎨 Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#0a0a0f` | Main background |
| `--bg2` | `#12121a` | Cards |
| `--bg3` | `#1a1a26` | Elevated surfaces |
| `--accent` | `#6c63ff` | Primary CTA color |
| `--font-display` | Playfair Display | Headings |
| `--font-body` | DM Sans | Body text |

Topics have their own `color` property from the database (set during seed).
