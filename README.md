# Shall WeTalk

A modern language exchange platform for finding and connecting with language partners around the world.

---

## Project Structure

```
shall-we-talk/
├── client/         # Frontend (React + Vite + Tailwind CSS + DaisyUI)
│   ├── src/
│   │   ├── assets/         # Images and static assets
│   │   ├── components/    # Reusable React components
│   │   ├── config/        # API and utility functions
│   │   ├── constants/     # App-wide constants
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page-level React components
│   │   └── ...
│   ├── index.html         # Main HTML file
│   ├── package.json       # Frontend dependencies
│   └── ...
├── server/         # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/        # DB, cloudinary, multer, etc.
│   │   ├── controllers/   # Express route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express route definitions
│   │   └── server.js      # Entry point
│   ├── package.json       # Backend dependencies
│   └── ...
└── README.md       # Project documentation
```

---

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- DaisyUI
- React Router
- React Query (TanStack Query)

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- Cloudinary (for image uploads)
- Multer (for file uploads)
- JWT Authentication

---

## Features

- User authentication (sign up, login, onboarding)
- Find and search for language partners (server-side search)
- Friend requests and notifications
- Real-time chat and video call (Stream integration)
- User profile management
- Responsive, modern UI

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/shall-we-talk.git
cd shall-we-talk
```

### 2. Setup the backend

```bash
cd server
npm install
# Create a .env file with your MongoDB URI, JWT secret, and Cloudinary credentials
npm run dev
```

### 3. Setup the frontend

```bash
cd ../client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or as specified by Vite).

---

## Environment Variables

### Backend (`server/.env`)

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Scripts

### Backend

- `npm run dev` — Start the backend server with nodemon

### Frontend

- `npm run dev` — Start the Vite development server

---

## License

MIT
