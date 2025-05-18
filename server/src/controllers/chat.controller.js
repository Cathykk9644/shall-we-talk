import { generateStreamToken } from "../config/stream.js";

export async function getStreamToken(req, res) {
  try {
    const streamToken = generateStreamToken(req.user.id);

    res.status(200).json({ streamToken });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
