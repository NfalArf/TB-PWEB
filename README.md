# Sistem Informasi Kerjasama FTI Unand
### Tugas Besar Pemrograman Web — Kelompok A10

**Mata Kuliah** : Pemrograman Web  
**Dosen Pengampu** : Husnil Kamil, M.T  
**Fakultas** : Teknologi Informasi — Universitas Andalas  

---

## 👥 Anggota Kelompok

| Nama | NIM |
|---|---|
| Dwigo Fajar Briliano | 2411521014 |
| Naufal Arif | 2411523009 |
| Muhammad Ghozi Asshidiqi | 2411523021 |

---

## 📋 Progress Minggu 11

Pada minggu ke-11 ini, kelompok kami mengimplementasikan tiga modul utama:

### 1. 🔐 Modul Autentikasi
Implementasi sistem login, logout, dan signup menggunakan **bcryptjs** untuk hashing password dan **express-session** untuk manajemen sesi pengguna.

**Yang diimplementasikan:**
- Registrasi akun baru dengan validasi input
- Login dengan verifikasi password menggunakan `bcrypt.compare()`
- Logout dengan menghapus session dan cookie
- Password di-hash otomatis saat signup menggunakan `bcrypt.hashSync()`
- Session disimpan dan divalidasi setiap request

**File terkait:**
```
routes.js        → handler login, logout, signup
hash.js          → utility generate hash password
views/login.ejs  → halaman login
views/signup.ejs → halaman signup
```

---

### 2. 🛡️ ACL (Access Control List)
Implementasi pembatasan akses halaman berdasarkan **role pengguna** (admin/user) yang tersimpan di database.

**Yang diimplementasikan:**
- Role pengguna disimpan di tabel `roles` dan `model_has_roles`
- Setiap pengguna yang signup otomatis mendapat role `user`
- Halaman tertentu hanya bisa diakses oleh role `admin`
- Pengguna yang belum login otomatis diarahkan ke halaman login

**Struktur Role di Database:**
```
users ──< model_has_roles >── roles
```

**File terkait:**
```
middlewares/authMiddleware.js → logika ACL
routes.js                     → penerapan ACL di setiap route
```

---

### 3. ⚙️ Middleware
Implementasi middleware autentikasi yang melindungi setiap route dari akses yang tidak sah.

**Middleware yang dibuat:**

| Middleware | Fungsi |
|---|---|
| `isLogin` | Memastikan user sudah login, jika belum redirect ke `/login` |
| `isAdmin` | Memastikan user memiliki role admin, jika bukan kirim error 403 |
| `isGuest` | Mencegah user yang sudah login mengakses halaman login/signup |

**Contoh penerapan di routes:**
```javascript
// Hanya bisa diakses kalau sudah login
router.get('/dashboard', isLogin, (req, res) => { ... });

// Hanya bisa diakses kalau belum login
router.get('/login', isGuest, (req, res) => { ... });

// Hanya bisa diakses oleh admin
router.get('/admin', isAdmin, (req, res) => { ... });
```

**File terkait:**
```
middlewares/authMiddleware.js → isLogin, isAdmin, isGuest
```

---

## 🗄️ Elaborasi Struktur Database

Database: `fti_kerjasama`

### Tabel `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT (PK, AI) | Primary key |
| name | VARCHAR(255) | Nama pengguna |
| email | VARCHAR(255) | Email pengguna (unik) |
| password | VARCHAR(255) | Password ter-hash bcrypt (60 karakter) |

### Tabel `roles`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT (PK, AI) | Primary key |
| name | VARCHAR(255) | Nama role (`admin` / `user`) |

### Tabel `model_has_roles`
| Kolom | Tipe | Keterangan |
|---|---|---|
| role_id | INT (FK) | Relasi ke tabel `roles` |
| model_type | VARCHAR(255) | Tipe model (`App\Models\User`) |
| model_id | INT (FK) | Relasi ke tabel `users` |

### Tabel `kerjasama`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT (PK, AI) | Primary key |
| nama_mitra | VARCHAR(255) | Nama instansi mitra |
| jenis_kerjasama | VARCHAR(255) | Jenis kerjasama |
| tanggal_mulai | DATE | Tanggal mulai kerjasama |
| tanggal_selesai | DATE | Tanggal selesai kerjasama |
| status | VARCHAR(50) | Status kerjasama |

### Relasi Antar Tabel
```
users ──────< model_has_roles >────── roles
  id              model_id              id
                  role_id
```

---

## 🌿 Pembagian Tugas & Kontribusi

| Nama | NIM | Branch | File | Tugas |
|---|---|---|---|---|
| Dwigo Fajar Briliano | 2411521014 | `main` | `server.js`, `db.js`, `package.json` | Setup project, konfigurasi server & koneksi database |
| Naufal Arif | 2411523009 | `middleware-acl` | `middlewares/authMiddleware.js`, `views/dashboard.ejs`, `views/kerjasama/` | Middleware autentikasi & ACL |
| Muhammad Ghozi Asshidiqi | 2411523021 | `fitur-auth` | `routes.js`, `hash.js`, `views/login.ejs`, `views/signup.ejs` | Routes, handler login/logout, signup & bcrypt |

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Keterangan |
|---|---|---|
| Node.js | - | Runtime JavaScript |
| Express.js | ^5.2.1 | Framework backend |
| EJS | ^5.0.2 | Template engine |
| MySQL | - | Database |
| bcryptjs | ^3.0.3 | Hashing password |
| express-session | ^1.19.0 | Manajemen session |
| mysql2 | ^3.22.3 | Driver koneksi MySQL |
| nodemon | ^3.1.14 | Auto-restart development |

---

## ⚙️ Cara Menjalankan Project

```bash
# 1. Clone repository
git clone https://github.com/NfalArf/TB-PWEB.git
cd TB-PWEB

# 2. Install dependency
npm install

# 3. Buat database fti_kerjasama di phpMyAdmin/MySQL

# 4. Sesuaikan konfigurasi database di db.js

# 5. Jalankan server
npm run dev

# 6. Buka browser
# http://localhost:3000
```
