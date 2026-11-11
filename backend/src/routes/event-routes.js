
import { Router } from "express";

import {
  getEvents,
  getEventById,
} from "../controllers/event-controller.js";

const router = Router();

// GET /events
router.get("/", getEvents);

// GET /events/:id
router.get("/:id", getEventById);

export default router;
