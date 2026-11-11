
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import HostedZone, User
from schemas import HostedZoneCreate, HostedZoneUpdate, HostedZoneResponse
from auth import get_current_user

router = APIRouter(
    prefix="/api/hosted-zones",
    tags=["Hosted Zones"]
)


@router.post("/", response_model=HostedZoneResponse)
def create_zone(
    data: HostedZoneCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    zone = HostedZone(
        name=data.name.rstrip(".").lower(),
        zone_id="Z" + uuid.uuid4().hex[:13].upper(),
        type=data.type,
        comment=data.comment or "",
        user_id=user.id
    )

    db.add(zone)
    db.commit()
    db.refresh(zone)

    return zone


@router.get("/")
def list_zones(
    search: str = "",
    zone_type: str = "",
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    query = db.query(HostedZone).filter(
        HostedZone.user_id == user.id
    )

    if search:
        query = query.filter(
            HostedZone.name.ilike(f"%{search}%")
        )

    if zone_type:
        query = query.filter(HostedZone.type == zone_type)

    total = query.count()

    zones = query.order_by(
        HostedZone.id.desc()
    ).offset(skip).limit(min(limit, 100)).all()

    return {
        "items": zones,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/{zone_id}", response_model=HostedZoneResponse)
def get_zone(
    zone_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    zone = db.query(HostedZone).filter(
        HostedZone.id == zone_id,
        HostedZone.user_id == user.id
    ).first()

    if not zone:
        raise HTTPException(404, "Hosted zone not found")

    return zone


@router.put("/{zone_id}", response_model=HostedZoneResponse)
def update_zone(
    zone_id: int,
    data: HostedZoneUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    zone = db.query(HostedZone).filter(
        HostedZone.id == zone_id,
        HostedZone.user_id == user.id
    ).first()

    if not zone:
        raise HTTPException(404, "Hosted zone not found")

    updates = data.model_dump(exclude_unset=True)

    if "name" in updates and updates["name"]:
        updates["name"] = updates["name"].rstrip(".").lower()

    for key, value in updates.items():
        setattr(zone, key, value)

    db.commit()
    db.refresh(zone)

    return zone


@router.delete("/{zone_id}")
def delete_zone(
    zone_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    zone = db.query(HostedZone).filter(
        HostedZone.id == zone_id,
        HostedZone.user_id == user.id
    ).first()

    if not zone:
        raise HTTPException(404, "Hosted zone not found")

    db.delete(zone)
    db.commit()

    return {"message": "Hosted zone deleted successfully"}
