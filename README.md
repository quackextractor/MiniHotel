# Minihotel Management System

A comprehensive hotel management system comprising a Next.js frontend dashboard and a Python Flask REST API backend. This monorepo contains the complete suite of tools required to manage rooms, guests, bookings, and daily hotel operations.

## Repository Structure

* **quackextractor-minihotel-frontend**: The modern web interface built with React, Next.js, Tailwind CSS, and TypeScript. Includes multi-language support and interactive dashboards.
* **quackextractor-minihotel-backend**: The core business logic and API layer built with Python, Flask, and SQLAlchemy. Handles database operations, authentication, and complex calculations.

## Core Features

* **Room Management**: Create, edit, and organize rooms and room groups.
* **Guest Profiles**: Keep track of guest information, search histories, and contact details.
* **Booking Engine**: Complete booking lifecycle management with conflict detection and automated rate calculations.
* **Operational Dashboards**: Tools for housekeeping status tracking, maintenance tickets, and service add-ons.
* **Financial Analytics**: Generate reports on occupancy rates, revenue, and daily activity.
* **Internationalization**: Frontend UI is available in English, Czech, German, and can be expanded.

## Getting Started

### Backend Setup
1. Navigate into the backend directory.
2. Run the startup script:
   `python main.py`
   *(This automatically creates a virtual environment and installs the required dependencies from requirements.txt)*
3. The API will start on `http://localhost:5000/api` and Swagger documentation will be available at `http://localhost:5000/docs`.

### Frontend Setup
1. Navigate into the frontend directory.
2. Install the necessary packages:
   `npm install`
3. Start the development server:
   `npm run dev`
4. Access the dashboard at `http://localhost:3000`.

## License
MIT [License](LICENSE.md)
