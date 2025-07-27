# 📝 Notes App API

A secure and production-ready RESTful API for managing user notes, built using Node.js, Express, MongoDB, and Redis.  
This project includes advanced authentication, OTP verification, encryption, and full user session control.

---

## 🚀 Features

### ✅ Auth & Security
- JWT-based authentication with access token
- Password encryption using bcrypt
- Phone number encryption (symmetric encryption)
- OTP confirmation for:
  - Email verification during sign-up
  - Reset password process
- Rate limiting (login attempts) using *Redis*
- Helmet & HPP for HTTP header & parameter protection
- Environment variables via .env

### 📧 OTP & Email
- OTP codes hashed with bcrypt in DB
- Email confirmation via nodemailer (configurable)
- Expiry & re-send logic

### 🗒 Notes Management
- CRUD for user notes
- Pagination (limit/offset)
- Ownership verification for update/delete

### 📦 Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Redis
- Joi (input validation)
- dotenv
- asyncHandler
- MVC structure based on nonaid style

---## 🛠 Upcoming Improvements

The following features are planned for future updates to further enhance functionality and security:

- 🔁 Refresh Token system for long-lived sessions
- 📦 Docker support for containerized deployment (Node.js + Redis)
- 🧪 API testing using Jest & Supertest
- 📩 Production-ready HTML email templates
- 🧠 Activity logging and login history
