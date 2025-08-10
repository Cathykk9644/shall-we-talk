import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getStreamToken,
  suggestReplies,
  suggestIcebreakers,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/streamToken", protectedRoute, getStreamToken);
router.post("/suggest-replies", protectedRoute, suggestReplies);
router.post("/icebreakers", protectedRoute, suggestIcebreakers);
export default router;
