# ToolShare

A community-based tool lending and borrowing platform. Share more, own less.

## Features

- **Authentication** — Register, login, logout with localStorage-based demo auth
- **Tool Management** — Add, edit, delete, and view your own tool listings
- **Explore Tools** — Search by name, filter by category, view tool details
- **Borrow Requests** — Request tools with date ranges and messages, track status
- **Lender Management** — Approve or decline incoming borrow requests
- **Ratings & Reviews** — Rate tools 1-5 stars and leave written feedback
- **Dashboard** — Overview of stats and recent activity
- **Profile** — View and edit your personal info

## Demo Credentials

- Email: `alex@demo.com`  |  Password: `demo123`
- Email: `jamie@demo.com` |  Password: `demo123`
- Email: `sam@demo.com`   |  Password: `demo123`

Or create a new account from the register page.

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Tech Stack

- React + Vite
- React Router for navigation
- Lucide React for icons
- localStorage for data persistence (no backend)

## Project Structure

```
src/
├── main.jsx
├── App.jsx              # Routing & layout
├── index.css            # Full design system
├── context/
│   └── AppContext.jsx   # Global state + localStorage sync
├── data/
│   └── initialData.js   # Seed users, tools, requests, reviews
├── components/
│   ├── Sidebar.jsx
│   ├── ToolCard.jsx
│   ├── StarRating.jsx
│   ├── Modal.jsx
│   ├── StatusBadge.jsx
│   ├── EmptyState.jsx
│   ├── Avatar.jsx
│   └── Landing.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Explore.jsx
│   ├── ToolDetail.jsx
│   ├── MyListings.jsx
│   ├── BorrowingRequests.jsx
│   ├── LenderRequests.jsx
│   ├── ListTool.jsx
│   └── Profile.jsx
└── utils/
    └── storage.js       # localStorage helpers
```
