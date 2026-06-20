# MiniHotel Audit and Testing Documentation

This document records the design decisions, vulnerability resolutions, and testing architecture implemented during the system audit and modernization phase.

## 1. Vulnerability & Dependency Resolution

Prior to the audit, `npm audit` flagged 11 vulnerabilities (moderate to high severity) in the frontend project. The resolution was blocked by ESLint peer dependency mismatches with `eslint-config-next@16.1.6`.

### Actions Taken:
- **ESLint Upgrade**: Upgraded `eslint` from `8.57.1` to `9.17.0` to resolve peer dependency issues with Next.js configuration.
- **PostCSS Override**: Added a npm package override in `package.json` to force nested dependencies to resolve `postcss` to version `^8.5.10` or higher, removing the critical DoS/XSS risks.
- **Audit Verification**: Cleaned up all other dependencies with `npm audit fix --legacy-peer-deps`. `npm audit` now reports **0 vulnerabilities**.

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

All 22 unit tests run synchronously via `npm run test` and pass with 100% success.
