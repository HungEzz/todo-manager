# Todo List Frontend

A modern, responsive, and performance-optimized React interface built on the Next.js framework for managing user todo items.

---

## 🔍 Overview

This frontend application communicates with the backend REST API to display, create, modify, and delete tasks. It features debounced search inputs, pagination controls, server-side filters, and custom CSS-based strike-through animations. To guarantee a premium user experience, optimistic state updates are implemented to give immediate feedback to the user on toggle and delete operations.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS (Custom utilities and animations)
- **Linter**: ESLint

---

## 📂 Folder Structure

```text
frontend/
├── app/
│   ├── globals.css         # Custom CSS animations and global style themes
│   ├── layout.tsx          # Root HTML layout and font setup
│   └── page.tsx            # Main dashboard component and state coordination
├── components/
│   ├── TaskForm.tsx        # Add task inline panel (expandable)
│   ├── TaskItem.tsx        # Single task item display, edit form, and status toggle
│   └── TaskList.tsx        # Lists task items or displays loading/error states
├── lib/
│   ├── api.ts              # Custom Fetch API wrapper with error sanitization
│   └── taskApi.ts          # Backend API services endpoint definitions
├── types/
│   └── task.ts             # Shared TypeScript models and enum types
├── Dockerfile              # Production container build definition
└── package.json
```

---

## ⚙️ Environment Variables

The application requires the following environment variable to locate the API server. Create a file named `.env.local` in the `frontend` root:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🚀 Installation

Ensure you have [Node.js](https://nodejs.org/) installed on your local machine.

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependency packages:
   ```bash
   npm install
   ```

---

## 💻 Run Development

To launch the local development server:

```bash
npm run dev
```

The application will run on [http://localhost:3000](http://localhost:3000). The development server supports Hot Module Replacement (HMR).

---

## 🏗️ Build Production

To build a production bundle:

```bash
npm run build
```

This compiles TypeScript, optimizes Tailwind CSS classes, and outputs a production-optimized build inside the `.next` folder.

To run the built production bundle locally:

```bash
npm run start
```

---

## 🧹 Lint

To scan the codebase for code quality issues and ESLint rule violations:

```bash
npm run lint
```

---

## ✨ Features

- **Debounced Search**: Input triggers API search parameters with 350ms delays to prevent server request overload.
- **Optimistic State Sync**: Update toggles and deletion occur instantly on client lists; network failures automatically roll back the UI states gracefully and display an error warning banner.
- **Responsive Layout**: Adapts gracefully to desktop dashboards and mobile interfaces.
- **A11y Compliant**: Focused visibility rings added for full accessibility using keyboard tab keys.

---

## 📸 Screenshots

### Mobile View

![Mobile Interface](../docs/screenshots/mobile-view.png)

---

## 📝 Notes

- Ensure the backend server is running and accessible at the URL defined in `NEXT_PUBLIC_API_URL`.
- Make sure that the backend CORS configuration allows headers and requests originating from the frontend host client.
