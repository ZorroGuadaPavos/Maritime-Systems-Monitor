import uuid
from datetime import datetime, timezone

from sqlmodel import JSON, Field, Relationship

from src.vessels.schemas import ValveBase, VesselBase


class Vessel(VesselBase, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    valves: list['Valve'] = Relationship(back_populates='vessel')
    equipment_identifiers: list[str] = Field(sa_type=JSON, default=[])
    equipment_connections: dict = Field(sa_type=JSON, default={})
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Valve(ValveBase, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    vessel_id: uuid.UUID = Field(foreign_key='vessel.id', nullable=False)
    vessel: Vessel | None = Relationship(back_populates='valves')
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
