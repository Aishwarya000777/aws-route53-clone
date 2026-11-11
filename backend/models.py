
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    hosted_zones = relationship(
        "HostedZone",
        back_populates="owner",
        cascade="all, delete-orphan"
    )


class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    zone_id = Column(String, unique=True, nullable=False)
    type = Column(String, default="Public")
    comment = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="hosted_zones")
    records = relationship(
        "DNSRecord",
        back_populates="hosted_zone",
        cascade="all, delete-orphan"
    )


class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    value = Column(Text, nullable=False)
    ttl = Column(Integer, default=300)
    routing_policy = Column(String, default="Simple")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    hosted_zone_id = Column(
        Integer,
        ForeignKey("hosted_zones.id"),
        nullable=False
    )

    hosted_zone = relationship("HostedZone", back_populates="records")
