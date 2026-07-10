# Network Identifier

A web application that identifies applications by their network signatures and visualizes real-time packet capture statistics.

## Purpose

The app analyzes network traffic data and maps packets to known applications (YouTube, Spotify, Netflix, etc.) using DNS keyword signature rules. It provides a dashboard showing which apps are consuming network bandwidth, broken down by L4 protocol (TCP, UDP, ARP, etc.).

## How It Works

- **Signature rules** — DNS keywords (e.g., `youtube\.com`) are mapped to application names. When a packet's DNS query matches a keyword, it's attributed to that app.
- **Packet statistics** — The backend aggregates packet counts per application per protocol and exposes them via REST API.
- **Real-time dashboard** — The frontend polls the API every 5 seconds and renders a stacked bar chart, stat cards, and a rule management UI.

## Architecture

```
Network-Identifier.API/       ASP.NET Web API
Network-Identifier.Client/    React + TypeScript + Vite frontend
Network-Identifier.Core/      Shared domain models and interfaces
```

### Frontend (Client)

Built with **React 19**, **TypeScript 6**, **Vite 8**, and **Tailwind CSS 4**. Key libraries:

- **TanStack React Query** — data fetching, caching, polling, mutations
- **React Router** — client-side routing (/, /config, /dashboard)
- **Recharts** — stacked bar chart for packet statistics
- **react-icons (Fa6)** — application icons in charts and rule grids

See `Network-Identifier.Client/README.md` for full details.

## Getting Started

```bash
# Start the backend (from Network-Identifier.API)
dotnet run

# Start the frontend (from Network-Identifier.Client)
cd Network-Identifier.Client
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to `http://localhost:5055`.
