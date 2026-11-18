
import dns from "node:dns";

// MongoDB Atlas SRV sorguları için DNS sunucuları
dns.setServers(["1.1.1.1", "1.0.0.1"]);

// Önce ortam değişkenlerini yükle.
await import("dotenv/config");

// DNS ayarından sonra uygulama ve veritabanı modüllerini yükle.
const { default: app } = await import("./app.js");
const { connectDatabase } = await import("./config/database.js");

const PORT = Number(process.env.PORT) || 3000;

try {
  // Önce MongoDB bağlantısını kur.
  await connectDatabase();

  // Bağlantı başarılıysa sunucuyu başlat.
  app.listen(PORT, () => {
    console.log(`API: http://localhost:${PORT}`);
  });
} catch (error) {
  console.error(
    `Sunucu başlatılamadı: ${error.message}`
  );

  process.exit(1);
}
