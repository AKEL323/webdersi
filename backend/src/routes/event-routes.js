
import { Router } from "express";

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
} from "../controllers/event-controller.js";

const router = Router();

// GET /events
router.get("/", getEvents);

// GET /events/:id
router.get("/:id", getEventById);

// POST /events
router.post("/", createEvent);

// PATCH /events/:id
router.patch("/:id", updateEvent);

export default router;
