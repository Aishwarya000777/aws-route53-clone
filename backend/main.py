

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import records
from database import engine, Base, SessionLocal
from models import User
from auth import hash_password
from routers import auth as auth_router
from routers import hosted_zones

# Initialize database
Base.metadata.create_all(bind=engine)

# Create FastAPI application FIRST
app = FastAPI(
    title="AWS Route53 Clone API",
    description="Backend API for Route53 Clone",
    version="1.0.0"
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://aws-route53-clone-rho.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers AFTER creating app
app.include_router(auth_router.router)
app.include_router(hosted_zones.router)
app.include_router(records.router)

@app.on_event("startup")
def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(
            User.username == "admin"
        ).first()

        if not existing:
            admin = User(
                username="admin",
                email="admin@route53.local",
                password_hash=hash_password("admin123")
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Route53 Clone API is running"}
