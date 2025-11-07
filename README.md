# Scroll Rack

👉 **[Visit ScrollRack to start tracking your Commander games](https://scrollrack.win/login)**

Scroll Rack is an intuitive, minimal stat tracker for the *Commander* format of *Magic: The Gathering* I made to help players record games, analyse deck performance, and share insights with their friends.

## Gallery
<img width="1346" height="802" alt="Screenshot 2025-09-18 at 3 30 16 PM" src="https://github.com/user-attachments/assets/ad6544ee-1b44-4d29-ae80-729cc79f48ae" />
<img width="1346" height="802" alt="Screenshot 2025-09-18 at 3 28 38 PM" src="https://github.com/user-attachments/assets/615016f6-15fd-400f-87c9-6603e40cc86e" />
<img width="1346" height="802" alt="Screenshot 2025-09-18 at 3 28 29 PM" src="https://github.com/user-attachments/assets/23ab1eaa-b435-40af-b2b5-0fb36f3a560a" />
<img width="1346" height="802" alt="Screenshot 2025-09-18 at 3 29 45 PM" src="https://github.com/user-attachments/assets/e2be54f2-7163-4ba0-a831-b2d2767a211f" />

## Key Features
| Capability | Description |
|------------|-------------|
| **Deck + Game Tracking** | Record wins, losses, streaks, and more for all of your Commander decks |
| **Stat Filtering** | Filter and sort statistics by number of players, date ranges, opponents and other game metrics to easily gain insight into the performance of all your decks
| **Real‑Time Updates** | SignalR and SWR keep all participants’ views synchronised during and after games |
| **Social** | Create a social network by adding friends to share deck stats within your play group
| **Responsive and Accessible UI** | Built with Tailwind CSS, Headless UI and Material components for a polished experience on desktop and mobile |

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | **Next.js 15** (App Router) + **TypeScript** | Modern React framework with type‑safety and server components |
| | **SWR** | Automatic data fetching, caching and revalidation. |
| | Tailwind CSS + Headless UI + Material UI | Utility‑first styling with accessible components |
| **Backend** | **ASP.NET Core 9** (controller‑based Web API) | Backend API server |
| | **PostgreSQL** | SQL data store (hosted on Neon DB) |
| | **SignalR** | Allows real-time upda
tes and reactions to game events by letting server push data to clients through RPCs |
| | **JWT** | Token‑based authentication and authorisation to keep users' claims secure |
| | **OpenAPI + Zod** | Leveraging OpenAPI to automatically generate type‑safe TS client using *openapi‑zod‑client* |
| **Infrastructure** | **Vercel** (frontend) · **Azure App Service** (API) · **Cloudflare** (proxy/CDN) · **Neon** (database) | Minimal cost deployment |
| **Email** | **Mailjet** | Transactional email delivery. |
