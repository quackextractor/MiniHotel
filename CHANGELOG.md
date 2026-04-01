# Changelog

All notable changes to the MiniHotel root repository are documented here.

## [0.8.0] - 2026-03-05
### Frontend (0.8.0)
* Added: Favicon updated to bed.ico; icons metadata added to app layout.
* Added: Capacity warning displayed in booking form when room is near capacity.
* Added: New i18n translation keys for capacity warnings and rate form validation.
* Changed: Rate dialog form refactored with improved date validation logic.
* Changed: Applied missing translations across rates, booking-form, and rooms pages.

### Backend (0.7.0)
* Added: Auto-create virtual environment and install dependencies on startup.
* Added: Launch flag to bypass virtual environment and use system packages.
* Added: Capacity warning integrated into rate calculation logic.
* Added: Validation for seasonal rate date ranges to prevent overlapping or invalid entries.
* Changed: Test suite updated to cover capacity warning scenarios.

## [0.7.0] - 2026-02-28
### Frontend (0.7.0)
* Added: BookingForm component introduced to replace inline booking dialogs.
* Added: Clients page added to the dashboard for guest management.
* Added: Currency tracking and formatting improvements throughout the UI.
* Added: i18n validation messages, loader fallback strings, and sync script.
* Changed: Bookings UI refactored to use the new BookingForm component.
* Changed: Auth proxy improved for API request handling.
* Changed: Form validation tightened across multiple dashboard pages.

### Backend (0.6.0)
* Added: Exchange rates model and API routes for currency management.
* Added: Booking update endpoint allowing guest modifications.
* Added: Ability to update booking guest id field via API.
* Added: Guest update and delete endpoints.
* Added: Service update and delete endpoints.

## [0.6.0] - 2026-02-25
### Frontend (0.6.0)
* Added: Full Room and Room Group management UI.
* Added: User manuals in English and Czech.
* Added: Edit and delete support for seasonal rates with i18n strings.
* Removed: Amenities selection and display removed from Room management UI.
* Changed: Room management page restructured to align with backend CRUD changes.

### Backend (0.5.0)
* Added: Full CRUD API endpoints for Rooms and Room Groups.
* Added: Room amenities support with dynamic assignment.
* Added: Date validation on room and booking creation.
* Added: Robust validation and error handling for room creation and updates.
* Removed: Amenities column and related code removed after feature re-evaluation.

## [0.5.0] - 2026-02-12
### Frontend (0.5.0)
* Added: Additional language support (German, French, Spanish, etc.).
* Changed: Improved translation coverage across all dashboard pages.
* Changed: Fixed localization inconsistencies in date and currency formatting.

### Backend (0.4.0)
* Added: Services management API.
* Added: Seasonal rates API.
* Added: Booking rate calculation updated to include service add-ons.
* Added: Booking creation updated to persist selected services.
* Changed: General codebase improvements and refactoring.

## [0.4.0] - 2026-01-19
### Frontend (0.4.0)
* Changed: General UI/UX overhaul pass improving layout consistency and dark mode reliability.
* Changed: AuthContext updated for more robust session management.

### Backend (0.3.0)
* Changed: Major architectural overhaul restructuring app.py into modular Blueprints.
* Changed: Improved secret key handling for production security.

## [0.3.0] - 2026-01-15
### Frontend (0.3.0)
* Added: Full internationalization support using next-intl.
* Added: Locale-based routing restructured under app/[locale]/.
* Added: Custom date formatting and currency conversion utilities.
* Added: Guest search dropdown for booking forms.
* Added: MILESTONES.md created to track project phases.

## [0.2.0] - 2026-01-03
### Frontend (0.2.0)
* Added: Authentication and profile management UI.
* Added: Authorization header support for all API requests.
* Added: Auto-logout feature on session expiry.
* Added: Password change feature in user settings.
* Added: Toast notification system replacing browser alert dialogs.
* Added: Services and Seasonal rates management UI.
* Removed: Events feature removed from dashboard navigation and pages.

### Backend (0.2.0)
* Added: Authentication and JWT-based authorization for all API endpoints.
* Added: Audit logging for API operations.
* Added: Pagination for the get_bookings endpoint.
* Added: Rate limiting via Flask-Limiter.
* Added: CLI command to import sample data from JSON files.
* Removed: Event model and all related API endpoints.

## [0.1.0] - 2025-11-06
### Frontend (0.1.0)
* Added: Initial migration of frontend codebase.
* Added: Next.js application structure with TypeScript.
* Added: Core dashboard pages (Bookings, Rooms, Guests, Reports).
* Added: Basic authentication flow.

### Backend (0.1.0)
* Added: Initial migration of backend codebase.
* Added: Core Flask application structure with SQLite database.
* Added: Basic REST API for rooms, bookings, and guests.