import uuid
from typing import Optional

from sqlmodel import Field, SQLModel


class VesselBase(SQLModel):
    name: str = Field(unique=True, index=True, max_length=30)


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


class ValvePublic(ValveBase):
    pass


class ValveListPublic(SQLModel):
    data: list[ValvePublic]
    count: int


class ValveUpdate(SQLModel):
    is_open: bool


class VesselCreate(VesselBase):
    equipment_connections: dict


class VesselUpdate(SQLModel):
    name: Optional[str] = None
    equipment_connections: dict
