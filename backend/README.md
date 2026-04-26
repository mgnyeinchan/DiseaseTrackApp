# 🚀 Backend API (Node.js + Express)

This is the backend service for the project, built with Node.js and Express. It provides RESTful APIs for managing project-related data and integrates with a PostgreSQL database.

---

## 📁 Project Structure
Route → Controller → Service → Model → DB

backend/
├── src/
│   ├── controllers/
│   │    ├── auth.controller.js
│   │    └── case.controller.js
│   │
│   ├── services/
│   │    ├── auth.service.js
│   │    └── case.service.js
│   │
│   ├── routes/
│   │    ├── auth.routes.js
│   │    └── case.routes.js
│   │
│   ├── middleware/
│   │    └── auth.middleware.js
│   │
│   ├── models/
│   │    ├── db.js
│   │    ├── user.model.js
│   │    └── case.model.js
│   │
│   ├── app.js
│   └── server.js
│
├── database/
│   ├── schema/
│   └── seed/
│
├── .env
├── package.json
└── README.md

## ⚙️ Tech Stack

* Node.js
* Express.js
* PostgreSQL

---

## 📌 Prerequisites

* Node.js (v16+ recommended)
* PostgreSQL installed
* A database created (e.g. `surveillancedb`)

---

## 🔑 Environment Variables

Create a `.env` file in the root of the backend folder:

```env id="86j4fc"
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=surveillancedb
```

---

## 🗄️ Database Setup

Run the following scripts to initialize the database:

```bash id="e3g2sx"
psql -U postgres -d surveillancedb -f backend/database/schema/create_tables.sql
psql -U postgres -d surveillancedb -f backend/database/schema/constraints.sql
psql -U postgres -d surveillancedb -f backend/database/seed/insert_data.sql
```

---

## ▶️ Running the Server

Install dependencies:

```bash id="wq8z8k"
npm install
```

Start the server:

```bash id="iqsb4j"
npm start
```

For development (with auto-reload):

```bash id="m4hnwb"
npm run dev
```

---

## 🌐 API Endpoints

### Project APIs

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | /projects     | Get all projects   |
| GET    | /projects/:id | Get project by ID  |
| POST   | /projects     | Create new project |
| PUT    | /projects/:id | Update project     |
| DELETE | /projects/:id | Delete project     |

---

## 💡 Notes

* Ensure PostgreSQL service is running before starting the server.
* Update `.env` values based on your local setup.
* This project follows a layered architecture:

  * **Controller** → handles request/response
  * **Service** → contains business logic
  * **Route** → defines endpoints

---

## 🧪 Future Improvements

* Add authentication (JWT)
* Add validation (Joi / Zod)
* Add logging & error handling middleware
* Dockerize the backend

---
