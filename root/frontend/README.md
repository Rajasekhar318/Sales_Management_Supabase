# TruEstate — Frontend (Vite + React + Tailwind)

This is the frontend for the TruEstate dashboard application.  
It provides searching, filtering, sorting, and pagination for transaction data fetched from an API.

---

## 🚀 Features

- View paginated transactions  
- Search bar for quick lookup  
- Multi-select filters (region, gender, category, tags, payment methods)  
- Sort dropdown (ascending / descending)  
- Date range & age range filters  
- Stats cards for quick summary  
- Responsive UI built with Tailwind CSS  
- Axios-based API layer + custom query builder  

---

## 📦 Prerequisites

- Node.js (LTS recommended)
- npm
- A backend exposing `/transactions` API

---

## 🛠️ Setup & Installation

1. Navigate into the project folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional but recommended):
   ```
   VITE_API_URL=http://localhost:4000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open browser at the URL shown in terminal (usually: `http://localhost:5173`)

---

## 🔧 Environment Variables

| Key             | Description                               | Default                     |
|-----------------|-------------------------------------------|-----------------------------|
| `VITE_API_URL`  | Base URL for backend API                  | `http://localhost:4000/api` |

> Vite requires all exposed env variables to start with `VITE_`.

---

## 📜 Available Scripts

| Command           | Description                           |
|-------------------|---------------------------------------|
| `npm run dev`     | Start dev server                      |
| `npm run build`   | Build production output               |
| `npm run preview` | Preview production bundle locally     |
| `npm run lint`    | Run eslint checks                     |

---

## 📁 Project Structure

```
frontend/
├─ index.html
├─ package.json
├─ vite.config.js
├─ .env
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ index.css
│  ├─ App.css
│  ├─ components/
│  │  ├─ SearchBar.jsx
│  │  ├─ FiltersPanel.jsx
│  │  ├─ SortDropdown.jsx
│  │  ├─ StatsCards.jsx
│  │  ├─ TransactionsTable.jsx
│  │  └─ Pagination.jsx
│  └─ services/
│     └─ api.js
└─ public/
```

---

## 🧩 Components Overview

### `SearchBar.jsx`
Handles keyword input for searching transactions.

### `FiltersPanel.jsx`
Allows filtering by:
- Regions
- Genders
- Categories
- Tags
- Payment methods  
Includes age range & date range filters.

### `SortDropdown.jsx`
Controls sorting fields and order.

### `StatsCards.jsx`
Shows summary numbers (total transactions, etc).

### `TransactionsTable.jsx`
Renders the transaction list in a table format.

### `Pagination.jsx`
Pagination control to navigate pages.

### `src/services/api.js`
Contains:
- Axios instance  
- `buildSearchParams()`  
- `fetchTransactions(params)` helper  

---

## 🔌 API Expectations

### Endpoint:
```
GET {VITE_API_URL}/transactions
```

### Query Parameters:
- `page`
- `pageSize`
- `search`
- `sortBy`
- `sortOrder`
- `regions` (multi-value)
- `genders` (multi-value)
- `categories`
- `tags`
- `paymentMethods`
- `ageMin`, `ageMax`
- `dateFrom`, `dateTo`

### Example request:
```
GET http://localhost:4000/api/transactions?page=1&pageSize=20&regions=North&regions=South&sortBy=date
```

### Expected Response:
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

---

## 🎨 Styling

- Tailwind CSS  
- Uses `@tailwindcss/vite` plugin  
- Utility-first styling throughout components  

---

## 🚀 Deployment Notes

- Build using:
  ```bash
  npm run build
  ```
- Deploy the `dist/` folder to:
  - Vercel
  - Netlify
  - Render (static hosting)
  - AWS S3 + CloudFront  
- Ensure backend CORS allows the deployed domain.

---
