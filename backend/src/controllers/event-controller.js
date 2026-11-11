
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
