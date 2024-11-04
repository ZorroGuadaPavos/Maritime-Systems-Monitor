from sqlmodel import Session, delete, func, select

from src.vessels.models import Valve, Vessel
from src.vessels.schemas import VesselCreate, VesselUpdate

from .exceptions import ValveNotFoundException


def get_vessels(session: Session, skip: int = 0, limit: int = 100) -> tuple[list[Vessel], int]:
    count_statement = select(func.count()).select_from(Vessel)
    count = session.exec(count_statement).one()
    statement = select(Vessel).offset(skip).limit(limit)
    vessels = session.exec(statement).all()
    return vessels, count


def get_vessel(session: Session, id: int) -> Vessel | None:
    return session.get(Vessel, id)


def get_vessel_by_name_version(*, session: Session, name: str, version: str) -> Vessel | None:
    statement = select(Vessel).where(Vessel.name == name, Vessel.version == version)
    vessel = session.exec(statement).first()
    return vessel


def create_vessel(*, session: Session, vessel_in: VesselCreate) -> Vessel:
    db_obj = Vessel.model_validate(vessel_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def create_or_update_vessel(
    *, session: Session, name: str, version: str, equipment_connections: dict, equipment_identifiers: list[str]
) -> Vessel:
    vessel = get_vessel_by_name_version(session=session, name=name, version=version)
    if vessel:
        vessel_in = VesselUpdate(
            equipment_connections=equipment_connections, equipment_identifiers=equipment_identifiers
        )
        vessel = update_vessel(session=session, vessel=vessel, vessel_in=vessel_in)
    else:
        vessel_in = VesselCreate(
            name=name,
            version=version,
            equipment_connections=equipment_connections,
            equipment_identifiers=equipment_identifiers,
        )
        vessel = create_vessel(session=session, vessel_in=vessel_in)
    return vessel


def update_vessel_valves(*, session: Session, vessel_id: int, valves: list[str]) -> Vessel:
    statement = delete(Valve).where(Valve.vessel_id == vessel_id)
    session.exec(statement)
    valve_objects = [Valve(identifier=identifier, vessel_id=vessel_id) for identifier in valves]
    session.bulk_save_objects(valve_objects)
    session.commit()


def get_valves(session: Session, vessel_id: int, skip: int = 0, limit: int = 100) -> tuple[list[Valve], int]:
    count_statement = select(func.count()).where(Valve.vessel_id == vessel_id)
    count = session.exec(count_statement).one()
    statement = select(Valve).where(Valve.vessel_id == vessel_id).offset(skip).limit(limit)
    valves = session.exec(statement).all()
    return valves, count


def update_valve(session: Session, vessel_id: int, valve_identifier: str, is_open: bool):
    statement = select(Valve).where(Valve.vessel_id == vessel_id, Valve.identifier == valve_identifier)
    valve = session.exec(statement).first()
    if not valve:
        raise ValveNotFoundException('Valve not found')

    valve.is_open = is_open
    session.add(valve)
    session.commit()
    session.refresh(valve)
    return valve


def update_vessel(*, session: Session, vessel: Vessel, vessel_in: VesselUpdate) -> Vessel:
    vessel_data = vessel_in.model_dump(exclude_unset=True)
    vessel.sqlmodel_update(vessel_data)
    session.add(vessel)
    session.commit()
    session.refresh(vessel)
    return vessel


def get_open_valves(session: Session, vessel_id: int) -> list[str]:
    statement = select(Valve.identifier).where(Valve.vessel_id == vessel_id, Valve.is_open == True)
    return session.exec(statement).all()


def get_valve_identifiers(session: Session, vessel_id: int) -> list[str]:
    statement = select(Valve.identifier).where(Valve.vessel_id == vessel_id)
    return session.exec(statement).all()


def get_connected_equipment(session: Session, vessel: Vessel, start: str) -> set:
    """
    Returns all pieces of equipment connected to 'start' through open valves.
    """
    valve_identifiers = get_valve_identifiers(session=session, vessel_id=vessel.id)
    open_valves = get_open_valves(session=session, vessel_id=vessel.id)

    def is_valve_open(valve):
        return valve in open_valves

    # BFS to find connected equipment through open valves
    connected = set()
    queue = [start]
    visited = set()

    while queue:
        current = queue.pop(0)
        visited.add(current)

        # Only add equipment (not valves) to connected set
        if current not in valve_identifiers:
            connected.add(current)

        # Traverse neighbors if they are connected through an open valve
        for neighbor in vessel.equipment_connections.get(current, []):
            if neighbor not in visited:
                if neighbor not in valve_identifiers or is_valve_open(neighbor):
                    queue.append(neighbor)
    return connected
