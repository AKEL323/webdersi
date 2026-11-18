
import dns from "node:dns";

// MongoDB Atlas SRV DNS çözümleme ayarı
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import "dotenv/config";
import mongoose from "mongoose";

import { seedEvents } from "./data/seed-events.js";

// DNS ayarı yapıldıktan sonra veritabanı modülünü yükle.
const { connectDatabase } = await import("./config/database.js");
const { default: Event } = await import("./models/event-model.js");

async function seedDatabase() {
  try {
    await connectDatabase();

    // Başlangıç verilerini yeniden oluştur.
    await Event.deleteMany({});

    const insertedEvents = await Event.insertMany(seedEvents);

    console.log(
      `Başarılı: ${insertedEvents.length} etkinlik eklendi.`
    );

    insertedEvents.forEach((event) => {
      console.log(`${event.title}: ${event._id}`);
    });
  } catch (error) {
    console.error("Seed işlemi başarısız:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log("MongoDB bağlantısı kapatıldı.");
  }
}

await seedDatabase();
