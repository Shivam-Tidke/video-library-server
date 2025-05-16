# Tech Video Library – Backend

This is the **backend API** for the [Tech Video Library](https://github.com/Shivam-Tidke/video-library-ts) project, built with **Node.js**, **Express**, and **MongoDB**. It supports **JWT-based authentication**, role-based access for users and admins, and full CRUD operations for videos and categories.

## Live Frontend

![video-library-client.vercel.app](https://video-library-client.vercel.app)

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **cookie-parser**
- **CORS**
- **dotenv**
- **mongoose-aggregate-paginate-v2**

## Features

-  User and Admin registration/login
-  JWT-based authentication with role protection
-  Full CRUD for videos
-  Category management
-  RESTful API structure
-  Cookie support for auth tokens
-  CORS enabled for secure frontend-backend communication

## Folder Structure

```bash
video-library-server/
├── public/temp/              # Temp storage (e.g., uploads)
├── src/
│   ├── controllers/          # All route logic
│   ├── db/                   # MongoDB connection logic
│   ├── middlewares/          # JWT, role-based auth
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── utils/                # Reusable helpers
│   ├── app.js                # Main Express app
│   ├── constants.js          # Common constants (e.g., roles)
│   └── index.js              # App entry point (starts server)
├── .env                      # Environment config
├── .gitignore
├── package.json
├── README.md
```
## Authentication
- JWT token is issued login
- Cookie-parser used to store auth token securely
- Middleware checks token validity and role (User/Admin)
