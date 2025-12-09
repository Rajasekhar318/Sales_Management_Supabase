# 🏗️ TruEstate Project Architecture  
### *(Full System: Frontend + Backend + Database)*

This document explains the **overall architecture**, **data flow**, **request lifecycle**, **module responsibilities**, and **technology layers** of the TruEstate full-stack application.

---

# 📐 1. High-Level Architecture Overview

The TruEstate system follows a **client–server architecture** with a **React frontend**, a **Node.js + Express backend**, and a **Supabase PostgreSQL database**.

```
┌──────────────────┐         HTTP/HTTPS         ┌───────────────────┐
│   Frontend (UI)  │  <──────────────────────→  │     Backend API   │
│  React + Vite     │  <──────────────────────→  │ Express + Supabase│
└──────────────────┘                            └───────────────────┘
                                                             │
                                                             ▼
                                                   ┌───────────────────┐
                                                   │   Supabase DB     │
                                                   │ PostgreSQL + RLS  │
                                                   └───────────────────┘
```

---

# 🧱 2. Layered Architecture

The backend follows a clean **3-layer architecture**:

```
Presentation Layer       →        Routes & Controllers
Business Logic Layer     →        Services
Data Access Layer        →        Supabase Client + Query Builder
```

And the frontend follows a **component-driven architecture**:

```
Pages → Containers → Components → UI Elements
```

---

# 🧩 3. Frontend Architecture (React + Vite)

### 📌 Key Concepts
- Component-based UI using React hooks  
- Tailwind CSS for styling  
- Axios for API requests  
- Centralized API layer  
- Filters → Query Parameters → API calls  

### Folder Structure
```
frontend/src/
├── App.jsx               # Main logic: filters, fetch, state management
├── main.jsx              # React root
├── components/           # Reusable UI components
│   ├── SearchBar.jsx
│   ├── FiltersPanel.jsx
│   ├── SortDropdown.jsx
│   ├── StatsCards.jsx
│   ├── TransactionsTable.jsx
│   └── Pagination.jsx
└── services/
    └── api.js            # Axios instance + query builder
```

### UI Architecture Flow

```
User Input (Filters/Search/Pagination)
                ↓
   App.jsx builds query params
                ↓
  api.js sends GET /transactions request
                ↓
Backend returns data + meta
                ↓
UI updates table + stats
```

---

# 🔧 4. Backend Architecture (Node.js + Express)

Backend is organized following **MVC-like modular architecture**:

```
src/
├── index.js                       # Server entry point
├── routes/                        # URL routing
│   └── transactions.routes.js
├── controllers/                   # Handles incoming requests
│   └── transactions.controller.js
├── services/                      # Business logic
│   └── transactions.service.js
├── utils/                         # Reusable helpers
│   └── queryBuilder.js
└── db/
    └── pool.js                    # Supabase client setup
```

### Backend Request Lifecycle

```
Client → /transactions → Route → Controller → Service → QueryBuilder → Supabase → Response
```

---

# 🧠 5. Query Builder Logic

The custom `queryBuilder.js` allows dynamic filtering:

### Supported:
- Multi-value filters (regions, genders, categories…)
- Date range filters
- Numeric range filters (ageMin/ageMax)
- Search keyword (ILIKE)
- Sorting (ASC/DESC)
- Pagination (limit, offset)

### Example:

User selects:
```
regions = ["North", "South"]
sortBy = amount
sortOrder = desc
```

Query builder converts to Supabase query:

```
.where("region", "in", "(North,South)")
.order("amount", { ascending: false })
```

---

# 🗄️ 6. Database Architecture (Supabase PostgreSQL)

### Tables

```
transactions
```

### Example Columns:
- id  
- customer_name  
- region  
- category  
- gender  
- age  
- date  
- amount  
- tags  
- payment_method  

### Seed Architecture
```
seed.supabase.js         # Creates random dataset
importDataset.supabase.js# Imports CSV files
create_table.js          # Ensures table schema exists
```

Supabase handles:
- Row-level security (if enabled)
- SQL storage
- High-performance queries

---

# 🔄 7. Complete Data Flow (End-to-End)

```
┌───────────────┐
│  User Actions │
│  (Filters)    │
└───────┬───────┘
        ↓
Frontend builds URL query string
        ↓
GET /transactions?page=1&regions=North&regions=South
        ↓
Backend Route
        ↓
Controller parses filters
        ↓
Service converts filters → Query Builder
        ↓
Query Builder → Supabase SQL Query
        ↓
Supabase returns rows + total count
        ↓
Backend sends JSON { data, meta }
        ↓
UI updates table, pagination, stats
```

---

# 📦 8. Deployment Architecture

### Frontend Deployment:
- Build using `npm run build`
- Deploy `dist/` to:
  - Vercel
  - Netlify
  - AWS S3
  - Firebase Hosting

### Backend Deployment:
- Deploy Node.js service to:
  - Render
  - Railway
  - Fly.io
  - AWS EC2 / Lambda
- Set environment variables in host panel:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
  - `PORT`

### Supabase:
- Hosted automatically by Supabase  
- Uses Postgres storage  

---

# 🛡️ 9. Security Architecture

- `.env` variables for Supabase credentials  
- CORS enabled only for frontend domain  
- Uses **service_role key only in backend**  
- No secret keys exposed to frontend  

---

# 🧪 10. Scalability & Extensibility

### Frontend:
- Components are reusable  
- Filters easily extendable  
- API layer isolated  

### Backend:
- Add new endpoints via folders:
  - `/routes`
  - `/controllers`
  - `/services`

### Database:
- Add new columns without breaking API  
- Supabase handles indexing for performance  

---

# 🧭 11. Summary

The architecture emphasizes:

- **Separation of concerns**
- **Reusability**
- **Performance**
- **Scalability**
- **Clean, predictable data flow**

The result is a transparent, extensible, and maintainable full-stack system.

---

