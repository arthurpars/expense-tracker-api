# Expense Tracker API

A secure, multi-tenant REST API built with Node.js and Express. Uses JSON files for storage instead of a database.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root:
```
PORT=3000
JWT_SECRET=your_generated_secret_here
```

Generate a secure secret with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Start the server
```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The server will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable     | Required | Description                          |
|--------------|----------|--------------------------------------|
| `PORT`       | No       | Port to listen on (default: 3000)    |
| `JWT_SECRET` | Yes      | Secret key used to sign JWT tokens   |

---

## Creating Your First Admin User

The signup endpoint always creates a `user` role account. To promote an account to admin:

1. Sign up normally via `POST /api/auth/signup`
2. Open `data/users.json`
3. Find the user entry and change `"role": "user"` to `"role": "admin"`
4. Save the file — no restart needed

---

## API Overview

### Auth (Public)
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/auth/signup`    | Register new account |
| POST   | `/api/auth/login`     | Login, receive JWT   |

### Expenses (Requires JWT)
| Method | Endpoint                 | Description                        |
|--------|--------------------------|------------------------------------|
| GET    | `/api/expenses`          | Get your expenses (filterable)     |
| POST   | `/api/expenses`          | Create a new expense               |
| PUT    | `/api/expenses/:id`      | Update your expense                |
| DELETE | `/api/expenses/:id`      | Delete your expense                |

**Date filter query params:**
- `?filter=past_week`
- `?filter=past_month`
- `?filter=last_3_months`
- `?filter=custom&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`

### Admin (Requires JWT + admin role)
| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | `/api/admin/users`          | List all users (no passwords)|
| GET    | `/api/admin/expenses`       | List all expenses            |
| DELETE | `/api/admin/expenses/:id`   | Delete any expense           |

### Allowed Expense Categories
`Groceries`, `Leisure`, `Electronics`, `Utilities`, `Clothing`, `Health`, `Others`

---

## Authentication

All protected routes require a JWT in the `Authorization` header:
```
Authorization: Bearer <token>
```

The token is returned by `POST /api/auth/login`.
