
import { Router } from "express";

import {
  getEvents,
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event-controller.js";

const router = Router();

// GET /events
router.get("/", getEvents);

// GET /events/upcoming
router.get("/upcoming", getUpcomingEvents);

// GET /events/:id
router.get("/:id", getEventById);

// POST /events
router.post("/", createEvent);

// PATCH /events/:id
router.patch("/:id", updateEvent);

// DELETE /events/:id
router.delete("/:id", deleteEvent);

export default router;
