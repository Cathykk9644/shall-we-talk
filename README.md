# ✨ Shall WeTalk ✨

Shall WeTalk is a modern language exchange platform where users can teach others their native language, while also learning new languages from native speakers around the world. Connect, chat, and practice in real time — everyone is both a teacher and a learner!

![alt text](client/src/assets/image-1.png)

## 🚀 Features

- 📝 User Signup, Login, and Onboarding
- 👤 User Profile Page Management (view, edit, update your details)
- 🤝 Send and Accept Friend Requests
- 🔔 Notification Alerts for New Friend Requests
- 🔋 Pagination for Recommended Language Partners
- 🌐 Real-time Messaging: Reply, Delete, Start Thread, Add Emoji, Send Image, Typing Indicators & Reactions
- 📹 1-on-1 and Group Video Calls: Share Screen, Add Emoji Reaction, Record Meeting (Stream integration)
- 🔐 JWT Authentication & Protected Routes
- 🌍 Language Exchange Platform with Modern UI
- ⚡ Tech Stack: React + Express + MongoDB + TailwindCSS + DaisyUI + TanStack Query + Cloudinary + Multer + Axios
- 🧠 Global State Management with React Query
- 🚨 Robust Error Handling (Frontend & Backend)
- 🎯 Scalable, Modular Project Structure
- ⏳ Server-side Search for Users & Friends

## 🗂️ Project Structure

```

shall-we-talk/
├── client/ # Frontend (React + Vite + Tailwind CSS + DaisyUI + React Query + Axios)
│ ├── src/
│ │ ├── assets/ # Images and static assets
│ │ ├── components/ # Reusable React components
│ │ ├── config/ # API and utility functions
│ │ ├── constants/ # App-wide constants
│ │ ├── hooks/ # Custom React hooks
│ │ ├── pages/ # Page-level React components
│ │ └── ...
│ ├── index.html # Main HTML file
│ ├── package.json # Frontend dependencies
│ └── ...
├── server/ # Backend (Node.js + Express + MongoDB, MVC pattern)
│ ├── src/
│ │ ├── config/ # DB, cloudinary, multer, etc.
│ │ ├── controllers/ # Controllers (business logic, part of MVC)
│ │ ├── middleware/ # Express middleware (auth, error handling, etc.)
│ │ ├── models/ # Mongoose models (data layer, part of MVC)
│ │ ├── routes/ # Route definitions (Express routers, part of MVC)
│ │ └── server.js # Entry point
│ ├── package.json # Backend dependencies
│ └── ...
└── README.md # Project documentation

```

---

## 🧪 .env Setup

### Backend (`server/.env`)

```

PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development

```

### Frontend (`client/.env`)

```

VITE_STREAM_API_KEY=your_stream_api_key

```

---

## 🔧 Run the Backend

```bash
cd server
npm install
npm run dev
```

---

## 💻 Run the Frontend

```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or as specified by Vite).

---

## 📄 License

MIT
