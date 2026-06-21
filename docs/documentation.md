# MiniHotel Audit and Testing Documentation

This document records the design decisions, vulnerability resolutions, and testing architecture implemented during the system audit and modernization phase.

## 1. Vulnerability & Dependency Resolution

Prior to the audit, `npm audit` flagged 11 vulnerabilities (moderate to high severity) in the frontend project. The resolution was blocked by ESLint peer dependency mismatches with `eslint-config-next@16.1.6`.

### Actions Taken:
- **ESLint Upgrade**: Upgraded `eslint` from `8.57.1` to `9.17.0` to resolve peer dependency issues with Next.js configuration.
- **PostCSS Override**: Added a npm package override in `package.json` to force nested dependencies to resolve `postcss` to version `^8.5.10` or higher, removing the critical DoS/XSS risks.
- **NPM Configuration**: Added a `.npmrc` file with `legacy-peer-deps=true` to automatically handle React 19 / `vaul` peer conflicts during local installations.
- **Audit Verification**: Cleaned up all other dependencies. `npm audit` now reports **0 vulnerabilities**.

## 2. ESLint Flat Config Migration

ESLint 9 uses the new Flat Configuration format (`eslint.config.js`) by default.
- Removed legacy `.eslintrc.json`.
- Implemented `eslint.config.js` with directory ignoring (`.next/`, `node_modules/`, `out/`, `build/`) to guarantee rapid verification checks during automated builds.
- Verified syntax integrity and formatting via `npm run lint` and Turbopack builds, which now compile cleanly.

## 3. Testing Architecture (Vitest & JSDOM)

To establish a resilient component regression test suite, we set up Vitest in the frontend:
- **`vitest.config.ts`**: Configures Vitest with the `@vitejs/plugin-react` compiler, `jsdom` testing environment, and alias mapping (`@/` -> `./`).
- **`__tests__/setup.ts`**:
  - Automatically imports `@testing-library/jest-dom` for robust matchers.
  - Mocks `next-intl` (`useTranslations`) to translate labels into descriptive fallback paths.
  - Mocks Next.js navigation hooks (`useRouter`, `usePathname`, `useParams`).
  - Mocks standard browser API definitions missing in JSDOM (`ResizeObserver`, `window.matchMedia`).

## 4. Component Testing Suite

We implemented comprehensive unit tests for all custom components under `frontend/components/`:

1. **`AppSidebar`**: Checks links rendering, title translation hooks, and triggers the `logout` action on click.
2. **`AutoLogoutManager`**: Tests timing configurations, reset events (`mousemove`), and authentication boundaries via fake timer ticks.
3. **`BookingForm`**: Validates form schema, API integration (`api.calculateRate`), capacity warning banner rendering, and structured submissions.
4. **`I18nAuditLoader`**: Tests directory-scanning logic, JSON dictionary flattening, and missing-key detection in development environments.
5. **`I18nAudit`**: Verifies translation issues popup displaying missing keys.
6. **`ThemeProvider`**: Assures child inclusion and wrapper propagation.
7. **`api`**: Fixes backend endpoint mocking for paginated bookings.

## 5. Demo Mode Architecture & Interception

We implemented a client-side Demo Mode to allow the frontend to run fully standalone in the browser without any backend process.

### Components Implemented:
- **`lib/local-db.ts`**: Implements a browser `localStorage` mock database mimicking Flask backend endpoints, including relational object nesting (injecting room and guest objects into booking payloads) and dynamic occupancy statistics.
- **`lib/api.ts` Fetch Interceptor**: Monkey-patches browser `window.fetch` at initialization time if `process.env.NEXT_PUBLIC_DEMO_MODE === 'true'`. It intercepts all `/api/` calls and redirects them to `handleDemoFetch` in `local-db.ts`.
- **`DemoBadge`**: Renders a pulse-animated red badge at the top-right corner to indicate active Demo Mode.
- **`VersionIndicator`**: Renders a fixed bottom-left component dynamically displaying the current project version parsed from `CHANGELOG.md` via a Next.js server action.
- **`PrivacyPolicy`**: Displays user data rights and GDPR compliance warnings, tailored for browser storage when demo mode is active.
- **`ChangelogViewer`**: Parses root `CHANGELOG.md` and displays entries via a paginated full-width dashboard component with a history slider and pagination controls situated at the top to prevent layout shifts. Excludes non-version metadata chunks from rendering.
- **Joke Languages**: Updated translations in mock locales (`lc`, `pr`, `sh`) for the changelog to match their respective humorous themes.
- **`__tests__/` Unit Tests**: Created Vitest files confirming correct state routing, conditionally rendering UI elements, and paginating changelog chunks.

## 6. Environment Configurations
- **Template Setup (`.env.example` & `.env`)**: Defined `NEXT_PUBLIC_DEMO_MODE`, `NEXT_PUBLIC_API_URL`, and `NEXT_PUBLIC_BASE_URL` to configure frontend build-time endpoints dynamically.
- **Backend Port Mapping**: Updated backend `main.py` entrypoint to resolve the runtime `PORT` environment variable, enabling custom port binding.
- **Centralized Fallbacks**: Refactored `api.ts` and `local-db.ts` to dynamically resolve endpoints via process environment parameters with clean fallbacks.

## 7. Responsive Layouts & Breakpoints
- **Mobile Grid Adaptations**: Replaced hardcoded grid layouts in the Booking Form, Rates Page, Services Page, and Clients Page with `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` wrappers to support small-screen devices.
- **Scrollable Data Tables**: Wrapped tabular structures on Housekeeping and Audit Logs pages with `overflow-x-auto` blocks, preventing horizontal overflow on tablets and phones.

## 8. UI Consistency & Alignment
- **Sidebar Integration**: Synced the height and vertical alignment of `SidebarHeader` to match the `h-16` height of the main dashboard navigation header.
- **Demo Mode Badge Styling**: Cleaned up the large dashed demo mode border, positioning a purple `Demo Mode` indicator watermark at the bottom-right corner.
- **Version Indicator Alignment**: Shifted the version indicator to the bottom-right corner, aligning it directly above the Demo Mode indicator (if active) or in its place (if inactive).
- **Changelog Layout Overhaul**: Standardized the container design of the Changelog viewer page to render as a fully integrated dashboard page component, separating page headers from core content card blocks. The pagination and slider controls are positioned at the top of the card (above the scrollable content) to avoid vertical shifts from entries of varying heights. Additionally, the component uses programmatic scroll resetting (via a React ref and `useEffect`) rather than a wrapper key to ensure clean transitions to the top of new entries without layout reflows or flickering.


