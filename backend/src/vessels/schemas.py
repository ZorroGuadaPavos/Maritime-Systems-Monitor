import uuid
from typing import Optional

from sqlmodel import Field, SQLModel


class VesselBase(SQLModel):
    version: str
    name: str = Field(index=True, max_length=100)


class VesselList(VesselBase):
    id: uuid.UUID


class VesselListPublic(SQLModel):
    data: list[VesselList]
    count: int


class ValveBase(SQLModel):
    is_open: bool = Field(default=True)
    identifier: str = Field(index=True, max_length=10)


class VesselPublic(VesselBase):
    id: uuid.UUID
    valves: list['ValvePublic']
    equipment_identifiers: list[str]


class ValvePublic(ValveBase):
    pass


class ValveListPublic(SQLModel):
    data: list[ValvePublic]
    count: int


class ValveUpdate(SQLModel):
    is_open: bool


class VesselCreate(VesselBase):
    equipment_connections: dict
    equipment_identifiers: list[str]


class VesselUpdate(SQLModel):
    name: Optional[str] = None
    equipment_connections: Optional[dict] = None
    equipment_identifiers: Optional[list[str]] = None
