# TruEstate — Backend (Node.js + Express + Supabase)

This is the backend for the TruEstate analytics/transactions dashboard.  
It provides a paginated, filterable `/transactions` API used by the frontend.

---

## 🚀 Tech Stack

- **Node.js + Express**
- **Supabase JS Client** (Postgres database)
- **CSV Import + Seeding Utilities**
- **Custom Query Builder**
- **dotenv for env management**
- **cors enabled**

---

## 📁 Project Structure

```
backend/
├─ .env
├─ package.json
├─ src/
│  ├─ index.js                       # Express server entry
│  ├─ controllers/
│  │   └─ transactions.controller.js # Request handler
│  ├─ services/
│  │   └─ transactions.service.js    # Business logic + DB calls
│  ├─ routes/
│  │   └─ transactions.routes.js     # Route definitions
│  ├─ utils/
│  │   └─ queryBuilder.js            # Builds SQL-like filter queries
│  ├─ db/
│  │   └─ pool.js                    # Supabase client configuration
│  └─ seed/
│      ├─ create_table.js            # Creates table structure
│      ├─ seed.supabase.js           # Seeds random data
│      └─ importDataset.supabase.js  # Imports CSV dataset
```

---

## 🔧 Installation

1. Move into backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=YOUR_SERVICE_ROLE_KEY
PORT=4000
```

> ⚠️ **Use the service role key**, not the anon key (required for inserts & seeds).  
> Remove trailing slashes in `SUPABASE_URL`.

4. Start development server:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## 🌐 API Endpoints

### **GET `/transactions`**

This endpoint returns paginated, sortable, filterable transaction data.

#### **Query Parameters Supported**

| Parameter        | Type     | Multi-value?  | Description                  |
|------------------|----------|---------------|------------------------------|
| `page`           | number   | ❌           | Page number (default: 1)     |
| `pageSize`       | number   | ❌           | Items per page (default: 20) |
| `search`         | string   | ❌           | Keyword search               |
| `sortBy`         | string   | ❌           | Column name                  |
| `sortOrder`      | asc/desc | ❌           | Sorting direction            |
| `regions`        | string   | ✅           | Multi-value filter           |
| `genders`        | string   | ✅           | Multi-value filter           |
| `categories`     | string   | ✅           | Multi-value filter           |
| `tags`           | string   | ✅           | Multi-value filter           |
| `paymentMethods` | string   | ✅           | Multi-value filter           |
| `ageMin`         | number   | ❌           | Minimum age                  |
| `ageMax`         | number   | ❌           | Maximum age                  |
| `dateFrom`       | string   | ❌           | ISO start date               |
| `dateTo`         | string   | ❌           | ISO end date                 |

### Example Request

```
GET /transactions?page=1&pageSize=20&regions=North&regions=South&sortBy=amount&sortOrder=desc
```

### Example Response

```json
{
  "data": [ ...transactions... ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1500,
    "totalPages": 75
  }
}
```

---

## 🧠 How It Works (Internal Flow)

```
Route → Controller → Service → Query Builder → Supabase → Response
```

### `/src/index.js`
- Initializes Express server
- Registers `/transactions` routes
- Enables CORS + JSON parsing

### `/src/routes/transactions.routes.js`
- Maps GET `/transactions` → controller

### `/src/controllers/transactions.controller.js`
- Extracts filters
- Calls service layer
- Sends final JSON response

### `/src/services/transactions.service.js`
- Builds dynamic SQL filters (via queryBuilder)
- Sends query to Supabase
- Handles pagination math

### `/src/utils/queryBuilder.js`
Responsible for:

- Dynamic filters  
- Array-based filters (`regions=North&regions=South`)  
- Sorting  
- Date and numeric ranges  

Generates `.ilike()`, `.gte()`, `.lte()`, `.in()` filters depending on query.

---

## 🗃 Database (Supabase)

A `transactions` table is expected, created by:

```
npm run seed
```

Or manually using:

```
node src/seed/create_table.js
```

Seeding options:

### 1️⃣ Seed sample random dataset
```
npm run seed
```

### 2️⃣ Import CSV dataset
Put CSV in `backend/src/seed` and run:

```
npm run import-csv
```

---

## ⚙️ Environment Variables

```
SUPABASE_URL=
SUPABASE_KEY=
PORT=4000
```

### Important:
- URL must NOT end with a slash.
- `SUPABASE_KEY` must be the **service role** key.
- Do NOT expose `.env` publicly.

---

## 🚀 Running in Production

1. Build your frontend separately (Vercel recommended)  
2. Deploy backend on:
- Render
- Railway
- Supabase Edge Functions
- Fly.io
- AWS

3. Set production env variables in host dashboard.

---
