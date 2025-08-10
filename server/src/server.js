import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  start().catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
}

export { start };
