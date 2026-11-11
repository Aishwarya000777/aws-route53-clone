# AWS Route 53 Clone

A web-based simulation of Amazon Route 53, built using Next.js, TypeScript, FastAPI, and SQLite. The application provides an AWS-inspired interface for managing hosted zones and DNS records, with JWT-based authentication and REST API integration.

## Features

### Authentication
- Mock user authentication.
- JWT-based authentication.
- Protected application routes.
- Login and logout functionality.

### Hosted Zone Management
- Create, view, update, and delete hosted zones.
- Search and pagination.

### DNS Record Management
- Create, view, update, and delete DNS records.
- Supported record types: A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, and CAA.
- Type-specific DNS record forms.
- DNS value validation.
- TTL and routing policy configuration.
- Search and filtering.

### Dashboard
- Hosted zone overview.
- Quick actions.
- Navigation to Route 53 service sections.

### Additional Sections
The following sections have frontend placeholder interfaces:
- Traffic Policies
- Health Checks
- Resolver
- Profiles

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript |
| Styling | CSS / Tailwind CSS |
| Backend | FastAPI, Python |
| Database | SQLite |
| ORM | SQLAlchemy |
| Authentication | JWT |
| API Documentation | Swagger / OpenAPI |
| Icons | Lucide React |

## Project Structure

```text
route53-clone/
│
├── backend/
│   ├── routers/
│   │   ├── auth.py
│   │   ├── hosted_zones.py
│   │   └── records.py
│   │
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── route53.db
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── hosted-zones/
│   │   │   ├── traffic-policies/
│   │   │   ├── health-checks/
│   │   │   ├── resolver/
│   │   │   ├── profiles/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/
│   │   └── lib/
│   │
│   ├── .env.local
│   ├── package.json
│   └── ...
│
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js
- npm

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd route53-clone
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

Swagger API documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open a separate terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create or update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

`http://localhost:3000`

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/hosted-zones/` | Create hosted zone |
| GET | `/api/hosted-zones/` | List hosted zones |
| GET | `/api/hosted-zones/{zone_id}` | Retrieve hosted zone |
| PUT | `/api/hosted-zones/{zone_id}` | Update hosted zone |
| DELETE | `/api/hosted-zones/{zone_id}` | Delete hosted zone |
| POST | `/api/hosted-zones/{zone_id}/records/` | Create DNS record |
| GET | `/api/hosted-zones/{zone_id}/records/` | List DNS records |
| GET | `/api/hosted-zones/{zone_id}/records/{record_id}` | Retrieve DNS record |
| PUT | `/api/hosted-zones/{zone_id}/records/{record_id}` | Update DNS record |
| DELETE | `/api/hosted-zones/{zone_id}/records/{record_id}` | Delete DNS record |

Protected endpoints require a valid JWT access token.

## Database

SQLite is used for persistent storage, with SQLAlchemy as the ORM.

The database stores:
- User information.
- Hosted zone information.
- DNS record information.

## DNS Validation

The backend implements validation for:
- IPv4 addresses in A records.
- IPv6 addresses in AAAA records.
- Domain names in CNAME, NS, and PTR records.
- Structured MX, SRV, and CAA record values.
- Non-negative TTL values.

## Scope and Limitations

This project is an educational simulation of selected Amazon Route 53 functionality. It does not provision actual AWS resources or modify real DNS infrastructure.

Traffic Policies, Health Checks, Resolver, and Profiles are currently frontend placeholder sections.

## Future Enhancements

- BIND zone file import and export.
- Bulk DNS record operations.
- Dark mode.
- Keyboard shortcuts.
- Additional Route 53 functionality.

## Disclaimer

This project is developed for educational and demonstration purposes. It is not affiliated with or endorsed by Amazon Web Services (AWS).