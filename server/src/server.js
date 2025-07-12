import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allow credentials (cookies) to be sent from the client
  })
);

// Increase payload size limit
app.use(express.json({ limit: "10mb" })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("Hello Shall-We-Talk!");
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
  connectDB();
});
