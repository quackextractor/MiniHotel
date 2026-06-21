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

## 9. Privacy Policy Specificity & Settings UX (v0.9.4)

Based on user review feedback documented in `docs/review.md`:

### Privacy Policy Improvements
- Replaced generic first-person plural (`we`, `us`, `our`) with singular (`I`, `my`) throughout `PrivacyPolicy.tsx`.
- Expanded GDPR section from a vague two-sentence description to concrete, MiniHotel-specific language: guest profiles (names, emails, phones), booking schedules, room configurations, seasonal rates, service orders, and action audit logs.
- Added a **Go Back** button in a `CardFooter` at the bottom of the Privacy Policy card, using `useRouter().back()` from `@/i18n/routing`.

### Settings Page UX Fixes
- Added a **Save Settings** button at the top-right of the Settings page header. This resolves the UX issue where the floating `VersionIndicator` and `DemoBadge` components at the bottom-right covered the only save button.
- Added `pb-24` bottom padding to the Settings form container to ensure the bottom save button remains accessible even when floating indicators are present.
- Added a **Privacy & GDPR** card at the bottom of the Settings grid, containing a `View Privacy Policy` button that routes to `/privacy`. This gives users direct access to the policy from within the settings screen.

### Test Suite Updates
- Updated `__tests__/PrivacyPolicy.test.tsx` with three tests: demo mode rendering, production mode rendering, and Go Back button navigation using a mocked `useRouter`.
- Added `@/i18n/routing` mock to `__tests__/setup.ts` as a shared global mock for all test files.

## 10. Unauthenticated Navigation, Storage Reset, Global Versioning & Calendar Bookings (v0.10.0)

Based on the final specifications in `docs/review.md`, the following changes were made to complete all remaining system review items:

### Language Switcher on Login/Registration
- Created a standalone `LanguageSwitcher.tsx` component (`components/LanguageSwitcher.tsx`) that reads and switches locales using client-side React controls, utilizing the static array of supported languages `['en', 'cs', 'de']` from `@/i18n/routing`.
- Placed the dropdown select absolutely in the top-right corner, allowing unauthenticated users to switch display language on the login and register cards before entering the application.

### Clear Memory in Demo Mode
- Integrated a new "Clear Demo Data" button into the System Management section of the settings form (`settings-form.tsx`), controlled dynamically by the `NEXT_PUBLIC_DEMO_MODE` environment variable.
- On click, it loops through a predefined array of 11 specific localStorage keys (`demo_rooms`, `demo_guests`, `demo_bookings`, `demo_housekeeping`, `demo_maintenance`, `demo_contacts`, `demo_seasonal_rates`, `demo_services`, `demo_room_groups`, `demo_audit_logs`, `demo_users`) and removes them via `localStorage.removeItem(key)` before triggering `window.location.reload()`. This resets the mock database without wiping critical user configuration parameters (e.g. active color themes).

### Global Version Indicator
- Relocated the `VersionIndicator` component from the internal dashboard dashboard layout (`dashboard/layout.tsx`) to the global root layout (`app/[locale]/layout.tsx`).
- It resolved the limitation where version details were not floating above registration pages, login screens, or error pages. The version is calculated via a server-side action (`getLatestVersion()`) and rendered once globally.

### Privacy Policy Navigation on Authentication screens
- Imported Next-intl `Link` from `@/i18n/routing` into `login/page.tsx` and `register/page.tsx`.
- Embedded the Privacy Policy link inside the card footer (`<CardFooter>`) centered underneath the primary call-to-actions, styled with responsive hover-underline aesthetics.

### Direct Booking Creation via Empty Calendar Space Click
- Implemented `isAddDialogOpen` and `newBookingData` states inside the main calendar viewer page (`calendar/page.tsx`).
- Integrated click listeners onto empty background grid cell container elements. Clicking a vacant slot constructs check-in parameters, formats dates into standard ISO format (`YYYY-MM-DD`), maps the corresponding room ID, and renders a booking modal.
- Passed initial payload mapping to the `<BookingForm>` element's `initialData` property, allowing rapid booking placement without manual field inputs.

### Unit Testing & Coverage
- Implemented five new testing files to verify all five implementations:
  - `LanguageSwitcher.test.tsx` checking layout, locale parsing, and routing hooks.
  - `login-page.test.tsx` and `register-page.test.tsx` verifying language select and policy link layouts.
  - `settings-form.test.tsx` confirming that data purge is hidden in production mode, visible in demo mode, and targets only the correct database keys.
  - `calendar-page.test.tsx` verifying grid renders, empty cell click opens the booking form pre-populated with dates, and triggers correct submission parameters.
- Extended the global `next-intl` stub in `__tests__/setup.ts` to include `useLocale` to avoid peer-dependency mocking conflicts.

