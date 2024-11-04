import uuid

from sqlmodel import Field, SQLModel


class VesselBase(SQLModel):
    version: str
    name: str = Field(index=True, max_length=30)


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
    name: str | None
    equipment_connections: dict
    equipment_identifiers: list[str]
