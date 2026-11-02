# Rental Car Platform

A full-stack car-rental application with separate experiences for customers, car owners, drivers, and administrators. The platform supports vehicle discovery and booking, owner-side fleet management, driver requests, vouchers, feedback, wallet-related workflows, and real-time chat.

> **Security notice:** This repository is prepared for public review, but it is not production-ready. Never commit real passwords, SMTP credentials, JWT keys, OAuth secrets, database dumps containing personal data, or uploaded files. Any credentials previously exposed in project history must be revoked and replaced.

## Features

- **Customers:** search and view cars, create and manage bookings, view booking details, use vouchers, and communicate through chat.
- **Car owners:** submit and manage car listings, review booking requests, manage vouchers, and view owner dashboards.
- **Drivers:** view and respond to driver requests and manage related bookings.
- **Administrators:** manage users, car listings, and vouchers.
- **Real-time messaging:** chat features using Spring WebSocket and STOMP.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router, Redux Toolkit, TanStack Query, Axios, MUI, Bootstrap |
| Backend | Java 17, Spring Boot 3.4.2, Spring Security, Spring Data JPA, Bean Validation |
| Data and infrastructure | MySQL, Redis, SMTP email, Spring WebSocket/STOMP |

## Repository layout

```text
rental_car_BE/   Spring Boot backend
rental_car_FE/   React/Vite frontend
```

## Prerequisites

- Java 17
- Node.js and npm (Node.js 20 LTS recommended)
- MySQL
- Redis
- SMTP credentials if you want to use email-dependent flows

## Local setup

### 1. Configure MySQL and Redis

Create a MySQL database named `carrental` (or set a different JDBC URL), and start MySQL and Redis locally.

The application reads Spring configuration from `rental_car_BE/src/main/resources/application.properties`. The committed file contains no credentials; provide local values through environment variables. A starter list is available in `rental_car_BE/.env.example` (it is a reference file, not loaded automatically by Spring Boot).

For PowerShell, set the required backend values before starting it:

```powershell
$env:SPRING_DATASOURCE_URL = "jdbc:mysql://localhost:3306/carrental"
$env:SPRING_DATASOURCE_USERNAME = "your_mysql_user"
$env:SPRING_DATASOURCE_PASSWORD = "your_mysql_password"
$env:SPRING_DATA_REDIS_HOST = "localhost"
$env:SPRING_DATA_REDIS_PORT = "6379"
$env:TOKEN_SECRET_KEY = "<base64-encoded-secret>"
$env:SPRING_MAIL_USERNAME = "your_smtp_account"
$env:SPRING_MAIL_PASSWORD = "your_smtp_app_password"
```

`TOKEN_SECRET_KEY` must be a valid Base64-encoded key suitable for HS512. Email variables are required for registration and password-reset flows. Do not paste real values into the README or commit them to Git.

> The current configuration uses Hibernate schema updates and SQL logging. Treat these as local-development defaults only; review database migration, logging, and secret-management settings before production use.

### 2. Start the backend

From the repository root, in PowerShell:

```powershell
cd rental_car_BE
.\mvnw.cmd spring-boot:run
```

The backend uses port `8080` by default. Once it is running, the OpenAPI UI is available at [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html), if enabled by the application configuration.

### 3. Start the frontend

In a second terminal:

```powershell
cd rental_car_FE
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The frontend uses `VITE_API_URL` from `rental_car_FE/.env` (default: `http://localhost:8080`). Copy `rental_car_FE/.env.example` to `.env` for local development. The backend currently allows the local Vite origin for CORS/WebSocket; non-local deployments require updating the allowed origin and all application URLs to match the deployment environment. Use HTTPS/WSS for secure deployments.

## Useful commands

### Frontend (`rental_car_FE`)

```bash
npm run dev      # Start the Vite development server
npm run build    # Build the frontend for production
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

### Backend (`rental_car_BE`)

```bash
./mvnw test
./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd` instead of `./mvnw`.

## Testing

The backend includes a Spring Boot context smoke test. Add and run focused tests for booking, authorization, wallet-related workflows, and chat before relying on the application in production. The frontend currently defines build and lint scripts but no test script in `package.json`.

## Configuration and deployment notes

- Never commit passwords, API keys, JWT signing keys, or real user credentials.
- Rotate any credentials that have previously been committed, even if they have since been removed from this README.
- The current upload implementation stores files locally and generates localhost URLs; production deployments need a persistent storage strategy and environment-specific URLs.
- Review backend authorization rules, CORS, database schema management, and logging before exposing the service publicly.
- `rental_car_db.sql` is intentionally excluded from the public repository because database dumps may contain personal data, password hashes, tokens, or test credentials. Share a sanitized schema/seed file separately if needed.

## License

No license is currently specified. Contact the repository owner before reusing or redistributing this project.
