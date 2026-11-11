
import { events } from "../data/events.js";

// GET /events
// Bütün etkinlikleri getirir.
// Kategori parametresi gönderilirse filtreler.
export function getEvents(req, res) {
  const { category } = req.query;

  const list = category
    ? events.filter((event) => event.category === category)
    : events;

  return res.status(200).json(list);
}

// GET /events/:id
// ID üzerinden tek etkinliği getirir.
export function getEventById(req, res) {
  const event = events.find(
    (item) => item.id === req.params.id
  );

  if (!event) {
    return res.status(404).json({
      error: {
        message: "Event not found",
      },
    });
  }

  return res.status(200).json(event);
}

// POST /events
// Yeni etkinlik oluşturur.
export function createEvent(req, res) {
  const {
    title,
    category,
    date,
    time,
    location,
    description,
    capacity,
  } = req.body ?? {};

  // Zorunlu alanların kontrolü
  if (!title || !category || !date) {
    return res.status(400).json({
      error: {
        message: "title, category and date are required",
      },
    });
  }

  // Yeni etkinlik nesnesi
  const newEvent = {
    id: `event-${Date.now()}`,
    title,
    category,
    date,
    capacity: Number(capacity) || 0,
    time: time ?? "",
    location: location ?? "",
    description: description ?? "",
  };

  // Etkinliği bellekteki diziye ekle
  events.push(newEvent);

  // Oluşturulan etkinliği 201 ile döndür
  return res.status(201).json(newEvent);
}
