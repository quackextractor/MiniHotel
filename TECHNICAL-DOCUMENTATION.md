# Technical Documentation: MiniHotel

## 1. Introduction
### 1.1 Purpose of this Document
This document describes the technical design, architecture, and implementation details of the MiniHotel information system. It serves as the primary reference material for developers, system administrators, and other technical staff.

### 1.2 Target Audience
This document is intended for:
* Software engineers and developers
* Database administrators
* DevOps engineers
* Technical project managers

### 1.3 Glossary of Terms and Abbreviations
* **IS:** Information System
* **API:** Application Programming Interface
* **JWT:** JSON Web Token
* **ORM:** Object-Relational Mapping
* **i18n:** Internationalisation

## 2. System Overview
### 2.1 System Context
MiniHotel is a monorepo system for managing hotel operations. It covers the management of rooms, guests, reservations, housekeeping, maintenance, services, reporting, and exchange rates. The primary goal is to centralise operational tasks into a web application backed by a REST API.

### 2.2 High-Level Architecture
The system is split into two main parts:
* **Frontend (`/frontend`)** – Next.js application for operating the system.
* **Backend (`/backend`)** – Flask REST API with business logic and database access.

Architecture diagram: [`docs/diagrams/01-system-architecture.drawio.xml`](docs/diagrams/01-system-architecture.drawio.xml)

Interactions:
* The frontend calls backend endpoints via `/api/*`.
* The backend exposes Swagger/OpenAPI UI at `/docs`.

## 3. Technology Stack
Technologies used during development and operation.
* **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, next-intl
* **Backend:** Python, Flask 3, Flask-SQLAlchemy, Marshmallow, PyJWT, Flask-Cors, Flask-Limiter, Flasgger
* **Database:** SQLite (default `sqlite:///minihotel.db`), configurable via `DATABASE_URL`
* **Cache:** No dedicated cache layer is documented
* **Infrastructure & Cloud:** Not fixed; documentation mentions the possibility of deploying via a WSGI server

## 4. Architecture and Design
### 4.1 Data Model
Description of the database structure.
* **Main entities:**  
  `RoomGroup`, `SeasonalRate`, `Service`, `BookingService`, `Room`, `Guest`, `Booking`, `Housekeeping`, `Maintenance`, `Contact`, `User`, `AuditLog`, `ExchangeRate`, `Event`.

Key relationships:
* `Booking` → `Guest` (N:1)
* `Booking` → `Room` (N:1)
* `Booking` ↔ `Service` via `BookingService` (M:N)
* `Room` → `RoomGroup` (N:1)
* `RoomGroup` hierarchy via `parent_group_id`

### 4.2 User Interface (UI)
Core design principles of the frontend.
* Wireframes/Figma/Adobe XD are not included in the repository.
* Routing is built on Next.js App Router + `next-intl` locale routing.
* Active locales: `en`, `cs`, `de`.

## 5. Interfaces and API
### 5.1 Internal API
Description of API endpoints provided by the system.
* **Architectural style:** REST
* **API authentication:** Bearer token (JWT)
* **Endpoint documentation:** Swagger UI at `http://localhost:5000/docs`

Registered backend blueprints:
* `/api/auth`
* `/api/rooms`
* `/api/guests`
* `/api/bookings`
* `/api/services`
* `/api/housekeeping`, `/api/maintenance` (operations)
* `/api/reports`
* `/api/exchange-rates`
* `/api/events`

### 5.2 External Integrations
List and description of third-party integrations.
* **ExchangeRate-API (`https://api.exchangerate-api.com/v4/latest/CZK`):** the backend fetches live exchange rates (exchange-rates endpoint).
* No other external integrations are explicitly documented in the repository.

## 6. Security
### 6.1 Authentication and Authorisation
* Login is handled via `POST /api/auth/login` (username + password).
* Passwords are hashed using `bcrypt`.
* The backend issues a JWT token signed with `SECRET_KEY`.
* Protected endpoints use the `token_required` decorator.
* The login endpoint has a rate limit (`5 per minute`).

Authentication sequence diagram: [`docs/diagrams/03-auth-sequence.drawio.xml`](docs/diagrams/03-auth-sequence.drawio.xml)

### 6.2 User Roles and Permissions
The current implementation documents a single user type (`User`) with no explicit RBAC role separation.  
Access is handled in a binary fashion: authenticated vs. unauthenticated user.

### 6.3 Data Protection
* In transit: plain HTTP in local development; production deployments must add HTTPS/TLS at the infrastructure level.
* At rest: explicit database encryption is not documented in the repository.

## 7. Infrastructure and Deployment
### 7.1 Environment Requirements
Minimum requirements:
* Python 3.x
* Node.js + npm
* OS capable of running Flask and Next.js
* Network access to ports 5000 (backend) and 3000 (frontend) during development

### 7.2 Deployment Process (CI/CD)
* CI/CD tooling: not documented in the available context.
* Build/Test/Deploy pipeline is not specified in this document due to missing information.

### 7.3 Logging and Monitoring
* Application audit records are stored in the `AuditLog` table.
* Centralised monitoring (ELK/Sentry/Datadog) is not documented in the repository.

## 8. Testing
* **Unit testing:** backend scripts are present (`testing.py`, `test_500.py`), but no standard runner (e.g. pytest) or coverage metric is documented.
* **Integration tests:** not explicitly described.
* **End-to-end (E2E) testing:** tools such as Cypress/Playwright are not documented in the repository.

## 9. Known Limitations and Technical Debt
* No documented, standardised CI/CD process.
* No explicit role-based access control.
* No documented database migrations (e.g. Alembic/Flask-Migrate).
* Default SQLite is not ideal for higher production loads.
* No documented centralised observability (monitoring/alerting).

## 10. Appendices and References
* Repository: `quackextractor/MiniHotel`
* Root documentation: `README.md`
* Backend documentation: `backend/README.md`
* Frontend documentation: `frontend/README.md`
* Czech user manual: `frontend/manual/manual-CZ.html`
* System architecture diagram: `docs/diagrams/01-system-architecture.drawio.xml`
* Authentication sequence diagram: `docs/diagrams/03-auth-sequence.drawio.xml`
