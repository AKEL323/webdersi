
# Kampüs Etkinlikleri API

## Sprint 9 - Tam CRUD ve Sorgulama İşlemleri

Bu proje, Kampüs Etkinlikleri uygulaması için Node.js, Express, MongoDB ve Mongoose kullanılarak geliştirilmiş REST API uygulamasıdır.

Sprint 7'de Express backend altyapısı oluşturulmuştur. Sprint 8'de etkinlik verileri MongoDB Atlas veritabanına taşınmıştır. Sprint 9'da ise tam CRUD işlemleri, arama, filtreleme ve yaklaşan etkinlik sorgusu eklenmiştir.

## Kullanılan Teknolojiler

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- cors
- JavaScript ES Modules
- Postman
- Newman

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
│   ├── utils/
│   │   └── date.js
│   ├── app.js
│   ├── server.js
│   └── seed.js
├── requests/
│   ├── kampus-api.json
│   └── run-results.json
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

Örnek `.env.example` içeriği:

```env
PORT=3000
STUDENT_NUMBER=YOUR_STUDENT_NUMBER
MONGODB_URI=mongodb://127.0.0.1:27017/kampus
```

MongoDB Atlas kullanılıyorsa yerel `.env` dosyasına gerçek bağlantı adresi yazılmalıdır.

- `PORT`: Sunucunun çalışacağı port.
- `STUDENT_NUMBER`: Öğrenci numarası.
- `MONGODB_URI`: MongoDB bağlantı adresi.

Gerçek MongoDB Atlas bağlantı adresi ve şifresi GitHub'a gönderilmemelidir.

`.env` dosyası `.gitignore` içerisinde tutulur. `.env.example` yalnızca örnek değerler içerir.

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

Sunucu başlatılmadan önce MongoDB bağlantısı kurulur. Veritabanı bağlantısı başarısız olursa sunucu başlatılmaz.

## MongoDB ve Mongoose

Veritabanı bağlantısı:

```text
src/config/database.js
```

dosyasında tanımlanmıştır.

Etkinlik modeli:

```text
src/models/event-model.js
```

dosyasında oluşturulmuştur.

### Etkinlik alanları

| Alan | Kural |
|---|---|
| title | Zorunlu, trim, 3-100 karakter |
| category | Zorunlu, enum |
| capacity | Number, minimum 0, varsayılan 0 |
| date | Zorunlu, Date |
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

Mongoose `timestamps` özelliği sayesinde `createdAt` ve `updatedAt` alanları otomatik oluşturulur.

MongoDB her etkinlik için otomatik `_id` değeri oluşturur.

## Tarih İşlemleri

Tarih yardımcı fonksiyonları:

```text
src/utils/date.js
```

dosyasında bulunmaktadır.

Kullanılan fonksiyonlar:

- `parseDate(value)`: GG-AA-YYYY biçimindeki metni Date nesnesine dönüştürür.
- `formatDate(date)`: Date nesnesini GG-AA-YYYY biçiminde gösterir.
- `todayStart()`: Bugünün UTC başlangıç tarihini döndürür.

API tarih biçimi:

```text
GG-AA-YYYY
```

Örnek:

```text
15-10-2026
```

Tarih MongoDB'de gerçek Date türünde saklanır. API JSON yanıtında ise `GG-AA-YYYY` biçiminde gösterilir.

Geçersiz tarihler kabul edilmez.

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

Başlangıç verilerini yüklemek için:

```bash
npm run seed
```

Seed işlemi mevcut etkinlik kayıtlarını siler ve altı başlangıç etkinliğini yeniden ekler.

Bu nedenle seed iki kez çalıştırıldığında kayıt sayısı 12'ye çıkmaz; koleksiyonda yeniden altı başlangıç kaydı bulunur.

**Önemli:** Seed çalıştırıldığında POST ile sonradan oluşturulan kayıtlar da silinir.

## REST API Sözleşmesi

| Method | Endpoint | Açıklama | Başarılı | Hata |
|---|---|---|---|---|
| GET | `/health` | Sunucu sağlık kontrolü | 200 | - |
| GET | `/events` | Etkinlik listesini getirir | 200 | 500 |
| GET | `/events?search=` | Başlığa göre arar | 200 | 500 |
| GET | `/events?category=` | Kategoriye göre filtreler | 200 | 500 |
| GET | `/events/upcoming` | Bugünkü ve gelecekteki etkinlikleri getirir | 200 | 500 |
| GET | `/events/:id` | ID ile etkinlik getirir | 200 | 404 |
| POST | `/events` | Yeni etkinlik oluşturur | 201 | 400 |
| PATCH | `/events/:id` | Etkinliği günceller | 200 | 400, 404 |
| DELETE | `/events/:id` | Etkinliği siler | 204 | 404 |

### 1. GET /health

Sunucunun çalıştığını kontrol eder.

```text
GET http://localhost:3000/health
```

Başarılı yanıt:

```json
{
  "status": "ok",
  "time": "2026-11-25T09:00:00.000Z",
  "student": "YOUR_STUDENT_NUMBER"
}
```

HTTP Status: `200 OK`

### 2. GET /events

MongoDB'deki etkinliklerin tamamını tarih ve saate göre artan sırada getirir.

```text
GET http://localhost:3000/events
```

HTTP Status: `200 OK`

### 3. GET /events?search=

Etkinlik başlığında metin araması yapar.

Arama büyük/küçük harf duyarsızdır.

Örnek:

```text
GET http://localhost:3000/events?search=robotik
```

HTTP Status: `200 OK`

Arama metnindeki özel regex karakterleri güvenli biçimde ele alınır.

### 4. GET /events?category=

Etkinlikleri kategoriye göre filtreler.

Örnek:

```text
GET http://localhost:3000/events?category=Atölye
```

HTTP Status: `200 OK`

### 5. Arama ve kategori filtresini birlikte kullanma

İki query parametresi aynı istekte kullanılabilir.

```text
GET http://localhost:3000/events?search=arduino&category=Atölye
```

Sonuç hem arama hem kategori koşulunu karşılayan etkinliklerden oluşur.

HTTP Status: `200 OK`

### 6. GET /events/upcoming

Bugünün tarihindeki ve gelecekteki etkinlikleri getirir.

```text
GET http://localhost:3000/events/upcoming
```

Geçmiş tarihli etkinlikler listeye dahil edilmez.

Etkinlikler tarih ve saate göre artan sırada döndürülür. En yakın etkinlik ilk sırada bulunur.

HTTP Status: `200 OK`

### 7. GET /events/:id

MongoDB ObjectId kullanılarak tek etkinliği getirir.

Örnek:

```text
GET http://localhost:3000/events/MONGODB_OBJECT_ID
```

Etkinlik bulunursa `200 OK` döner.

ID geçersizse veya kayıt bulunamazsa:

```json
{
  "error": {
    "message": "Event not found"
  }
}
```

HTTP Status: `404 Not Found`

### 8. POST /events

Yeni etkinlik oluşturur.

Örnek JSON:

```json
{
  "title": "Git Atölyesi",
  "category": "Atölye",
  "date": "20-12-2026",
  "time": "14:00",
  "location": "Bilgisayar Laboratuvarı 1",
  "description": "Git ve GitHub ile ilk adımlar.",
  "capacity": 30
}
```

Zorunlu alanlar:

- title
- category
- date

Başarılı olduğunda:

- HTTP Status: `201 Created`
- MongoDB otomatik `_id` oluşturur.
- `createdAt` ve `updatedAt` alanları oluşturulur.
- Oluşturulan etkinlik JSON olarak döndürülür.

Eksik veya geçersiz veri gönderildiğinde `400 Bad Request` döndürülür.

### 9. PATCH /events/:id

Mevcut etkinliği yalnızca gönderilen alanlar üzerinden günceller.

Örnek:

```text
PATCH http://localhost:3000/events/MONGODB_OBJECT_ID
```

Body:

```json
{
  "capacity": 55
}
```

Başarılı güncellemede:

- HTTP Status: `200 OK`
- Güncellenen kayıt yanıt olarak döndürülür.
- Yanıtta etkinliğin güncel değerleri bulunur.
- `updatedAt` otomatik güncellenir.

`runValidators: true` kullanılarak Mongoose doğrulamaları güncelleme sırasında çalıştırılır.

`returnDocument: "after"` kullanılarak güncellenmiş kayıt döndürülür.

PATCH hata durumları:

| Durum | HTTP Status |
|---|---|
| Boş body | 400 |
| Geçersiz kategori | 400 |
| Korunan alanı değiştirme | 400 |
| İzin verilmeyen alan | 400 |
| Bulunamayan kayıt | 404 |
| Geçersiz ID | 404 |

Korunan alanlar:

- `_id`
- `createdAt`
- `updatedAt`
- `__v`

### 10. DELETE /events/:id

MongoDB ObjectId ile etkinliği siler.

Örnek:

```text
DELETE http://localhost:3000/events/MONGODB_OBJECT_ID
```

Başarılı silme:

```text
HTTP Status: 204 No Content
```

Başarılı silme işleminde yanıt gövdesi gönderilmez.

Silinmiş veya bulunamayan kayıt için:

```json
{
  "error": {
    "message": "Event not found"
  }
}
```

HTTP Status: `404 Not Found`

## Hata Yönetimi

Hata yanıtlarında Sprint 8'de kullanılan JSON biçimi korunmuştur:

```json
{
  "error": {
    "message": "Server error"
  }
}
```

Mongoose doğrulama ve veri türü hataları uygun durumlarda `400 Bad Request` olarak döndürülür.

Bulunamayan kayıtlar `404 Not Found` döndürür.

Beklenmeyen sunucu hataları merkezi hata middleware'i tarafından karşılanır.

## Newman ve Postman Testleri

Postman koleksiyonu:

```text
requests/kampus-api.json
```

Hocanın Sprint 9 test koleksiyonu:

```text
https://webdersi.vercel.app/test.json
```

Newman global kurulumu:

```bash
npm install -g newman
```

Newman sürümünü kontrol etme:

```bash
newman --version
```

Hocanın koleksiyonunu çalıştırma:

```bash
newman run https://webdersi.vercel.app/test.json --reporters "cli,json" --reporter-json-export "./requests/run-results.json"
```

Test raporunun konumu:

```text
requests/run-results.json
```

### Sprint 9 Newman test sonucu

| Ölçüm | Sonuç |
|---|---:|
| Toplam istek | 18 |
| Başarısız istek | 0 |
| Toplam test | 45 |
| Başarısız test | 0 |
| Toplam hata | 0 |

**Sonuç: 18 istek, 45 test ve 0 hata.**

JSON raporu ayrıca kontrol edilmiştir.

## Kalıcılık Testi

MongoDB Atlas kullanıldığı için veriler RAM yerine veritabanında saklanır.

Kalıcılık testi:

1. POST /events ile yeni etkinlik oluşturulur.
2. Oluşturulan etkinliğin `_id` değeri alınır.
3. Sunucu kapatılır.
4. Sunucu tekrar başlatılır.
5. Aynı `_id` ile GET /events/:id isteği yapılır.
6. Etkinliğin hâlâ mevcut olduğu doğrulanır.

## Güvenlik

- Gerçek MongoDB bağlantısı `.env` dosyasında tutulur.
- `.env` GitHub'a gönderilmez.
- `.env.example` örnek değerler içerir.
- `node_modules` GitHub'a gönderilmez.
- Veritabanı şifresi kaynak koduna yazılmaz.
