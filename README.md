# MentorBoard 🎯

> A fully frontend internship collaboration dashboard built with React + TypeScript + Vite. No backend required — all data is stored in localStorage.

## Features

- **🔐 Auth (mocked):** Login as Intern or Mentor with demo accounts. Uses localStorage via Zustand persist middleware.
- **📋 Task Kanban Board:** Drag-and-drop columns (To Do / In Progress / Blocked / Done). Create, edit, and delete tasks. Full DnD kit integration.
- **📅 Daily Standup:** Post daily updates with mood tracking. Timeline view of past standups.
- **💬 Feedback Threads:** Per-task threaded comments. Reply to comments. Delete your own.
- **📊 Progress Analytics:** Completion rate, standup streak, weekly activity bar chart, tasks by status (donut chart), tasks by priority.
- **🌙 Dark Mode:** Respects system preference, toggleable, persisted in localStorage.
- **♿ Accessible:** ARIA roles, keyboard navigation, focus indicators, semantic HTML.

## Optimistic UI

When a task is **dragged** to a new column, `moveTask()` in the Zustand store is called **immediately** on drag end — before any "confirmation". Since there is no backend, the UI never waits or reverts. In a real app with a server, you would:
1. Update local state first (optimistic)
2. Fire the API request
3. Revert if the request fails

This pattern is implemented in `src/features/tasks/KanbanBoard.tsx` in the `handleDragEnd` callback.

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI + type safety |
| Vite | Build tool + dev server |
| Tailwind CSS | Utility-first styling |
| Zustand (persist) | State management + localStorage |
| React Router v6 | Client-side routing |
| @dnd-kit | Kanban drag-and-drop |
| React Hook Form + Zod | Forms + validation |
| Recharts | Analytics charts |
| Vitest + RTL | Unit + component testing |

## Architecture

```
src/
  features/
    auth/         # Login page + mock users
    tasks/        # Kanban board, task cards, columns, form
    standups/     # Daily standup form + timeline
    feedback/     # Per-task comment threads
    analytics/    # Charts, stats, streaks
  components/     # Shared: Button, Modal, Card, Navbar
  hooks/          # useLocalStorage, useDarkMode
  store/          # Zustand stores: auth, task, standup, feedback
  types/          # TypeScript interfaces
  router/         # React Router config
  tests/          # Vitest + RTL tests
```

## Setup

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build
npm run test      # Run tests
npm run preview   # Preview production build
```

## Demo Accounts

| Name | Email | Role |
|------|-------|------|
| Alex Chen | intern@mentorboard.dev | Intern |
| Jamie Park | intern2@mentorboard.dev | Intern |
| Sam Rivera | mentor@mentorboard.dev | Mentor |

Click any demo account on the login page for instant access.
