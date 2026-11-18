
# Kampüs Etkinlikleri API

## Sprint 8 - MongoDB ve Mongoose ile Kalıcı Veri

Bu proje, Kampüs Etkinlikleri uygulamasının Express ve MongoDB
kullanılarak geliştirilmiş backend uygulamasıdır.

Sprint 7'de RAM üzerinde tutulan etkinlik verileri, Sprint 8'de
MongoDB Atlas veritabanına taşınmıştır.

Böylece sunucu yeniden başlatıldığında etkinlik kayıtları kaybolmaz.

## Kullanılan Teknolojiler

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- cors
- JavaScript ES Modules

## Proje Yapısı

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── event-controller.js
│   ├── data/
│   │   └── seed-events.js
│   ├── models/
│   │   └── event-model.js
│   ├── routes/
│   │   └── event-routes.js
│   ├── app.js
│   ├── server.js
│   └── seed.js
├── requests/
│   └── kampus-api.json
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Kurulum

Backend klasöründe paketleri yükleyin:

```bash
npm install
```

## Ortam Değişkenleri

Backend klasöründe `.env` dosyası oluşturun.

`.env.example` dosyasındaki örnek değerleri kullanabilirsiniz.

```env
PORT=3000
STUDENT_NUMBER=YOUR_STUDENT_NUMBER
MONGODB_URI=mongodb+srv://DATABASE_USER:PASSWORD@YOUR_CLUSTER.mongodb.net/kampus
```

Açıklamalar:

- PORT: Sunucunun çalışacağı port.
- STUDENT_NUMBER: Öğrenci numarası.
- MONGODB_URI: MongoDB bağlantı adresi.

Gerçek MongoDB Atlas bağlantı adresi yalnızca yerel `.env`
dosyasında tutulmalıdır.

Gerçek kullanıcı adı ve şifre GitHub'a gönderilmemelidir.

`.env.example` dosyasında gerçek bağlantı bilgileri bulunmaz.

## Sunucuyu Çalıştırma

Geliştirme modu:

```bash
npm run dev
```

Normal başlatma:

```bash
npm start
```

API adresi:

```text
http://localhost:3000
```

## MongoDB Bağlantısı

Veritabanı bağlantısı:

```text
src/config/database.js
```

dosyasında tanımlanmıştır.

Mongoose kullanılarak `process.env.MONGODB_URI` üzerinden
MongoDB bağlantısı kurulur.

Sunucu başlamadan önce veritabanı bağlantısı tamamlanır.

Bağlantı kurulamazsa sunucu başlatılmaz.

Bağlantı mesajında veritabanı adresi ve adı gösterilir;
şifre terminale yazdırılmaz.

## Schema ve Model

Etkinlik şeması:

```text
src/models/event-model.js
```

dosyasında tanımlanmıştır.

Event modeli aşağıdaki alanları içerir:

| Alan | Kural |
|---|---|
| title | Zorunlu, trim, 3-100 karakter |
| category | Zorunlu, enum |
| capacity | Number, minimum 0, varsayılan 0 |
| date | Zorunlu |
| time | Varsayılan boş metin |
| location | Trim, varsayılan boş metin |
| description | Trim, en fazla 500 karakter |
| createdAt | Otomatik |
| updatedAt | Otomatik |

İzin verilen kategoriler:

- Seminer
- Atölye
- Söyleşi
- Yarışma

Mongoose timestamps özelliği sayesinde `createdAt` ve
`updatedAt` alanları otomatik oluşturulur.

MongoDB her belgeye otomatik `_id` değeri verir.

## Seed İşlemi

Başlangıç etkinlikleri:

```text
src/data/seed-events.js
```

dosyasında tutulur.

Seed çalıştırıcısı:

```text
src/seed.js
```

dosyasıdır.

Altı başlangıç etkinliğini MongoDB'ye eklemek için:

```bash
npm run seed
```

Seed işlemi önce mevcut events koleksiyonundaki kayıtları
siler, ardından altı başlangıç etkinliğini yeniden ekler.

Bu nedenle seed iki kez çalıştırıldığında kayıt sayısı
12'ye çıkmaz; koleksiyonda yeniden 6 başlangıç kaydı kalır.

Önemli: Seed çalıştırıldığında POST ile sonradan eklenen
etkinlikler de silinir.

## REST API Sözleşmesi

| Method | Endpoint | Açıklama | Başarılı | Hata |
|---|---|---|---|---|
| GET | /health | Sunucu sağlık kontrolü | 200 | - |
| GET | /events | Etkinlik listesini getirir | 200 | - |
| GET | /events/:id | ID ile etkinlik getirir | 200 | 404 |
| POST | /events | Yeni etkinlik oluşturur | 201 | 400 |

### 1. GET /health

Sunucunun çalıştığını kontrol eder.

```text
GET http://localhost:3000/health
```

Örnek yanıt:

```json
{
  "status": "ok",
  "time": "2026-11-18T09:00:00.000Z",
  "student": "YOUR_STUDENT_NUMBER"
}
```

HTTP Status: `200 OK`

### 2. GET /events

MongoDB'deki bütün etkinlikleri getirir.

```text
GET http://localhost:3000/events
```

HTTP Status: `200 OK`

Kategori filtresi:

```text
GET http://localhost:3000/events?category=Atölye
```

### 3. GET /events/:id

MongoDB ObjectId kullanılarak tek etkinliği getirir.

Örnek:

```text
GET http://localhost:3000/events/MONGODB_OBJECT_ID
```

Etkinlik bulunursa `200 OK` döner.

ID biçimi geçersizse veya kayıt bulunamazsa:

```json
{
  "error": {
    "message": "Event not found"
  }
}
```

HTTP Status: `404 Not Found`

### 4. POST /events

Yeni etkinlik oluşturur.

Örnek JSON:

```json
{
  "title": "Git Atölyesi",
  "category": "Atölye",
  "date": "2026-12-01",
  "time": "14:00",
  "location": "Bilgisayar Laboratuvarı 1",
  "description": "Git ve GitHub ile ilk adımlar.",
  "capacity": 30
}
```

Başarılı olduğunda:

- HTTP Status: `201 Created`
- MongoDB otomatik `_id` oluşturur.
- `createdAt` ve `updatedAt` alanları oluşturulur.
- Oluşturulan etkinlik JSON olarak döndürülür.

Zorunlu alanlar:

- title
- category
- date

Eksik veya geçersiz veri gönderildiğinde:

- HTTP Status: `400 Bad Request`
- Hata mesajı JSON formatında döndürülür.

## Hata Yönetimi

Beklenmeyen sunucu hataları merkezi hata middleware'i
tarafından karşılanır.

Kullanıcıya:

```json
{
  "error": {
    "message": "Server error"
  }
}
```

yanıtı döndürülür.

Hatalar sunucunun terminaline yazdırılır.

Bulunmayan route adresleri `404` döndürür.

## Kalıcılık Testi

MongoDB Atlas kullanıldığı için veriler RAM yerine
veritabanında saklanır.

Kalıcılık testi:

1. POST /events ile yeni etkinlik oluşturulur.
2. Oluşturulan etkinliğin `_id` değeri alınır.
3. Sunucu kapatılır.
4. Sunucu tekrar başlatılır.
5. Aynı `_id` ile GET /events/:id isteği yapılır.
6. Etkinliğin hâlâ mevcut olduğu doğrulanır.

## Postman Testleri

Postman koleksiyonu:

```text
requests/kampus-api.json
```

Koleksiyondaki istekler:

1. GET /health - 200
2. GET /events - 200
3. GET /events/:id - 200
4. GET /events/yok - 404
5. POST /events - 201
6. POST /events (eksik veri) - 400

## Güvenlik

- Gerçek bağlantı adresi `.env` dosyasında tutulur.
- `.env` GitHub'a gönderilmez.
- `.env.example` örnek değerler içerir.
- `node_modules` GitHub'a gönderilmez.
- Veritabanı şifresi kod içerisine yazılmaz.
