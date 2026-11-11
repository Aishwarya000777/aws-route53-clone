import json
import ipaddress
import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import DNSRecord, HostedZone, User
from schemas import DNSRecordCreate, DNSRecordUpdate, DNSRecordResponse
from auth import get_current_user

router = APIRouter(
    prefix="/api/hosted-zones/{zone_id}/records",
    tags=["DNS Records"]
)

ALLOWED_TYPES = {
    "A", "AAAA", "CNAME", "TXT", "MX",
    "NS", "PTR", "SRV", "CAA"
}


def is_valid_domain(value: str) -> bool:
    value = value.rstrip(".")

    if not value or len(value) > 253:
        return False

    labels = value.split(".")

    return all(
        1 <= len(label) <= 63
        and re.fullmatch(
            r"[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?",
            label
        )
        for label in labels
    )


def validate_dns_record(record_type: str, value: str):
    if not value or not value.strip():
        raise HTTPException(400, "Record value cannot be empty")

    record_type = record_type.upper()

    if record_type == "A":
        try:
            ip = ipaddress.ip_address(value.strip())
            if ip.version != 4:
                raise ValueError()
        except ValueError:
            raise HTTPException(400, "Invalid IPv4 address")

    elif record_type == "AAAA":
        try:
            ip = ipaddress.ip_address(value.strip())
            if ip.version != 6:
                raise ValueError()
        except ValueError:
            raise HTTPException(400, "Invalid IPv6 address")

    elif record_type in {"CNAME", "NS", "PTR"}:
        if not is_valid_domain(value.strip()):
            raise HTTPException(400, "Invalid domain name")

    elif record_type == "TXT":
        if not value.strip():
            raise HTTPException(400, "TXT value cannot be empty")

    elif record_type in {"MX", "SRV", "CAA"}:
        try:
            data = json.loads(value)
        except (json.JSONDecodeError, TypeError):
            raise HTTPException(
                400,
                f"{record_type} value must contain valid JSON"
            )

        if not isinstance(data, dict):
            raise HTTPException(400, "Invalid structured record value")

        if record_type == "MX":
            priority = data.get("priority")
            mail_server = data.get("mail_server")

            if (
                type(priority) is not int
                or not 0 <= priority <= 65535
                or not isinstance(mail_server, str)
                or not is_valid_domain(mail_server)
            ):
                raise HTTPException(400, "Invalid MX record values")

        elif record_type == "SRV":
            priority = data.get("priority")
            weight = data.get("weight")
            port = data.get("port")
            target = data.get("target")

            if (
                any(
                    type(number) is not int or not 0 <= number <= 65535
                    for number in (priority, weight, port)
                )
                or not isinstance(target, str)
                or not is_valid_domain(target)
            ):
                raise HTTPException(400, "Invalid SRV record values")

        elif record_type == "CAA":
            flags = data.get("flags")
            tag = data.get("tag")
            caa_value = data.get("value")

            if (
                type(flags) is not int
                or not 0 <= flags <= 255
                or tag not in {"issue", "issuewild", "iodef"}
                or not isinstance(caa_value, str)
                or not caa_value.strip()
            ):
                raise HTTPException(400, "Invalid CAA record values")


def get_owned_zone(zone_id, user, db):
    zone = db.query(HostedZone).filter(
        HostedZone.id == zone_id,
        HostedZone.user_id == user.id
    ).first()

    if not zone:
        raise HTTPException(404, "Hosted zone not found")

    return zone


@router.post("/", response_model=DNSRecordResponse)
def create_record(
    zone_id: int,
    data: DNSRecordCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    get_owned_zone(zone_id, user, db)

    record_type = data.type.upper()

    if record_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported DNS record type")

    validate_dns_record(record_type, data.value)

    if data.ttl < 0:
        raise HTTPException(400, "TTL cannot be negative")

    record = DNSRecord(
        name=data.name,
        type=record_type,
        value=data.value,
        ttl=data.ttl,
        routing_policy=data.routing_policy,
        hosted_zone_id=zone_id
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("/")
def list_records(
    zone_id: int,
    search: str = "",
    record_type: str = "",
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    get_owned_zone(zone_id, user, db)

    query = db.query(DNSRecord).filter(
        DNSRecord.hosted_zone_id == zone_id
    )

    if search:
        query = query.filter(
            DNSRecord.name.ilike(f"%{search}%")
        )

    if record_type:
        query = query.filter(
            DNSRecord.type == record_type.upper()
        )

    total = query.count()

    records = query.order_by(
        DNSRecord.id.desc()
    ).offset(skip).limit(limit).all()

    return {
        "items": records,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/{record_id}", response_model=DNSRecordResponse)
def get_record(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    get_owned_zone(zone_id, user, db)

    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id,
        DNSRecord.hosted_zone_id == zone_id
    ).first()

    if not record:
        raise HTTPException(404, "DNS record not found")

    return record


@router.put("/{record_id}", response_model=DNSRecordResponse)
def update_record(
    zone_id: int,
    record_id: int,
    data: DNSRecordUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    get_owned_zone(zone_id, user, db)

    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id,
        DNSRecord.hosted_zone_id == zone_id
    ).first()

    if not record:
        raise HTTPException(404, "DNS record not found")

    updates = data.model_dump(exclude_unset=True)

    if "type" in updates and updates["type"]:
        updates["type"] = updates["type"].upper()

        if updates["type"] not in ALLOWED_TYPES:
            raise HTTPException(400, "Unsupported DNS record type")

    if "ttl" in updates and updates["ttl"] is not None:
        if updates["ttl"] < 0:
            raise HTTPException(400, "TTL cannot be negative")

    if "value" in updates or "type" in updates:
        effective_type = updates.get("type", record.type)
        effective_value = updates.get("value", record.value)

        validate_dns_record(effective_type, effective_value)

    for key, value in updates.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


@router.delete("/{record_id}")
def delete_record(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    get_owned_zone(zone_id, user, db)

    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id,
        DNSRecord.hosted_zone_id == zone_id
    ).first()

    if not record:
        raise HTTPException(404, "DNS record not found")

    db.delete(record)
    db.commit()

    return {"message": "DNS record deleted successfully"}
