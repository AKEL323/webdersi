
import express from "express";
import cors from "cors";

import eventRoutes from "./routes/event-routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    time: new Date().toISOString(),
    student: process.env.STUDENT_NUMBER,
  });
});

// Etkinlik route'ları
app.use("/events", eventRoutes);

// Tanımlanmayan adresler için 404
app.use((req, res) => {
  return res.status(404).json({
    error: {
      message: "Route not found",
    },
  });
});

export default app;
