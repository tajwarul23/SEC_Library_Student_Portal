# SEC Library — Student Portal

Student-facing frontend for the SEC Library system: browse/search books, reserve, join waitlists, view issued books, notifications, and research papers. Talks to the real backend in `SEC_LIBRARAY_BACKEND`.

## Run locally

**Prerequisites:** Node.js, and the backend (`SEC_LIBRARAY_BACKEND`) running (default `http://localhost:5000`).

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `VITE_API_URL` to the backend's URL if it differs from the default.
3. Run the dev server: `npm run dev`

The backend's CORS allowlist must include this app's dev origin (`STUDENT_CLIENT_URL` in the backend's `.env`, default `http://localhost:5173`).
"# SEC_Library_Student_Portal" 
