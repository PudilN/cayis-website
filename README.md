# Biodata Kelompok — PKPL

Website biodata kelompok dengan implementasi **Google OAuth** untuk authentication dan authorization.

## Fitur

- ✅ **Biodata publik** — dapat dilihat tanpa login
- ✅ **Google OAuth 2.0** — login menggunakan akun Google
- ✅ **Authorization** — hanya anggota kelompok yang dapat mengubah tampilan (warna/font)
- ✅ **Input validation** — validasi tema di server-side
- ✅ **Session security** — HttpOnly cookies, SameSite policy

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React (Vite)                      |
| Backend  | Express.js                        |
| Auth     | Passport.js + Google OAuth 2.0    |
| Session  | express-session                   |

## Setup

### 1. Google OAuth Credentials

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih yang sudah ada
3. Navigasi ke **APIs & Services > Credentials**
4. Buat **OAuth 2.0 Client ID** (Web application)
5. Tambahkan Authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID dan Client Secret

### 2. Konfigurasi Environment

Edit file `server/.env`:

```env
GOOGLE_CLIENT_ID=<paste_client_id>
GOOGLE_CLIENT_SECRET=<paste_client_secret>
SESSION_SECRET=<random_string>
ALLOWED_EMAILS=email1@gmail.com,email2@gmail.com,email3@gmail.com
```

Ganti `ALLOWED_EMAILS` dengan email Google anggota kelompok.

### 3. Install & Run

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Run server (terminal 1)
cd server
npm start

# Run client (terminal 2)
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 4. Edit Biodata

Edit file `server/data/members.json` dengan data anggota kelompok yang sebenarnya.

## Security Highlights

| Aspect | Implementation |
|--------|---------------|
| Authentication | Google OAuth 2.0 (Passport.js) |
| Authorization | Email whitelist di `.env` |
| Session | HttpOnly, SameSite=Lax cookies |
| CORS | Restricted origin |
| Input Validation | Regex validation untuk tema values |
