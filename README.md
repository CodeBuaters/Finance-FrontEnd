# FinSight Frontend

React + TypeScript frontend for the **FinSight** personal finance dashboard.

The frontend provides a modern dashboard for viewing personal income, expenses, budgets, and imported bank transactions.

## Tech Stack

* React 19
* TypeScript
* Vite
* React Router
* Axios
* Material UI (or Tailwind CSS)
* Recharts

## Features (MVP)

* User authentication pages.
* Dashboard with financial summary.
* Expense charts and statistics.
* Transaction list with filters.
* CSV import page.
* Budget overview.
* Profile and settings page.

## Project Structure

```text
src
├── assets
├── components
├── layouts
├── pages
├── services
├── hooks
├── context
├── types
├── utils
└── router
```

## Getting Started

### 1. Clone repository

```bash
git clone <repository-url>
cd finsight-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env` in the project root.

```env
VITE_API_URL=http://localhost:8080/api
```

### 4. Start development server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

## Planned Pages

| Page         | Description                   |
| ------------ | ----------------------------- |
| Login        | User login page               |
| Register     | User registration             |
| Dashboard    | Financial overview and charts |
| Transactions | View and edit transactions    |
| Import CSV   | Upload bank transactions      |
| Budgets      | Monthly budgets               |
| Settings     | User profile and preferences  |

## Planned Dashboard Components

* Balance Card
* Monthly Income Card
* Monthly Expenses Card
* Savings Card
* Expense Pie Chart
* Monthly Spending Bar Chart
* Budget Progress Cards
* Recent Transactions Table

## API Communication

Axios is used for communicating with the backend.

Example structure:

```text
services/
├── authService.ts
├── transactionService.ts
├── dashboardService.ts
└── budgetService.ts
```

Authentication uses JWT tokens stored in the browser.

## UI Design

Design goals:

* Clean fintech-inspired interface.
* Responsive desktop-first layout.
* Accessible components.
* Consistent spacing and typography.
* Emerald green primary accent.

## Development Workflow

* Create feature branches from `develop`.
* Submit Pull Requests for review.
* Keep components reusable.

Example component folders:

```text
components/
├── dashboard/
├── transactions/
├── budgets/
├── navigation/
└── common/
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Lint project
```

## Team

**FinSight** — Software Project 2 (Haaga-Helia UAS)

Frontend repository maintained by the FinSight development team.

