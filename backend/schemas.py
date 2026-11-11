
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class LoginRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class HostedZoneCreate(BaseModel):
    name: str
    type: str = "Public"
    comment: Optional[str] = ""


class HostedZoneResponse(BaseModel):
    id: int
    name: str
    zone_id: str
    type: str
    comment: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class DNSRecordCreate(BaseModel):
    name: str
    type: str
    value: str
    ttl: int = 300
    routing_policy: str = "Simple"


class DNSRecordResponse(BaseModel):
    id: int
    name: str
    type: str
    value: str
    ttl: int
    routing_policy: str

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str



class HostedZoneUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    comment: Optional[str] = None


class DNSRecordUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    value: Optional[str] = None
    ttl: Optional[int] = None
    routing_policy: Optional[str] = None
