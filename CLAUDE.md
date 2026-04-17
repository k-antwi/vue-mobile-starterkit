# What This App Is

LifeNav is a mobile-first life planning app (tagline: "Navigate your life with purpose"). Users capture **Destinations** (tasks/items), organize them into **Chunks**, build **Routes** (goal journeys with steps), and track **Journeys** (timed executions of routes). Users also manage **Characters** (personal roles/identities across life areas). Google Gemini provides AI assistance for route discovery.

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI Framework | React 19 + Framework7 9 + Konsta 5 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS 4 + custom theme (`styles/theme.css`) |
| Routing | Framework7 router (`routes.ts`) |
| State | React Context API — no Redux/Zustand |
| Database (client) | WA-SQLite via PowerSync (`@powersync/web`) |
| Sync | PowerSync 1.8 ↔ Supabase (offline-first) |
| Auth & Backend | Supabase |
| HTTP | Axios |
| AI | Google Gemini (`@google/genai`) |
| Native | Capacitor 8 (iOS + Android) |
| PWA | Vite PWA Plugin (auto-update) |
| Error Tracking | Sentry 10 |
| Build | Vite 6 |
| Testing | Vitest 4 + Testing Library React + JSDOM |

---

## Project Structure

```
mobile/
├── index.tsx              # Entry — Sentry init, React mount
├── App.tsx                # Root — provider stack, Framework7 App, TabBar
├── routes.ts              # Framework7 route definitions (8 routes)
├── vite.config.ts
├── capacitor.config.json  # App ID: com.lifenav.app
├── pages/
│   ├── Auth/              # Login, Signup, Welcome
│   ├── Stream/            # Capture/inbox (Destinations, Chunks)
│   ├── Routes/            # Route management + RouteDiscoveryWizard/
│   ├── Drive/             # User progression & trophies
│   └── InTheWild/         # Community features
├── components/            # Shared UI components
├── context/               # AuthContext, PowerSyncContext, NetworkContext, ReminderContext, FabContext
├── services/
│   ├── api.ts             # All data operations (large — ~46KB)
│   ├── NotificationService.ts
│   ├── PushNotificationService.ts
│   └── ReminderService.ts
├── lib/
│   ├── supabase.ts
│   ├── database.types.ts  # Generated Supabase types (do not edit manually)
│   └── powersync/         # AppSchema, SupabaseConnector
├── hooks/                 # Custom React hooks
├── types/index.ts         # Core domain types
├── tests/                 # Vitest tests (21 files)
├── supabase/
│   ├── migrations/
│   └── functions/         # Edge functions (save-subscription, send-reminders, subscribe)
└── public/
    └── sw-push.js         # Service worker for push notifications
```

---

## Commands

```bash
npm run dev        # Dev server on http://localhost:3000
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm test           # Vitest in watch mode
npm run test:run   # Vitest single run (CI)
```

After `npm run build`, use Capacitor CLI to sync to iOS/Android:
```bash
npx cap sync
npx cap open ios    # or android
```

---

## Environment Variables

Copy `.env.example` → `.env`. All client-side vars must be prefixed `VITE_`.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_POWERSYNC_URL=
VITE_VAPIR_PUBLIC_KEY=       # Web Push VAPID public key
VITE_SENTRY_DSN=
SENTRY_AUTH_TOKEN=           # Build-time only (source map upload)
SENTRY_ORG=
SENTRY_PROJECT=
GEMINI_API_KEY=              # Exposed via vite.config.ts define
```

---

## Key Architectural Patterns

### Data Layer — `services/api.ts`


### Offline-First Sync
- **PowerSyncContext** initializes the PowerSync client and monitors network state.
- The app stays fully functional offline using the local SQLite database.
- When online, PowerSync syncs automatically with Supabase.
- Multi-device updates use Supabase Realtime broadcast channels. Each device has a `deviceId` to avoid self-broadcast loops.

### Authentication
- **AuthContext** wraps the entire app with Supabase auth state.
- Unauthenticated users are redirected to `/login/`.
- Auth state changes are watched via `supabase.auth.onAuthStateChange`.

### Provider Stack (App.tsx)
```
NetworkProvider
  └── AuthProvider
        └── PowerSyncProvider
              └── ReminderProvider
                    └── KonstaProvider
                          └── App UI
```

### Routing
Framework7 router is used (not React Router DOM). Navigate programmatically with:
```ts
f7.views.main.router.navigate('/routes/')
```
Routes are defined in `routes.ts` and map to page components.

### Notifications & Reminders
- **ReminderService**: Schedules reminders at frequencies (once, daily, weekdays, custom intervals).
- **NotificationService**: Uses Capacitor Local Notifications for native push.
- **PushNotificationService**: Web Push with VAPID keys for PWA.
- Supabase Edge Functions (`send-reminders`) handle scheduled server-side delivery.

### AI — Google Gemini
<!-- Used in `RouteDiscoveryWizard` to help users create routes. Access via `@google/genai` with `GEMINI_API_KEY`. -->

---


Database types in `lib/database.types.ts` are auto-generated from Supabase — do not edit manually.

---

## Native (Capacitor)

- **App ID**: `com.lifenav.app`
- **Web dir**: `dist/` (Vite output)
- Splash screen: 3s duration, teal background `#00bfbf`, no spinner
- Plugins used: App, Keyboard, StatusBar, SplashScreen, Haptics, LocalNotifications, Network
- iOS project in `ios/`, Android project in `android/`

---

## Testing

Tests live in `tests/`. Run with `npm test` (watch) or `npm run test:run` (CI).

`tests/setup.ts` mocks Supabase and localStorage. When adding tests, mock PowerSync if needed — do not rely on real network calls in unit tests.

---

## Things to Know

- Framework7 handles transitions and mobile gestures — do not add browser-style `<a>` navigation.
- `lib/database.types.ts` is generated — regenerate via `supabase gen types typescript` after schema changes, never edit by hand.
- The FAB (floating action button) visibility is managed by `FabContext` — pages control it via context, not local state.
- Tailwind 4 is configured via CSS (`@import "tailwindcss"`) not `tailwind.config.js`.
- Sentry is initialized in `index.tsx` before the React tree — keep it there.
