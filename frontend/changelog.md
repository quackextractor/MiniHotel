# Changelog - Frontend

All notable changes to the MiniHotel frontend are documented here.
Versioning follows [Semantic Versioning 2.0.0](https://semver.org/).

## [0.10.1] - 2026-06-21

### Changed
- Removed all legacy branding and log mentions of `v0`, `[v0]`, and `vercel` across all application levels (Metadata generator, API proxy middleware, proxy matcher, and dashboard page logs).

### Fixed
- Fixed PostCSS XSS vulnerability (`GHSA-qx2v-qp2m-jg93`) by overriding nested sub-dependencies to `postcss@^8.5.10` via `pnpm.overrides` in `package.json`.
- Added unit test file `reports-page.test.tsx` for `ReportsPage` component.

## [0.10.0] - 2026-06-21

### Added
- `LanguageSwitcher` component (`components/LanguageSwitcher.tsx`): client-side locale dropdown using `['en', 'cs', 'de']` from `i18n/routing.ts`, rendered at absolute top-right position.
- `LanguageSwitcher` integrated into `login/page.tsx` and `register/page.tsx` so unauthenticated screens expose locale switching without requiring dashboard access.
- Privacy Policy `Link` added to `CardFooter` of both `login/page.tsx` and `register/page.tsx`, pointing to `/privacy` with `text-muted-foreground hover:underline` styling.
- "Clear Demo Data" button added to System Management card in `settings-form.tsx`, visible only when `NEXT_PUBLIC_DEMO_MODE=true`. Removes all 11 demo localStorage keys (`demo_rooms`, `demo_guests`, `demo_bookings`, `demo_housekeeping`, `demo_maintenance`, `demo_contacts`, `demo_seasonal_rates`, `demo_services`, `demo_room_groups`, `demo_audit_logs`, `demo_users`) while preserving theme settings, then reloads.
- Empty calendar grid cells now accept `onClick` in `calendar/page.tsx`. Clicking an empty cell pre-fills `room_id` and `check_in` (formatted as `YYYY-MM-DD`), sets `isAddDialogOpen` state, and renders an add-booking `Dialog` containing `BookingForm` with `initialData`.
- `handleAddBooking` async handler in `calendar/page.tsx` calls `api.createBooking`, refreshes booking list, and closes dialog on success.
- New Vitest test files: `LanguageSwitcher.test.tsx`, `login-page.test.tsx`, `register-page.test.tsx`, `calendar-page.test.tsx`, `settings-form.test.tsx`.

### Changed
- `VersionIndicator` moved from `dashboard/layout.tsx` to root `app/[locale]/layout.tsx`. All screens (login, register, error pages, dashboard) now display version overlay.
- `dashboard/layout.tsx` no longer imports or calls `getLatestVersion`; version resolution is exclusively in root layout.
- `handleSaveEdit` in `calendar/page.tsx` deduplicated — triple `api.updateBooking` calls reduced to single call.
- Global `next-intl` mock in `__tests__/setup.ts` extended with `useLocale` export to prevent missing mock errors across all test files.

## [0.9.5] - 2026-06-21

### Changed
- Centralized project version into single root `VERSION.txt` file.
- `frontend/app/actions/changelog.ts` `getLatestVersion()` now reads `VERSION.txt` directly instead of parsing `CHANGELOG.md`; falls back to `CHANGELOG.md` parsing if `VERSION.txt` is absent.
- Removed redundant `frontend/version.txt` and `backend/version.txt` files.
- Documented version strategy in `README.md` under new Versioning section.

## [0.9.4] - 2026-06-21

### Added
- Added Privacy & GDPR card to Settings page with direct link to Privacy Policy page.
- Added Save Settings button to Settings page header for immediate visibility, resolving UX issue where Version and Demo badges obscured the bottom save button.
- Added `Go Back` button to Privacy Policy page footer.

### Changed
- Updated Privacy Policy language from `we`/`us`/`our` to first-person `I`/`my`.
- Expanded GDPR section with concrete details specific to MiniHotel: guest profiles, booking schedules, room configurations, service orders, seasonal rates, and audit logs.
- Added `pb-24` bottom padding to Settings page container to prevent floating Version/Demo indicators from covering the bottom save button.

## [0.9.3] - 2026-06-21

### Changed
- Relocated pagination and slider controls to the top of the Changelog card to prevent vertical layout shifts when rendering entries of varying heights.
- Removed key prop from the Changelog content container and added programmatic scroll resetting to eliminate layout reflows and flicker on page changes.

## [0.9.2] - 2026-06-21

### Added
- Implemented client-side Demo Mode architecture utilizing browser `localStorage` for offline CRUD data persistence.
- Added global fetch interceptor in `lib/api.ts` to seamlessly route backend REST requests to client-side mock handlers when demo mode is active.
- Created `PrivacyPolicy` page providing clear information on GDPR compliance and client-side data handling.
- Added interactive `Changelog` page in the dashboard featuring a version history slider and navigation pagination.
- Added visual `DemoBadge` and dynamic `VersionIndicator` components to the dashboard layout.
- Added comprehensive unit tests validating the behavior of all newly introduced components and features.
- Updated `DemoBadge` to use a non-blinking, subtle dashed screen border style with a static indicator watermark.
- Fixed client-side registration flow in demo mode by importing proxy fetch interception in `AuthContext.tsx`.
- Implemented dynamic, persistent user registration and login fallback credentials inside `local-db.ts`.
- Refactored Changelog page layout to take full screen width as an integrated dashboard component.
- Corrected changelog translation keys in joke locales (`lc`, `pr`, `sh`) to match their humorous style.
- Added environment variable configurations with `.env` and `.env.example` templates.
- Enabled Flask backend port mapping via environment variables.

### Changed
- Standardized frontend layout responsiveness with fluid grid layout wrappers and overflow-x scroll tables.
- Aligned SidebarHeader layout to match main content header.
- Streamlined Changelog page visual structure to fit seamlessly into the dashboard theme.
- Fixed DemoBadge position and visual style to match VersionIndicator.

## [0.9.1] - 2026-06-20

### Changed
- Migrated deprecated Next.js frontend `middleware.ts` to `proxy.ts` according to Next.js 16 file convention.
- Renamed exported function `middleware` to `proxy` in the Next.js proxy config.
- Removed the deprecated `runtime` option from the proxy config object as Next.js 16 proxy defaults to the Node.js runtime and setting it throws an error.
- Updated comments in `AuthContext.tsx` referencing middleware to refer to proxy.

---

## [0.9.0] - 2026-06-20

### Added
- Integrated Vitest, jsdom, and React Testing Library setup in the frontend.
- Created robust unit test files for all main custom React components (`AppSidebar`, `AutoLogoutManager`, `BookingForm`, `I18nAuditLoader`, `I18nAudit`, `ThemeProvider`).
- Implemented global mocks for Next.js routing, `next-intl` translations, and JSDOM API support (`ResizeObserver`, `matchMedia`).
- Added `.npmrc` configuration file to automate `legacy-peer-deps` handling during local installations.

### Changed
- Upgraded ESLint to `^9.17.0` to resolve peer dependency issues with `eslint-config-next`.
- Migrated legacy ESLint JSON configuration to the new flat config file `eslint.config.js`.
- Configured yarn/npm package overrides for `postcss` (resolved to `^8.5.10`) to eliminate all nested sub-dependency vulnerabilities.
- Updated frontend version to `0.9.0`.

---

## [0.8.0] - 2026-03-05

### Added
- Favicon updated to `bed.ico`; icons metadata added to app layout.
- Capacity warning displayed in booking form when room is near capacity.
- New i18n translation keys for capacity warnings and rate form validation.

### Changed
- Rate dialog form refactored with improved date validation logic.
- Applied missing translations across rates, booking-form, and rooms pages.

---

## [0.7.0] - 2026-02-28

### Added
- `BookingForm` component introduced to replace inline booking dialogs.
- Clients page added to the dashboard for guest management.
- Currency tracking and formatting improvements throughout the UI.
- i18n: added validation messages, loader fallback strings, and sync script.

### Changed
- Bookings UI refactored to use the new `BookingForm` component.
- Auth proxy improved for API request handling.
- Form validation tightened across multiple dashboard pages.

---

## [0.6.0] - 2026-02-25

### Added
- Full Room and Room Group management UI (create, edit, delete).
- User manuals in English and Czech (`manual/` directory).
- Edit and delete support for seasonal rates with i18n strings.

### Removed
- Amenities selection and display removed from Room management UI.

### Changed
- Room management page restructured to align with backend CRUD changes.

---

## [0.5.0] - 2026-02-12

### Added
- Additional language support (German, French, Spanish, and others).

### Changed
- Improved translation coverage across all dashboard pages.
- Fixed localization inconsistencies in date and currency formatting.

---

## [0.4.0] - 2026-01-19

### Changed
- General UI/UX overhaul pass improving layout consistency and dark mode reliability.
- `AuthContext` updated for more robust session management.

---

## [0.3.0] - 2026-01-15

### Added
- Full internationalization (i18n) support using `next-intl`.
- Locale-based routing restructured under `app/[locale]/`.
- Custom date formatting and currency conversion utilities.
- Guest search dropdown for booking forms.
- `MILESTONES.md` created to track project phases.

---

## [0.2.0] - 2026-01-03

### Added
- Authentication and profile management UI (login, register, profile page).
- Authorization header support for all API requests.
- Auto-logout feature on session expiry.
- Password change feature in user settings.
- Enter key navigation for forms via custom hook.
- Toast notification system replacing browser `alert()` dialogs.
- Sample data import feature in the Settings page.
- Services management UI (breakfast, parking, etc.).
- Seasonal rates management UI.

### Removed
- Events feature removed from dashboard navigation and pages.

### Fixed
- Currency formatting in the Reports screen now respects user locale settings.
- Type safety issues resolved in `dashboard/page.tsx` using explicit `Booking` type.

---

## [0.1.0] - 2025-11-06

### Added
- Initial migration of frontend codebase from the legacy `MiniHotel` repository.
- Next.js application structure with TypeScript.
- Core dashboard pages: Bookings, Rooms, Guests, Reports.
- Basic authentication flow.
