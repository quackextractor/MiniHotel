# Changelog - Backend

All notable changes to the MiniHotel backend are documented here.
Versioning follows [Semantic Versioning 2.0.0](https://semver.org/).

---

## [0.7.0] - 2026-03-05

### Added
- Auto-create virtual environment and install dependencies on startup (`main.py`).
- `--use-global` launch flag to bypass virtual environment and use system packages.
- Capacity warning integrated into rate calculation logic.
- Validation for seasonal rate date ranges to prevent overlapping or invalid entries.

### Changed
- Test suite updated to cover capacity warning scenarios.

---

## [0.6.0] - 2026-02-28

### Added
- Exchange rates model and API routes for currency management.
- Booking update endpoint allowing guest modifications.
- Ability to update booking `guest_id` field via API.
- Guest update and delete endpoints.
- Service update and delete endpoints.

---

## [0.5.0] - 2026-02-25

### Added
- Full CRUD API endpoints for Rooms and Room Groups.
- Room amenities support (WiFi, TV, Coffee Maker) with dynamic assignment.
- Date validation on room and booking creation.
- Robust validation and error handling for room creation and updates (400 Bad Request instead of 500).

### Removed
- Amenities column and related code removed after feature re-evaluation to simplify room management.

---

## [0.4.0] - 2026-02-12

### Added
- Services management API (create, list services).
- Seasonal rates API (create, list rate adjustments).
- Booking rate calculation updated to include service add-ons.
- Booking creation updated to persist selected services.

### Changed
- General codebase improvements and refactoring (week1, week2 overhaul).

---

## [0.3.0] - 2026-01-19

### Changed
- Major architectural overhaul: refactored monolithic `app.py` into modular Blueprints under `routes/` and `services/`.
- Improved `SECRET_KEY` handling for production security.

---

## [0.2.0] - 2026-01-03

### Added
- Authentication and JWT-based authorization for all API endpoints.
- Audit logging for API operations.
- Pagination for the `get_bookings` endpoint.
- Rate limiting via `Flask-Limiter` (e.g., on login).
- CLI command to import sample data from JSON files.
- Bookings import API endpoint.

### Removed
- Event model and all related API endpoints.

---

## [0.1.0] - 2025-11-06

### Added
- Initial migration of backend codebase from the legacy `MiniHotel` repository.
- Core Flask application structure with SQLite database.
- Basic REST API for rooms, bookings, and guests.
