
import mongoose from "mongoose";
import Event from "../models/event-model.js";

const allowedUpdateFields = [
  "title",
  "category",
  "capacity",
  "date",
  "time",
  "location",
  "description",
];

const protectedFields = [
  "_id",
  "createdAt",
  "updatedAt",
  "__v",
];

function handleValidationError(error, res) {
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

  return null;
}

// GET /events
// MongoDB'deki bütün etkinlikleri getirir.
export async function getEvents(req, res, next) {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const events = await Event.find(filter).sort({
      date: 1,
      time: 1,
    });

    return res.status(200).json(events);
  } catch (error) {
    return next(error);
  }
}

// GET /events/:id
// ID ile tek etkinliği getirir.
export async function getEventById(req, res, next) {
  try {
    const { id } = req.params;

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
// Yeni etkinlik oluşturur.
export async function createEvent(req, res, next) {
  try {
    const newEvent = await Event.create(req.body ?? {});

    return res.status(201).json(newEvent);
  } catch (error) {
    const validationResponse = handleValidationError(error, res);

    if (validationResponse) {
      return validationResponse;
    }

    return next(error);
  }
}

// PATCH /events/:id
// Etkinliğin yalnızca gönderilen alanlarını günceller.
export async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;

    // Geçersiz ID kontrolü
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        error: {
          message: "Event not found",
        },
      });
    }

    const updates = req.body;

    // Gövde nesne olmalı, boş olmamalı ve dizi olmamalı.
    if (
      !updates ||
      typeof updates !== "object" ||
      Array.isArray(updates) ||
      Object.keys(updates).length === 0
    ) {
      return res.status(400).json({
        error: {
          message: "Güncellenecek alan bulunamadı",
        },
      });
    }

    const fields = Object.keys(updates);

    // Sistem tarafından yönetilen alanları koru.
    const attemptedProtectedFields = fields.filter((field) =>
      protectedFields.includes(field)
    );

    if (attemptedProtectedFields.length > 0) {
      return res.status(400).json({
        error: {
          message: "Korunan alanlar güncellenemez",
          details: attemptedProtectedFields,
        },
      });
    }

    // İzin verilmeyen alanları reddet.
    const invalidFields = fields.filter(
      (field) => !allowedUpdateFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: {
          message: "Geçersiz güncelleme alanı",
          details: invalidFields,
        },
      });
    }

    // Güncelleme yap ve güncel kaydı döndür.
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updates,
      {
        runValidators: true,
        returnDocument: "after",
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        error: {
          message: "Event not found",
        },
      });
    }

    return res.status(200).json(updatedEvent);
  } catch (error) {
    const validationResponse = handleValidationError(error, res);

    if (validationResponse) {
      return validationResponse;
    }

    return next(error);
  }
}
