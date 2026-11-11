

\# Kampüs Etkinlikleri API



\## Sprint 7 - Express ile REST API



Bu proje, Kampüs Etkinlikleri uygulamasının backend başlangıç sürümüdür.



Node.js ve Express kullanılarak etkinlik verilerini JSON formatında sunan bir REST API geliştirilmiştir.



\## Kullanılan Teknolojiler



\- Node.js

\- Express

\- dotenv

\- cors

\- JavaScript ES Modules



\## Proje Yapısı



```text

backend/

├── src/

│   ├── app.js

│   ├── server.js

│   ├── routes/

│   │   └── event-routes.js

│   ├── controllers/

│   │   └── event-controller.js

│   └── data/

│       └── events.js

├── requests/

│   └── kampus-api.json

├── .env

├── .env.example

├── .gitignore

├── package.json

└── README.md

```



\## Kurulum



Backend klasörüne girin:



```bash

cd backend

```



Paketleri yükleyin:



```bash

npm install

```



`.env.example` dosyasını kopyalayarak `.env` oluşturun.



PowerShell:



```powershell

Copy-Item .env.example .env

```



`.env` dosyasındaki değerleri bilgisayarınıza göre düzenleyin:



```env

PORT=3000

STUDENT\_NUMBER=YOUR\_STUDENT\_NUMBER

```



`YOUR\_STUDENT\_NUMBER` yerine kendi öğrenci numaranızı yazın.



\## Sunucuyu Çalıştırma



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



\## REST API Sözleşmesi



| Method | Endpoint | Açıklama | Başarılı | Hata |

|---|---|---|---|---|

| GET | /health | Sunucu sağlık kontrolü | 200 | - |

| GET | /events | Etkinlik listesini getirir | 200 | - |

| GET | /events/:id | Tek etkinliği getirir | 200 | 404 |

| POST | /events | Yeni etkinlik oluşturur | 201 | 400 |

| PATCH | /events/:id | Etkinlik güncelleme | 200 | 400, 404 |

| DELETE | /events/:id | Etkinlik silme | 204 | 404 |



PATCH ve DELETE işlemleri sonraki Sprint 9 kapsamında uygulanacaktır. Bu sprintte GET ve POST endpoint'leri tamamlanmıştır.



\## Endpoint Detayları



\### 1. GET /health



Sunucunun çalıştığını kontrol eder.



Örnek yanıt:



```json

{

&#x20; "status": "ok",

&#x20; "time": "2026-11-11T12:00:00.000Z",

&#x20; "student": "YOUR\_STUDENT\_NUMBER"

}

```



HTTP Status: `200 OK`



\### 2. GET /events



Bütün etkinlikleri JSON dizisi olarak döndürür.



HTTP Status: `200 OK`



Kategori filtresi isteğe bağlıdır:



```text

GET /events?category=Atölye

```



\### 3. GET /events/:id



ID değerine göre tek etkinliği getirir.



Örnek:



```text

GET /events/event-2

```



Başarılı yanıt: `200 OK`



Etkinlik bulunamazsa:



```json

{

&#x20; "error": {

&#x20;   "message": "Event not found"

&#x20; }

}

```



HTTP Status: `404 Not Found`



\### 4. POST /events



Yeni etkinlik oluşturur.



Örnek JSON body:



```json

{

&#x20; "title": "Git Atölyesi",

&#x20; "category": "Atölye",

&#x20; "date": "2026-12-01",

&#x20; "time": "14:00",

&#x20; "location": "Bilgisayar Laboratuvarı 1",

&#x20; "description": "Git ve GitHub ile ilk adımlar.",

&#x20; "capacity": 30

}

```



Başarılı yanıt:



\- HTTP Status: `201 Created`

\- Yeni etkinlik otomatik ID alır.

\- Oluşturulan etkinlik JSON olarak döndürülür.



Zorunlu alanlar:



\- title

\- category

\- date



Bu alanlardan biri eksikse:



```json

{

&#x20; "error": {

&#x20;   "message": "title, category and date are required"

&#x20; }

}

```



HTTP Status: `400 Bad Request`



\## Veri Yönetimi



Etkinlikler `src/data/events.js` dosyasında JavaScript dizisi içerisinde tutulmaktadır.



Bu sprintte veriler RAM üzerinde saklanır. Sunucu yeniden başlatıldığında POST ile eklenen kayıtlar başlangıç verilerine döner.



Veritabanı bağlantısı sonraki sprintlerde eklenecektir.



\## Postman Testleri



Postman koleksiyonu:



```text

requests/kampus-api.json

```



Koleksiyonda altı istek bulunmaktadır:



1\. GET /health - 200

2\. GET /events - 200

3\. GET /events/event-2 - 200

4\. GET /events/yok - 404

5\. POST /events - 201

6\. POST /events - 400



\## Güvenlik



\- Gerçek ortam değişkenleri `.env` dosyasında tutulur.

\- `.env` GitHub'a gönderilmez.

\- `.env.example` örnek değişkenleri içerir.

\- `node\_modules` GitHub'a gönderilmez.



