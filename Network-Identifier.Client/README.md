# Network Identifier Client

Frontend for the Network Traffic Analysis tool.

## Frameworks & Libraries

### Core
- **React 19** — UI library
- **TypeScript 6** — type-safe language
- **Vite 8** — build tool and dev server
- **Tailwind CSS 4** — utility-first CSS framework

### Routing
- **react-router-dom 7** — client-side routing (`createBrowserRouter`, `<Link>`)

### API & Data Fetching
- **@tanstack/react-query 5** — server-state management (`useQuery`, `useMutation`, polling via `refetchInterval`, query invalidation)

### Charts
- **Recharts 3** — stacked bar chart (`BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`) for packet statistics visualization

### Icons
- **react-icons 5** — Font Awesome 6 (`react-icons/fa6`) for application icons (YouTube, Spotify, etc.) with fallback to a question-mark icon

## Testing

- **Vitest** — test runner (Vite-native, configured in `vite.config.ts`)
- **@testing-library/react** — component rendering and interaction testing
- **@testing-library/jest-dom** — DOM matchers (`toBeInTheDocument`, etc.)
- **@testing-library/user-event** — realistic user interaction simulation
- **jsdom** — DOM environment for tests

### Running tests

```bash
npm test        # single run
npm run test:watch  # watch mode
```

### Test coverage

| Area | File | Tests |
|---|---|---|
| Constants | `constants/__tests__/theme.test.ts` | 3 — PROTOCOL_COLORS shape & values |
| Utilities | `components/common/__tests__/iconUtils.test.tsx` | 7 — icon mapping, case-insensitivity, fallback, classNames |
| Components | `components/config/__tests__/RuleForm.test.tsx` | 6 — form rendering, submission, success/error, input clearing |
| Components | `components/config/__tests__/RulesGrid.test.tsx` | 6 — loading, empty, error, populated, icons |
| Components | `components/dashboard/__tests__/DashboardStats.test.tsx` | 4 — loading, totals, empty state |
| Components | `components/dashboard/__tests__/PacketChart.test.tsx` | 5 — loading, error, empty, chart rendering, bars |
| Components | `components/dashboard/__tests__/StackedTooltip.test.tsx` | 9 — active/inactive, protocols, totals, formatting |
| Hooks | `hooks/__tests__/usePacketStatistics.test.ts` | 6 — data transformation, filtering, sorting |
| Hooks | `hooks/__tests__/useSignatureRules.test.ts` | 7 — GET/POST endpoints, payload shape, types |
| Pages | `__tests__/App.test.tsx` | 2 — title, navigation links |
| Pages | `pages/__tests__/Config.test.tsx` | 3 — form, grid, layout |
| Pages | `pages/__tests__/Dashboard.test.tsx` | 3 — title, subtitle, child components |

## Project Structure

```
src/
├── App.tsx                        # Landing page
├── main.tsx                       # Entry point (router + QueryClient)
├── index.css                      # Tailwind import
│
├── components/
│   ├── common/
│   │   └── iconUtils.tsx          # App-to-icon mapping utility
│   ├── config/
│   │   ├── RuleForm.tsx           # Create rule form
│   │   └── RulesGrid.tsx          # Active rules grid
│   └── dashboard/
│       ├── DashboardStats.tsx     # Summary stat cards
│       ├── PacketChart.tsx        # Stacked bar chart (Recharts)
│       └── StackedTooltip.tsx     # Custom chart tooltip
│
├── constants/
│   └── theme.ts                   # Protocol color palette
│
├── data/
│   └── appIcons.json              # App name -> icon name mapping
│
├── hooks/
│   ├── usePacketStatistics.ts     # Fetches packet data (polls every 5s)
│   └── useSignatureRules.ts       # Fetches & creates signature rules
│
├── pages/
│   ├── Config.tsx                 # Rule management page
│   └── Dashboard.tsx              # Statistics dashboard page
│
└── types/
    ├── network.ts                 # ChartData, QueryResult
    └── rules.ts                   # SignatureRulePayload, RulesData
```

## Dev Proxy

Vite proxies `/api` requests to `http://localhost:5055` (configured in `vite.config.ts`).
