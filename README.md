# Stock App Backend

Backend aplikasi **Stock Management** yang dibangun menggunakan:

- [NestJS](https://nestjs.com/) (TypeScript)
- [Prisma ORM](https://www.prisma.io/) v7
- MySQL
- JWT Authentication

Backend ini menyediakan API untuk:

- Autentikasi admin (login)
- Manajemen Admin
- Manajemen Kategori Produk
- Manajemen Produk
- Transaksi Stok (IN / OUT) + validasi stok
- Riwayat transaksi

---

## 1. Prerequisites

Pastikan sudah ter-install di mesin lokal:

- **Node.js** LTS (disarankan v20.x)
- **npm** (terinstall otomatis bersama Node)
- **MySQL** (5.7 / 8.x)

Cek versi:

```bash
node -v
npm -v
mysql --version
```

> Rekomendasi: gunakan `nvm` untuk mengelola versi Node.js.

---

## 2. Clone Repository

Clone repo kemudian masuk ke folder backend:

```bash
git clone <URL_REPOSITORY_ANDA>.git

cd <NAMA_REPOSITORY>/backend
```

Ganti `<URL_REPOSITORY_ANDA>` dan `<NAMA_REPOSITORY>` sesuai repo GitHub kamu.

---

## 3. Install Dependencies

Di dalam folder `backend`:

```bash
npm install
```

Ini akan meng-install semua dependency NestJS, Prisma, dan lainnya.

---

## 4. Setup Database MySQL

Login ke MySQL sebagai root:

```bash
sudo mysql -u root -p
```

Lalu jalankan perintah SQL berikut:

```sql
CREATE DATABASE stock_app_db;
CREATE USER 'stock_user'@'localhost' IDENTIFIED BY 'ganti-password-anda';
GRANT ALL PRIVILEGES ON stock_app_db.* TO 'stock_user'@'localhost';
GRANT CREATE, DROP ON *.* TO 'stock_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Penjelasan singkat:

- `stock_app_db` → nama database untuk aplikasi ini
- `stock_user` → user khusus untuk aplikasi
- `ganti-password-anda` → silakan ganti dengan password yang kamu inginkan

> Catatan: kalau password MySQL kamu mengandung karakter spesial seperti `@`, `:`, `#`, `/`, **wajib** di-URL-encode saat dipakai di `DATABASE_URL`.

---

## 5. Konfigurasi Environment (`.env`)

Di folder `backend`, buat file `.env`:

```bash
cd backend
touch .env
```

Isi dengan:

```env
DATABASE_URL="mysql://stock_user:ganti-password-anda@localhost:3306/stock_app_db"
JWT_SECRET="super-secret-key"
JWT_EXPIRES_IN="1d"
```

- `DATABASE_URL` → connection string MySQL
- `JWT_SECRET` → secret key untuk signing JWT (silakan ganti dengan string random)
- `JWT_EXPIRES_IN` → lama token hidup (misal `1d`, `2h`, dll)

> Jika password mengandung karakter seperti `@` atau `#`, encode terlebih dahulu (contoh: `@` → `%40`, `#` → `%23`).

---

## 6. Konfigurasi Prisma (Prisma 7)

Prisma sudah dikonfigurasi menggunakan file:

- `prisma/schema.prisma`
- `prisma.config.ts`

Secara default:

- `provider` menggunakan `mysql`
- `DATABASE_URL` diambil dari `.env`
- Prisma Client diakses melalui `@prisma/client` dan menggunakan `PrismaMariaDb` adapter.

Kamu tidak perlu mengubah file ini untuk menjalankan project lokal, cukup pastikan `.env` sudah benar.

---

## 7. Jalankan Migrasi Database

Masih di folder `backend`:

```bash
npx prisma migrate dev --name init
```

Perintah ini akan:

- Membuat struktur tabel di database `stock_app_db`
- Menyimpan riwayat migrasi di folder `prisma/migrations`

---

## 8. Seed Admin Default

Untuk membuat admin default (supaya bisa langsung login), jalankan:

```bash
npx ts-node prisma/seed.ts
```

Jika berhasil, akan muncul pesan di terminal, contoh:

```txt
Admin seeded: admin@example.com / password123
```

Akun default:

- **Email**: `admin@example.com`
- **Password**: `password123`

Kredensial ini digunakan untuk login di endpoint `/auth/login` atau via frontend.

---

## 9. Menjalankan Server Backend

Jalankan NestJS dalam mode development:

```bash
npm run start:dev
```

Secara default, server akan berjalan di:

```txt
http://localhost:4000
```

Jika berhasil, NestJS akan menampilkan log di terminal, contoh:

```txt
[Nest] 12345  - ...   LOG [NestFactory] Starting Nest application...
...
🚀 Server running on http://localhost:4000
```

---

## 10. Test API Login (Opsional)

Kamu bisa mengetes login admin via `curl`:

```bash
curl -X POST http://localhost:4000/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@example.com","password":"password123"}'
```

Jika sukses, akan mengembalikan JSON berisi:

- `accessToken` (JWT)
- Data `admin` (id, firstName, lastName, email)

---

## 11. Catatan Tambahan

- Backend ini sudah di-enable CORS untuk frontend di `http://localhost:3000`.
- Adapter yang digunakan: `@prisma/adapter-mariadb` (sesuai rekomendasi Prisma 7 untuk koneksi MySQL/MariaDB).
- Semua akses database di NestJS menggunakan `PrismaService` (`src/prisma/prisma.service.ts`) yang meng-extend `PrismaClient`.

Jika ingin menjalankan frontend yang terhubung ke backend ini, pastikan backend sudah jalan terlebih dahulu di `http://localhost:4000`.

---

## 12. Script npm yang Berguna

Di folder `backend`:

- `npm run start:dev` → menjalankan backend di mode development (watch mode)
- `npx prisma migrate dev --name <nama>` → membuat / menjalankan migrasi database
- `npx prisma studio` → (opsional) membuka UI Prisma untuk melihat data di database
- `npx ts-node prisma/seed.ts` → menjalankan seeding admin default

---

Jika ada yang ingin kamu sesuaikan (nama DB, user, port, dsb.), tinggal update bagian `.env` dan langkah setup database di atas. 🚀
