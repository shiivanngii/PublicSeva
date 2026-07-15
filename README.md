<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge" alt="MERN Stack"/>
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google" alt="Gemini AI"/>
</p>

<h1 align="center">🌿 PublicSeva</h1>

<p align="center">
  <strong>Report Waste. Track Action. Clean Communities.</strong>
</p>

<p align="center">
  A citizen-centric civic issue reporting platform that empowers communities to report waste hotspots and enables authorities to resolve them efficiently through AI-powered prioritization.
</p>

---

## 🎯 Problem Statement

Urban areas face significant challenges in waste management:
- **Citizens** lack an easy way to report waste accumulation with evidence
- **Authorities** struggle to prioritize issues without visibility into severity
- **Response time** is slow due to disconnected reporting systems
- **No transparency** for citizens to track resolution progress

## 💡 Our Solution

**PublicSeva** bridges the gap between citizens and municipal authorities by providing:

| For Citizens | For Authorities |
|--------------|-----------------|
| 📸 Report issues with photo evidence | 📊 Centralized monitoring dashboard |
| 📍 Automatic GPS location capture | 🤖 AI-powered severity classification |
| 🗳️ Vote to boost issue priority | 🗺️ Interactive map visualization |
| 💬 Community discussion on issues | ✅ Status management workflow |
| 📱 Real-time status tracking | 📈 Data-driven decision making |

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Citizen / Admin)
- Protected routes with middleware validation

### 📝 Issue Reporting
- Image upload with Cloudinary integration
- Automatic geolocation capture
- Detailed description with location address

### 🤖 AI-Powered Severity Scoring
Powered by **Google Gemini AI**, each issue receives an intelligent severity score:

```
┌─────────────────────────────────────────────────┐
│  SEVERITY SCORE (0-100)                         │
├─────────────────────────────────────────────────┤
│  🧠 AI Analysis Score     → max 40 points       │
│  👥 Community Votes       → max 30 points       │
│  ⏱️ Time Since Report     → max 30 points       │
└─────────────────────────────────────────────────┘
```

### 🗺️ Interactive Map Views
- **3D Map Visualization** with MapLibre GL
- Color-coded markers by status (Red → Yellow → Green)
- Shade intensity based on severity score
- Click-to-view issue details sidebar

### 👮 Admin Dashboard
- View all reported issues
- Update status: `UNSOLVED` → `IN_PROGRESS` → `RESOLVED`
- Edit issue details
- Delete invalid reports

### 🌙 Dark Mode
- System-wide dark mode toggle
- Persistent preference storage

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **React Router v6** | Client-side routing |
| **Tailwind CSS 3** | Utility-first styling |
| **MapLibre GL** | 3D map visualization |
| **Lucide React** | Icon library |
| **Axios** | HTTP client |
| **Swiper** | Image carousels |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Cloudinary** | Image storage CDN |
| **Multer** | File upload handling |
| **Google Gemini API** | AI severity analysis |

---

## 📁 Project Structure

```
PublicSeva/
├── 📂 backend/
│   ├── 📂 config/
│   │   └── db.js                 # MongoDB connection
│   ├── 📂 controllers/
│   │   ├── adminController.js    # Admin operations
│   │   └── issueController.js    # Issue CRUD operations
│   ├── 📂 llm/
│   │   └── geminiClient.js       # Gemini AI integration
│   ├── 📂 middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── roleMiddleware.js     # Role-based access
│   │   └── upload.js             # Cloudinary upload
│   ├── 📂 models/
│   │   ├── Issue.js              # Issue schema
│   │   └── User.js               # User schema
│   ├── 📂 routes/
│   │   ├── adminRoutes.js        # Admin endpoints
│   │   ├── issueRoutes.js        # Issue endpoints
│   │   └── userRoutes.js         # Auth endpoints
│   ├── 📂 services/
│   │   └── aiSeverityService.js  # AI scoring service
│   ├── 📂 utils/
│   │   ├── auth.js               # Auth utilities
│   │   └── severityEngine.js     # Score calculation
│   ├── server.js                 # Entry point
│   └── package.json
│
├── 📂 frontend/
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── CitizenNavbar.jsx
│   │   │   ├── CitizenLeftPanel.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ReportButton.jsx
│   │   │   └── 📂 map/           # Map components
│   │   ├── 📂 pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── 📂 citizen/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── CheckStatus.jsx
│   │   │   │   ├── MapView.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── ReportIssue.jsx
│   │   │   └── 📂 admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminIssueCard.jsx
│   │   │       └── AdminEditModal.jsx
│   │   ├── 📂 services/
│   │   │   ├── authApi.js
│   │   │   ├── issueApi.js
│   │   │   ├── adminService.jsx
│   │   │   └── userApi.js
│   │   ├── 📂 utils/
│   │   │   └── auth.js
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account ([Sign up](https://cloudinary.com/))
- **Google Gemini API** key ([Get API key](https://ai.google.dev/))

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/PublicSeva.git
cd PublicSeva
```

#### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/publicseva
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/publicseva

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

#### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm start
```

#### 4️⃣ Access the Application

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Frontend application |
| `http://localhost:5000/api` | Backend API |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/profile` | Get current user |

### Issues (Citizen)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | Get all issues |
| GET | `/api/issues/:id` | Get single issue |
| GET | `/api/issues/my` | Get user's issues |
| POST | `/api/issues` | Create new issue |
| POST | `/api/issues/:id/like` | Toggle vote |
| POST | `/api/issues/:id/comment` | Add comment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/issues` | Get all issues (admin) |
| PATCH | `/api/admin/issues/:id/status` | Update issue status |
| PATCH | `/api/admin/issues/:id` | Edit issue details |
| DELETE | `/api/admin/issues/:id` | Delete issue |

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 1️⃣ Fork the Repository
Click the "Fork" button at the top right of this page.

### 2️⃣ Clone Your Fork
```bash
git clone https://github.com/your-username/PublicSeva.git
cd PublicSeva
```

### 3️⃣ Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 4️⃣ Make Your Changes
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 5️⃣ Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

**Commit Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests

### 6️⃣ Push and Create PR
```bash
git push origin feature/your-feature-name
```

Open a Pull Request on GitHub with:
- Clear title describing the change
- Description of what was changed and why
- Screenshots (if UI changes)

---

## 📋 Roadmap

- [ ] Push notifications for status updates
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard for authorities
- [ ] Multi-language support
- [ ] Offline-first PWA support

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Made with 💚 by the PublicSeva team.

---

<p align="center">
  <strong>🌍 Making communities cleaner, one report at a time.</strong>
</p>
