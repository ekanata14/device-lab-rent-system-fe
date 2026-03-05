# 3D Prototype Lab Frontend

This Next.js Application implements the main UI and operational dashboards for managing 3D printers, reservations, and configurations. It is designed to consume data from the REST API rather than an internal interval mock.

## Technologies Used

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- shadcn/ui custom components

## Connecting to Backend

The app relies on the `NEXT_PUBLIC_API_URL` environment variable to locate its datastore backend APIs. If none is provided, it defaults to querying `http://localhost:3001/api`.
The backend handles operations like auto-cycling statuses from `buffer` to `available`.

## Running

```bash
npm install
npm run dev
```

Visit the frontend dashboard to monitor overall availability, inspect logs history, or update lab hours.
