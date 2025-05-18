import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedFriends,
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
} from "../controllers/user.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectedRoute);

router.get("/", getRecommendedFriends);
router.get("/friends", getFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getIncomingFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;
