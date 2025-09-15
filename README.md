# Xeno FDE Assignment 2025 Submission
## (Harsh Bhardwaj) - Final year B.Tech CSE, MRU

![Xeno Assignment Thumbnail](https://github.com/user-attachments/assets/fee7eee8-f32b-4e65-ad3b-cea8acc7edb6)

*Xeno Harsh is an FDE Assignment 2025, a multi-tenant Shopify analytics and data ingestion platform. It enables store owners to connect their Shopify accounts, sync data, and view actionable insights through a Next.js dashboard. The backend (Node.js/Express) handles authentication, data sync, event tracking, and background jobs using PostgreSQL, Redis, and Bull queue. The frontend provides a clean, interactive UI for dashboards, customer events, and analytics, with secure JWT-based authentication and real-time updates.*

## Full App Flow Inshort
When an order is placed on the Shopify store, a webhook sends the order data to your backend, which saves it to the database (via Prisma), updates Redis for fast access or queue processing, and then the dashboard fetches and displays this data by querying the backend APIs.

## Demo Credentials

- **Shopify Store:** [https://xeno-harsh.myshopify.com/](https://xeno-harsh.myshopify.com/)
    **Password:** `xeno-harsh`
- **Dashboard:** [https://xeno-harsh.vercel.app/](https://xeno-harsh.vercel.app/)

## Dashboard Login Credentials

You can register your own Shopify store, or use the demo account below:

- **Email:** `harshbhardwajofficial1414@gmail.com`
- **Password:** `test1234`

## Features Implemented
- Secure authentication and registration for store owners.
- Shopify account integration, allowing users to sync their store data.
- ⁠Real-time dashboard with analytics: order stats, top customers, and customer events.
- ⁠Background job processing using Bull and Redis for scalable data sync.
- Webhook endpoints for Shopify events like orders, carts, and checkouts.
- ⁠Automated sync scheduler using GitHub Actions to keep tenant data up-to-date.
- Type-safe database operations with Prisma ORM and PostgreSQL.
- lean, interactive frontend built with Next.js, React, and Tailwind CSS.

## How I Approached the Problem
I started by designing a clear architecture, separating backend and frontend concerns. The backend uses Express for API routes, Prisma for database access, and Bull for background jobs. I focused on modularity, with helpers for authentication, middleware for JWT protection, and services for business logic.

For the frontend, I used Next.js for server-side rendering and React for UI components. I built reusable hooks and components for authentication, dashboard data, and event handling. Tailwind CSS helped me quickly style the UI for a modern look.

I paid special attention to multi-tenancy, ensuring each store’s data is isolated and secure. Webhooks are verified using HMAC to prevent spoofing, and all sensitive endpoints require JWT authentication.

## Trade-offs I Made
- I chose Prisma ORM for rapid development and type safety, but it adds some overhead compared to raw SQL.
- ⁠Automated syncs are handled via GitHub Actions, which is simple for small projects but may not scale for very frequent jobs.
- ⁠I focused on core features and clean code rather than exhaustive error handling or edge-case coverage, to meet the assignment deadline.

# App Architecture

```mermaid
flowchart TB
    F["Frontend (Next.js + React)<br>Dashboard | Auth Pages | Integration | Charts & Analytics"]
    API["API Layer (Express/Next.js API Routes)<br>Auth APIs | Shopify APIs | Webhook Handlers | Analytics APIs"]
    DB["Database (PostgreSQL)<br>Users/Tenants | Products | Orders | Customers | Events/Logs"]
    SHOP["Shopify API<br>Products | Orders | Customers | Webhooks"]
    REDIS["Redis Cache<br>Session Data | API Cache | Sync Status"]
    JOBS["Background Jobs<br>Periodic Sync | Abandonment Sweeps | Data Cleanup"]

    F --> API
    API --> DB
    API --> SHOP
    API --> REDIS
    DB --> JOBS
    SHOP --> JOBS
    REDIS --> JOBS
```

## Flow Summary
*Step-by-step application flow breakdown*

### `01` Entry Point
**`index.ts`** initializes Express app, sets up CORS, middleware, and route handlers

### `02` Authentication Flow

- **Routes:** `auth.ts` handles registration and login endpoints
- **Services:** `authService.ts` processes business logic  
- **Helpers:** 
  - `passwordHelper.ts` for bcrypt operations
  - `tokenHelper.ts` for JWT management
- **Database:** `tenantQueries.ts` for user data persistence

### `03` Protected Routes
All dashboard and Shopify routes use **`auth.ts`** middleware for JWT verification

### `04` Dashboard Analytics

- **Routes:** `dashboard.ts` exposes analytics endpoints
- **Services:** `dashboardService.ts` aggregates business metrics
- **Queries:** 
  - `orderQueries.ts` for order analytics
  - `customerQueries.ts` for customer data  
  - `productQueries.ts` for product analytics

### `05` Shopify Integration

- **Routes:** `shopify.ts` manages sync operations
- **Queue:** `queueService.ts` creates and monitors background jobs
- **Processing:** 
  - `queue/index.ts` - Bull queue setup
  - `queue/processors.ts` - async operation handlers
- **API:** `shopifyService.ts` communicates with Shopify REST/GraphQL APIs

### `06` Background Jobs
**Bull queue system** with Redis backend handles scalable async Shopify data synchronization

### `07` Auto Sync Scheduler
**GitHub Workflow Actions** automatically sync all tenants every 6 hours using scheduled cron jobs

### `08` Data Layer
**Prisma ORM** provides type-safe database operations with PostgreSQL backend

## Tech Stack
*Latest stable versions for optimal performance*

### Frontend
<table>
<tr>
<td>
<strong>Next.js</strong><br>
<sub>15.5.3</sub>
</td>
<td>
<strong>React</strong><br>
<sub>18.3.1</sub>
</td>
<td>
<strong>TypeScript</strong><br>
<sub>5.7.2</sub>
</td>
<td>
<strong>Tailwind CSS</strong><br>
<sub>3.4.16</sub>
</td>
</tr>
</table>

### Backend
<table>
<tr>
<td>
<strong>Express</strong><br>
<sub>4.21.2</sub>
</td>
<td>
<strong>Prisma</strong><br>
<sub>6.1.0</sub>
</td>
<td>
<strong>PostgreSQL</strong><br>
<sub>Database</sub>
</td>
<td>
<strong>JWT</strong><br>
<sub>Auth</sub>
</td>
</tr>
</table>

### DevOps & Automation
<table>
<tr>
<td>
<strong>GitHub Actions</strong><br>
<sub>CI/CD & Auto Sync</sub>
</td>
<td>
<strong>Redis</strong><br>
<sub>Queue Backend</sub>
</td>
<td>
<strong>Bull Queue</strong><br>
<sub>Job Processing</sub>
</td>
<td>
<strong>Cron Jobs</strong><br>
<sub>6-hour intervals</sub>
</td>
</tr>
</table>

## Component Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant D as Dashboard Page
    participant H as useAuth Hook
    participant DD as useDashboardData Hook
    participant AS as Auth Service
    participant DS as Dashboard Service
    participant API as Backend API
    
    U->>D: Visits Dashboard
    D->>H: Initialize Auth
    H->>AS: Check Auth Status
    AS->>API: Validate Token
    API-->>AS: User Data
    AS-->>H: Auth State
    H-->>D: isAuthenticated: true
    
    D->>DD: Fetch Dashboard Data
    DD->>DS: getAllDashboardData()
    DS->>API: GET /stats
    DS->>API: GET /orders-by-date
    DS->>API: GET /top-customers
    API-->>DS: Dashboard Data
    DS-->>DD: Formatted Data
    DD-->>D: State Update
    D->>D: Render Components
    
    Note over D: Dashboard Renders Successfully
    
    U->>D: Clicks Sync Data
    D->>DD: handleSync()
    DD->>DS: syncData()
    DS->>API: POST /shopify/sync
    API-->>DS: Sync Complete
    DS-->>DD: Success
    DD->>DS: Refresh Data
    DS-->>DD: Updated Data
    DD-->>D: Re-render
    
    U->>D: Visits Customer Events Page
    D->>H: Initialize Auth
    H->>AS: Check Auth Status
    AS->>API: Validate Token
    API-->>AS: User Data
    AS-->>H: Auth State
    H-->>D: isAuthenticated: true
    D->>DD: Fetch Customer Events
    DD->>DS: getCustomerEvents()
    DS->>API: GET /customer-events
    API-->>DS: Customer Events Data
    DS-->>DD: Formatted Data
    DD-->>D: State Update
    D->>D: Render Event Components
```

## Frontend Architecture Flow

```mermaid
graph TD
    subgraph UI [" "]
        A["Dashboard Page"]
        B["Header"]
        C["Stats Cards"]
        D["Charts"]
        E["Table"]
        F["Filters"]
        
        A --- B
        A --- C
        A --- D
        A --- E
        A --- F
    end
    
    subgraph HOOKS [" "]
        G["useAuth"]
        H["useDashboard"]
        I["useSync"]
        J["useDateFilter"]
    end
    
    subgraph SERVICES [" "]
        K["API Client"]
        L["Auth Service"]
        M["Dashboard Service"]
        N["Shopify Service"]
    end
    
    subgraph UTILS [" "]
        O["Formatters"]
        P["Validators"]
        Q["Types"]
    end
    
    subgraph EXT [" "]
        R["Backend API"]
        S["Local Storage"]
    end
    
    %% Connections
    UI --> HOOKS
    HOOKS --> SERVICES
    SERVICES --> EXT
    UI --> UTILS
    
    G --> L
    H --> M
    I --> N
    
    L --> S
    K --> R
    
    O --> C
    O --> E
    
    %% Styling
    classDef uiLayer fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    classDef hooksLayer fill:#f093fb,stroke:#f5576c,stroke-width:2px,color:#fff
    classDef serviceLayer fill:#4facfe,stroke:#00f2fe,stroke-width:2px,color:#fff
    classDef utilLayer fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    classDef extLayer fill:#fa709a,stroke:#fee140,stroke-width:2px,color:#fff
    
    class A,B,C,D,E,F,UI uiLayer
    class G,H,I,J,HOOKS hooksLayer
    class K,L,M,N,SERVICES serviceLayer
    class O,P,Q,UTILS utilLayer
    class R,S,EXT extLayer
```

## Backend Architecture Flow
*Interactive system architecture and component relationships*

```mermaid
graph TD
    %% Entry Point
    A["index.ts<br/>Express App Setup<br/>Port: 3001"] --> B["Routes Setup<br/>CORS + Middleware"]

    %% Routes
    B --> RAuth["/api/auth<br/>routes/auth.ts"]
    B --> RShopify["/api/shopify<br/>routes/shopify.ts"]
    B --> RDashboard["/api/dashboard<br/>routes/dashboard.ts"]
    B --> RSync["/api/sync<br/>routes/sync.ts"]
    B --> RCustomerEvents["/api/customer-events<br/>routes/customerEvents.ts"]
    B --> RWebhooks["/api/webhooks<br/>routes/webhooks.ts"]

    %% Auth Flow
    RAuth --> SAuth["authService.ts<br/>registerTenant(), loginTenant()"]
    SAuth --> TTenants["tenantQueries.ts<br/>createTenant(), findTenantByEmail()"]
    SAuth --> HPass["passwordHelper.ts<br/>hash/verify"]
    SAuth --> HToken["tokenHelper.ts<br/>createToken()"]
    SAuth --> HResp["responseHelper.ts<br/>formatTenantResponse()"]

    %% Dashboard & Analytics (protected)
    RDashboard --> MAuth["middleware/auth.ts<br/>authenticateToken()"]
    MAuth --> SDashboard["dashboardService.ts<br/>getDashboardStats(), getOrdersByDate()"]
    SDashboard --> QOrders["orderQueries.ts<br/>orders analytics"]
    SDashboard --> QCustomers["customerQueries.ts<br/>top customers"]
    SDashboard --> QProducts["productQueries.ts<br/>inventory/product analytics"]
    SDashboard --> QCustomerEvents["customerEventQueries.ts<br/>event stats"]

    %% Shopify Sync, Queue, and Background Processing
    RShopify --> MAuth
    RShopify --> SQueueSvc["queueService.ts<br/>createSyncJob(), getSyncJob()"]
    SQueueSvc --> QueueIndex["queue/index.ts<br/>Bull queue setup"]
    QueueIndex --> QueueProc["queue/processors.ts<br/>processShopifySync()"]
    QueueProc --> SShopify["shopifyService.ts<br/>pull/push to Shopify REST/GraphQL"]
    SShopify --> DBOps["Database Updates<br/>bulk upserts"]

    %% Auto Sync
    RSync --> SShopify
    RSync --> TTenants

    %% Customer Events & Webhooks
    RCustomerEvents --> QCustomerEvents
    RWebhooks --> WVerify["webhookVerification.ts<br/>HMAC verification"]
    RWebhooks --> WHelpers["webhookHelpers.ts<br/>logWebhook(), createWebhookEvent()"]
    WHelpers --> QWebhookLogs["webhook_logs table"]
    WHelpers --> QCustomerEvents
    RWebhooks --> WTest["GET /api/webhooks/test (health) "]

    %% Abandonment Detection (cron)
    Aband["abandonmentDetectionService.ts<br/>cron jobs"] --> QCustomerEvents
    Aband --> QueueProc

    %% Database / Prisma
    DBOps --> Prisma["Prisma Client<br/>postgresql"]
    QOrders --> Prisma
    QCustomers --> Prisma
    QProducts --> Prisma
    TTenants --> Prisma
    QCustomerEvents --> Prisma
    QWebhookLogs --> Prisma

    %% Utils & Helpers
    WVerify --> Utils["utils/webhookVerification.ts"]
    WHelpers --> Utils
    HPass --> Utils
    HToken --> Utils
    SDashboard --> Utils

    %% Styling / Groups
    classDef entryPoint fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e40af
    classDef routes fill:#eef2ff,stroke:#6366f1,stroke-width:1px,color:#3730a3
    classDef services fill:#dcfce7,stroke:#16a34a,stroke-width:1px,color:#065f46
    classDef db fill:#fff7ed,stroke:#f97316,stroke-width:1px,color:#7c2d12
    classDef helpers fill:#fff1f2,stroke:#ef4444,stroke-width:1px,color:#7f1d1d
    classDef queue fill:#f8fafc,stroke:#94a3b8,stroke-width:1px,color:#475569

    class A entryPoint
    class RAuth,RShopify,RDashboard,RSync,RCustomerEvents,RWebhooks routes
    class SAuth,SDashboard,SQueueSvc,SShopify,Aband services
    class QOrders,QCustomers,QProducts,QCustomerEvents,QWebhookLogs,TTenants db
    class HPass,HToken,HResp,WVerify,WHelpers helpers
    class QueueIndex,QueueProc queue
```

## Backend Components (Detailed)
Below is a short, file-level breakdown of the backend pieces.

- Routes (`/src/routes`)
    - `auth.ts` — register and login endpoints (`/api/auth/*`). Uses `authService` and tenant queries.
    - `shopify.ts` — manual sync and per-tenant sync endpoints (`/api/shopify/*`). Enqueues sync jobs via `queueService`.
    - `dashboard.ts` — protected analytics endpoints (`/api/dashboard/*`) that aggregate data for the frontend.
    - `sync.ts` — auto-sync trigger endpoints used by GitHub Actions and scheduled jobs.
    - `customerEvents.ts` — CRUD and stats endpoints for customer events (`/api/customer-events/*`).
    - `webhooks.ts` — raw webhook receivers for Shopify (carts, checkouts, orders) and a test GET endpoint.

- Services (`/src/services`)
    - `authService.ts` — tenant creation, authentication, password verification, token creation.
    - `shopifyService.ts` — Shopify API calls, bulk sync logic, mapping external data to internal models.
    - `dashboardService.ts` — aggregates queries for stats, orders-by-date, top customers.
    - `queueService.ts` — creates and monitors Bull jobs (sync jobs, background tasks).
    - `abandonmentDetectionService.ts` — scheduled cron logic that inspects events to flag abandoned carts and create events.

- Queue & Background Processing
    - `queue/index.ts` — Bull queue and dashboard integration setup (Redis-backed).
    - `queue/processors.ts` — job processors that call `shopifyService` and other handlers.

- Webhooks & Event Processing
    - `webhookVerification.ts` — HMAC verification helper for Shopify webhooks.
    - `webhookHelpers.ts` — helper to log incoming webhooks to `webhook_logs` and create `customer_events`.
    - Webhook endpoints: `POST /api/webhooks/shopify/carts/update`, `POST /api/webhooks/shopify/checkouts/create`, `POST /api/webhooks/shopify/checkouts/update`, `POST /api/webhooks/shopify/orders/create`, and `GET /api/webhooks/test`.

- Database Layer (Prisma)
    - `prisma/schema.prisma` and migration(s) define models: `Tenant`, `Customer`, `Product`, `Order`, `CustomerEvent`, `WebhookLog`.
    - Queries live under `/src/database` and encapsulate Prisma operations: `tenantQueries.ts`, `customerQueries.ts`, `productQueries.ts`, `orderQueries.ts`, `customerEventQueries.ts`.

- Middleware & Helpers
    - `middleware/auth.ts` — JWT verification and tenant resolution for protected routes.
    - `helpers/passwordHelper.ts`, `tokenHelper.ts`, `responseHelper.ts` — small utilities used by services and routes.
    - `utils/*` — date formatting, validation, Prisma client export, and async error handling.

- Observability & Ops
    - Webhook logs are stored in `webhook_logs` for debugging and replayability.
    - Bull dashboard is integrated for job monitoring; Redis is used as the queue backend.
    - Cron jobs and GitHub Actions are used for scheduled and automated tenant syncs.

## Project Structure
*Folder structure for backend & frontend*

```
xeno-harsh/
├── .github/
│   └── workflows/
│       └── auto-sync.yml
├── README.md
├── backend/
│   ├── nodemon.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │       └── 20250913070205_add_customer_events/
│   │           └── migration.sql
│   └── src/
│       ├── index.ts
│       ├── database/
│       │   ├── customerEventQueries.ts
│       │   ├── customerQueries.ts
│       │   ├── orderQueries.ts
│       │   ├── productQueries.ts
│       │   └── tenantQueries.ts
│       ├── helpers/
│       │   ├── passwordHelper.ts
│       │   ├── responseHelper.ts
│       │   └── tokenHelper.ts
│       ├── middleware/
│       │   └── auth.ts
│       ├── queue/
│       │   ├── index.ts
│       │   └── processors.ts
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── customerEvents.ts
│       │   ├── dashboard.ts
│       │   ├── shopify.ts
│       │   ├── sync.ts
│       │   └── webhooks.ts
│       ├── services/
│       │   ├── abandonmentDetectionService.ts
│       │   ├── authService.ts
│       │   ├── dashboardService.ts
│       │   ├── queueService.ts
│       │   └── shopifyService.ts
│       └── utils/
│           ├── asyncHandler.ts
│           ├── dateUtils.ts
│           ├── formatUtils.ts
│           ├── prisma.ts
│           ├── tenantHelper.ts
│           ├── validation.ts
│           ├── webhookHelpers.ts
│           └── webhookVerification.ts
├── frontend/
│   ├── next-env.d.ts
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── customer-events/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── index.ts
│   │   ├── dashboard/
│   │   │   ├── ChartSection.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DateFilter.tsx
│   │   │   ├── OrdersByDateChart.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   └── TopCustomersTable.tsx
│   │   └── ui/
│   │       ├── AuthForm.tsx
│   │       ├── AuthLayout.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── Icon.tsx
│   │       └── LoadingSpinner.tsx
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   ├── useDashboardData.ts
│   │   ├── useDateFilter.ts
│   │   └── useSync.ts
│   ├── public/
│   │   ├── apple-touch-icon.png
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── images/
│   │       └── bg-xeno.jpg
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── customerEventService.ts
│   │   ├── dashboardService.ts
│   │   ├── index.ts
│   │   └── shopifyService.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   ├── index.ts
│   ├── utils/
│   │   ├── analytics.ts
│   │   ├── constants.ts
│   │   ├── errorHandler.ts
│   │   ├── formatters.ts
│   │   ├── index.ts
│   │   ├── storage.ts
│   │   └── validation.ts
    ├── next.config.js
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    └── app/
        ├── globals.css
        ├── layout.tsx
        ├── page.tsx
        ├── auth/
        │   ├── login/
        │   │   └── page.tsx
        │   └── register/
        │       └── page.tsx
        └── dashboard/
            └── page.tsx
```

## Quick Start
*Get up and running in minutes*

### Prerequisites

<table>
<tr>
<td>
<strong>Node.js</strong><br>
<sub>v18 or higher</sub>
</td>
<td>
<strong>PostgreSQL</strong><br>
<sub>Database server</sub>
</td>
<td>
<strong>Redis</strong><br>
<sub>Queue backend</sub>
</td>
</tr>
</table>

### `01` Shopify Configuration

1. **Create development store** at partners.shopify.com
2. **Navigate to** Settings → Apps and sales channels → Develop apps  
3. **Create private app** with permissions:
   - `read_customers`
   - `read_orders` 
   - `read_products`
   - `read_customer_events`(optional - bonus)
4. **Copy API credentials** (store URL and access token)

### `02` Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env

# Generate Prisma client and setup database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

#### Backend (.env)
```bash
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL="http://localhost:3000"

# Queue System
REDIS_URL="redis://localhost:6379"

# Webhook Base URL
WEBHOOK_BASE_URL="https://your-backend-server-url"
```

### `03` Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local

# Start development server
npm run dev
```

#### Frontend (.env.local)
```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Application URLs

**Backend API:** `http://localhost:3001`  
**Frontend:** `http://localhost:3000`

## API Reference
*RESTful endpoints for seamless integration*

### GET Endpoints

<table>
<tr>
<th>Endpoint</th>
<th>Description</th>
</tr>
<tr>
<td><code>/api/sync/status</code></td>
<td>Check sync job status</td>
</tr>
<tr>
<td><code>/api/dashboard/stats</code></td>
<td>Basic statistics</td>
</tr>
<tr>
<td><code>/api/dashboard/orders-by-date</code></td>
<td>Orders by date range</td>
</tr>
<tr>
<td><code>/api/dashboard/top-customers</code></td>
<td>Top 5 customers</td>
</tr>
<tr>
<td><code>/api/customer-events</code></td>
<td>List customer events (filterable)</td>
</tr>
<tr>
<td><code>/api/customer-events/stats</code></td>
<td>Get customer event statistics</td>
</tr>
<tr>
<td><code>/api/webhooks/test</code></td>
<td>List available webhook endpoints (test endpoint)</td>
</tr>
</table>

### POST Endpoints

<table>
<tr>
<th>Endpoint</th>
<th>Description</th>
</tr>
<tr>
<td><code>/api/auth/register</code></td>
<td>Register new tenant</td>
</tr>
<tr>
<td><code>/api/auth/login</code></td>
<td>Authenticate tenant</td>
</tr>
<tr>
<td><code>/api/shopify/sync</code></td>
<td>Sync Shopify data</td>
</tr>
<tr>
<td><code>/api/sync/auto</code></td>
<td>Trigger auto sync (GitHub Actions)</td>
</tr>
<tr>
<td><code>/api/customer-events</code></td>
<td>Create a customer event</td>
</tr>
<tr>
<td><code>/api/webhooks/shopify/checkouts/update</code></td>
<td>Shopify checkout update webhook</td>
</tr>
<tr>
<td><code>/api/webhooks/shopify/orders/create</code></td>
<td>Shopify order created webhook</td>
</tr>
<tr>
<td><code>/api/webhooks/shopify/carts/update</code></td>
<td>Shopify cart update webhook</td>
</tr>
<tr>
<td><code>/api/webhooks/shopify/checkouts/create</code></td>
<td>Shopify checkout started webhook</td>
</tr>
</table>

> Note: Protected endpoints require a valid JWT in the `Authorization: Bearer <token>` header. Public webhooks expect Shopify HMAC verification and use raw body parsing.

## Database Schema
*Multi-tenant architecture with proper data isolation*

<table>
<tr>
<td>
<strong>tenants</strong><br>
<sub>Store credentials</sub>
</td>
<td>
<strong>customers</strong><br>
<sub>Customer data</sub>
</td>
<td>
<strong>products</strong><br>
<sub>Product catalog</sub>
</td>
<td>
<strong>orders</strong><br>
<sub>Order details</sub>
</td>
</tr>
<tr>
<td>
<strong>customer_events</strong><br>
<sub>Customer event tracking</sub>
</td>
<td>
<strong>webhook_logs</strong><br>
<sub>Webhook event logs</sub>
</td>
</tr>
</table>

*All tables include `tenantId` for data isolation*

## Deployment
*Production-ready deployment*

<table>
<tr>
<th>Service</th>
<th>Platforms Used</th>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Railway</td>
</tr>
<tr>
<td><strong>Frontend</strong></td>
<td>Vercel</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>Railway PostgreSQL</td>
</tr>
<tr>
<td><strong>Queue</strong></td>
<td>Redis (Railway)</td>
</tr>
<tr>
<td><strong>Cron Job</strong></td>
<td>Github Actions (Workflow)</td>
</tr>
</table>

## Project Limitations & Assumptions:

- Only supports Shopify stores; other e-commerce platforms are not integrated.
- All prices and analytics are assumed to be in the same currency.
- Email/password authentication is used; no OAuth or SSO.
- Simple UI to visualize ingested data.
- Manual sync is available, but auto-sync runs every 6 hours via GitHub Actions (not real-time).
- Background jobs and queue processing require a running Redis instance.
- Webhook verification expects Shopify HMAC; other webhook sources are not supported.
- Multi-tenancy is enforced at the database level, but UI does not support organization-level roles.
- Assumes tenants have correct API permissions set in Shopify.

**Xeno FDE Internship Assignment 2025,**
*Thank you so much for giving me this opportunity.*

*Made by Harsh Bhardwaj*  
*Let's connect on [LinkedIn](https://linkedin.com/in/harshb-14)*
