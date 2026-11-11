
import { Router } from "express";

import {
  getEvents,
  getEventById,
  createEvent,
} from "../controllers/event-controller.js";

const router = Router();

// GET /events
router.get("/", getEvents);

// GET /events/:id
router.get("/:id", getEventById);

// POST /events
router.post("/", createEvent);

export default router;
