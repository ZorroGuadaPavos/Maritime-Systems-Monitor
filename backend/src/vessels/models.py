from datetime import datetime

from sqlmodel import JSON, Field, Relationship

from src.vessels.schemas import ValveBase, VesselBase


class Vessel(VesselBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    valves: list['Valve'] = Relationship(back_populates='vessel')
    equipment_connections: dict = Field(sa_type=JSON, default={})
    created_at: datetime = Field(default_factory=datetime.now)


class Valve(ValveBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    vessel_id: int = Field(foreign_key='vessel.id', nullable=False)
    vessel: Vessel | None = Relationship(back_populates='valves')
    created_at: datetime = Field(default_factory=datetime.now)
