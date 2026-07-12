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

### Backend (API & Core)
Built with ASP.NET Core 9, SharpPcap, and PacketDotNet. Key components:

- **ASP.NET Core Web API** — exposes packet statistics and rule management endpoints
- **SharpPcap** — live network capture and offline .pcap/.pcapng file analysis
- **PacketDotNet** — packet parsing and protocol extraction (Ethernet, IPv4/IPv6, TCP, UDP, ARP)
- **BackgroundService** — continuously captures or analyzes packets in the background
- **ConcurrentDictionary** — thread-safe storage for packet statistics and application rules

## Prerequisites

- .NET 9 SDK
- Node.js (v20+ recommended)
- Npcap (required by SharpPcap for live capture on Windows)
- A supported network interface with capture permissions
## Getting Started

Before starting the backend, configure Network-Identifier.API/appsettings.json.

### Live packet capture

The configured interface name must match an available capture device on the machine. 
Use a network capture tool or SharpPcap device listing to find the correct interface name.
Set the preferred network interface and leave the capture file path empty:
```
"Capture": {
  "PreferredInterface": "Microsoft Wi-Fi Direct Virtual Adapter"
},
"CaptureSettings": {
  "CaptureFileLocation": ""
}
```
### Offline capture analysis

Set CaptureFileLocation to the relative path of a .pcap or .pcapng file inside the API project (for example Captures/Capture1.pcapng):
```
"Capture": {
  "PreferredInterface": "Microsoft Wi-Fi Direct Virtual Adapter"
},
"CaptureSettings": {
  "CaptureFileLocation": "Captures/Capture1.pcapng"
}
```
***When CaptureFileLocation is specified, the backend analyzes the capture file instead of starting live packet capture.***

### Commands for starting

```bash
# Start the backend (from Network-Identifier.API)
dotnet run

# Start the frontend (from Network-Identifier.Client)
cd Network-Identifier.Client
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to `http://localhost:5055`.
