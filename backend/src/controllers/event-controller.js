
import mongoose from "mongoose";
import Event from "../models/event-model.js";

// GET /events
// MongoDB'deki bütün etkinlikleri getirir.
export async function getEvents(req, res, next) {
  try {
    const filter = {};

    // İsteğe bağlı kategori filtresi
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const events = await Event.find(filter)
      .sort({ date: 1, time: 1 });

    return res.status(200).json(events);
  } catch (error) {
    return next(error);
  }
}

// GET /events/:id
// MongoDB ObjectId ile tek etkinliği getirir.
export async function getEventById(req, res, next) {
  try {
    const { id } = req.params;

    // Geçersiz MongoDB ID kontrolü
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        error: {
          message: "Event not found",
        },
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        error: {
          message: "Event not found",
        },
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    return next(error);
  }
}

// POST /events
// MongoDB'ye yeni etkinlik kaydeder.
export async function createEvent(req, res, next) {
  try {
    const newEvent = await Event.create(req.body ?? {});

    return res.status(201).json(newEvent);
  } catch (error) {
    // Mongoose doğrulama hataları 400 döndürür.
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      const details = error.errors
        ? Object.values(error.errors).map((item) => item.message)
        : [error.message];

      return res.status(400).json({
        error: {
          message: "Geçersiz etkinlik verisi",
          details,
        },
      });
    }

    return next(error);
  }
}
