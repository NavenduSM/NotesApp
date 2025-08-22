# Notes App Backend (MERN)

This is the backend for a **Notes App** built using **Node.js, Express, MongoDB, and JWT authentication**.  
Users can register, log in, logout, reset-password, and create personal notes that are linked to their accounts.  
Only the authenticated user can access, update, or delete their own notes.

---

## 🚀 Features
- User registration and login with hashed passwords (bcrypt)
- Forgot password & reset password with email support
- Secure logout (JWT cookie cleared on client)
- JWT-based authentication with cookies
- CRUD operations for notes (Create, Read, Update, Delete)
- Each note is linked to a specific user
- Error handling and secure routes
- Ready for frontend integration (React / Next.js)

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcrypt
- **Email (optional)**: Nodemailer (for verification/reset)

---

## 📂 Project Structure
backend/  
│── mailtrap/ # Mailtrap Email Logic  
│── models/ # Mongoose models (User, Note)  
│── routes/ # Express route handlers  
│── controllers/ # Business logic for auth & notes  
│── middleware/ # Authentication middleware  
│── main.js # Entry point  
│── package.json  

## 🔑 API Endpoints
**Auth**
---
`POST /auth/signup` → Register new user  

`POST /auth/login` → Login & receive JWT token  

`POST /auth/logout` → Logout (clears JWT cookie)  

`POST /auth/forgot-password` → Request password reset (sends email with reset link)  

`POST /auth/reset-password/:token` → Reset password using token  

---

**Notes** (Protected)
---
`POST` /notes/create-note → Create a note

`GET` /get-notes → Get all user notes

`PUT` /notes/update-note/:id → Update note

`DELETE` /notes/delete-note/:id → Delete note

---

##✅ Authentication Flow

---
User logs in → receives JWT token in cookie.

checkAuth middleware verifies token for protected routes.

Notes are always tied to req.user.id → prevents access to others' notes.

---