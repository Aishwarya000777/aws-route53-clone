# AWS Route 53 Clone

A web-based simulation of **Amazon Route 53**, built using Next.js, TypeScript, FastAPI, and SQLite. The application provides an AWS-inspired management console for creating and managing hosted zones and DNS records, with JWT-based authentication and REST API integration.

## Live Demo

| Component | Deployment |
|---|---|
| Frontend | [AWS Route 53 Clone](https://aws-route53-clone-rho.vercel.app) |
| Backend | [FastAPI Backend](https://aws-route53-clone-l4oe.onrender.com) |
| API Documentation | [Swagger UI](https://aws-route53-clone-l4oe.onrender.com/docs) |

**Demo Credentials**

- Username: `admin`
- Password: `admin123`

These credentials are provided for demonstration purposes.

---

## Features

### 1. Authentication
- Mock user authentication.
- JWT-based authentication.
- Protected application routes.
- Login and logout functionality.

### 2. Hosted Zone Management
- Create, view, update, and delete hosted zones.
- Search hosted zones by domain name.
- Pagination support.
- Hosted zone details and management.

### 3. DNS Record Management
- Create, view, update, and delete DNS records.
- Support for multiple DNS record types:
  - A
  - AAAA
  - CNAME
  - TXT
  - MX
  - NS
  - PTR
  - SRV
  - CAA
- Type-specific DNS record forms.
- DNS value validation.
- TTL and routing policy configuration.
- Search and filtering.

### 4. Dashboard
- Hosted zone overview.
- Quick actions.
- Navigation to Route 53 service sections.

### 5. Additional Sections

The following sections are included as frontend placeholder interfaces:

- Traffic Policies
- Health Checks
- Resolver
- Profiles

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript |
| Styling | CSS |
| Backend | FastAPI, Python |
| Database | SQLite |
| ORM | SQLAlchemy |
| Authentication | JWT |
| API Communication | REST API |
| API Documentation | Swagger / OpenAPI |
| Icons | Lucide React |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## Project Structure

```text
route53-clone/
│
├── backend/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── hosted_zones.py
│   │   └── records.py
│   │
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.py
│   └── requirements.txt
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
│   │   │   ├── AWSLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   └── lib/
│   │       └── api.ts
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

Local environment files, virtual environments, dependencies, and generated database files are excluded through `.gitignore`.

---

## Prerequisites

Make sure the following are installed:

- Python 3.10+
- Node.js 22+
- npm

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aishwarya000777/aws-route53-clone.git

cd aws-route53-clone
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

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a separate terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file inside the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the Next.js development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## API Overview

The backend exposes REST API endpoints for authentication, hosted zone management, and DNS record management.

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

---

## Database

SQLite is used as the application's database, with SQLAlchemy as the ORM.

The database stores:

- User information.
- Hosted zone information.
- DNS record information.

The database is initialized through SQLAlchemy when the backend starts.

**Deployment note:** The backend is hosted on Render's free tier, which uses an ephemeral filesystem. Consequently, SQLite data may not survive service restarts or redeployments.

---

## DNS Validation

The backend implements validation for supported DNS record types, including:

- IPv4 address validation for A records.
- IPv6 address validation for AAAA records.
- Domain name validation for CNAME, NS, and PTR records.
- Structured value validation for MX, SRV, and CAA records.
- Non-negative TTL validation.

Frontend forms also provide type-specific inputs for DNS records.

---

## Deployment Architecture

The application uses a separate frontend and backend deployment architecture.

```text
              User Browser
                   |
                   v
          Next.js Frontend
                Vercel
                   |
              REST API
                   |
                   v
           FastAPI Backend
                Render
                   |
                   v
             SQLite DB
```

- **Frontend:** Deployed on Vercel.
- **Backend:** Deployed on Render.
- **Communication:** REST API requests between frontend and backend.
- **Authentication:** JWT-based authentication.
- **CORS:** Configured to allow requests from the deployed frontend and local development environment.

## Deployment Instructions

### Backend Deployment (Render)

1. Create a new Web Service on Render.
2. Connect the GitHub repository.
3. Set the Root Directory to `backend`.
4. Select Python as the runtime.

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Deploy the service and copy the generated backend URL.

### Frontend Deployment (Vercel)

1. Import the GitHub repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Select Next.js as the framework.

**Build Command:**
```bash
npm run build
```

**Install Command:**
```bash
npm install
```

Add the following environment variable:

```env
NEXT_PUBLIC_API_URL=<YOUR_RENDER_BACKEND_URL>
```

Deploy the frontend.

**Important:** Configure the backend CORS settings to allow requests from your deployed Vercel frontend URL.

---

## Testing the Application

After starting both servers:

1. Open the frontend at `http://localhost:3000`.
2. Log in using the demo credentials.
3. Navigate to Hosted Zones.
4. Create a hosted zone.
5. Open the hosted zone and create DNS records.
6. Test updating and deleting DNS records.
7. Test hosted zone search and pagination.
8. Verify API responses through the Swagger documentation at `http://127.0.0.1:8000/docs`.

The application supports CRUD operations for hosted zones and DNS records.

## Scope and Limitations

This project is an educational simulation of selected Amazon Route 53 functionality.

- It does not provision actual AWS resources.
- It does not modify real DNS infrastructure.
- Authentication uses mock admin credentials.
- Traffic Policies, Health Checks, Resolver, and Profiles are currently frontend placeholder sections.
- SQLite deployment storage on the Render free tier is ephemeral and does not guarantee data persistence across restarts.

---

## Future Enhancements

- BIND zone file import and export.
- Bulk DNS record operations.
- Dark mode.
- Keyboard shortcuts.
- Additional Route 53 functionality.
- Persistent database storage for production deployment.

---

## Disclaimer

This project is developed for educational and demonstration purposes. It is not affiliated with or endorsed by Amazon Web Services (AWS).