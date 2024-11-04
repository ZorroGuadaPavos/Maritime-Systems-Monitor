import pytest
from sqlmodel import Session

from src.vessels.schemas import VesselCreate, VesselUpdate
from src.vessels.services import (
    create_or_update_vessel,
    create_vessel,
    get_connected_equipment,
    get_open_valves,
    get_vessel,
    get_vessel_by_name_version,
    update_valve,
    update_vessel,
    update_vessel_valves,
)
from tests.utils.utils import random_lower_string


@pytest.fixture
def vessel_in(equipment_ids, connections) -> VesselCreate:
    return VesselCreate(
        name=random_lower_string(),
        version='1.0',
        equipment_connections=connections,
        equipment_identifiers=equipment_ids,
    )


def test_create_vessel(db: Session, vessel_in: VesselCreate) -> None:
    vessel = create_vessel(session=db, vessel_in=vessel_in)
    assert vessel.name == vessel_in.name
    assert vessel.version == vessel_in.version
    assert vessel.equipment_connections == vessel_in.equipment_connections
    assert vessel.equipment_identifiers == vessel_in.equipment_identifiers


def test_get_vessel(db: Session, vessel_in: VesselCreate) -> None:
    vessel = create_vessel(session=db, vessel_in=vessel_in)
    fetched_vessel = get_vessel(session=db, id=vessel.id)
    assert fetched_vessel is not None
    assert fetched_vessel.id == vessel.id
    assert fetched_vessel.name == vessel.name
    assert fetched_vessel.version == vessel.version


def test_get_vessel_by_name_version(db: Session, vessel_in: VesselCreate) -> None:
    create_vessel(session=db, vessel_in=vessel_in)
    vessel = get_vessel_by_name_version(session=db, name=vessel_in.name, version=vessel_in.version)
    assert vessel is not None
    assert vessel.name == vessel_in.name
    assert vessel.version == vessel_in.version


def test_update_vessel(db: Session) -> None:
    vessel_in = VesselCreate(
        name=random_lower_string(),
        version='0.0.1',
        equipment_connections={'pump1': ['valve1']},
        equipment_identifiers=['pump1', 'valve1'],
    )
    vessel = create_vessel(session=db, vessel_in=vessel_in)
    update_data = VesselUpdate(
        equipment_connections={'pump1': ['valve1', 'valve2']},
        equipment_identifiers=['pump1', 'valve1', 'valve2'],
    )
    updated_vessel = update_vessel(session=db, vessel=vessel, vessel_in=update_data)
    assert updated_vessel.equipment_connections == update_data.equipment_connections
    assert updated_vessel.equipment_identifiers == update_data.equipment_identifiers


def test_create_or_update_vessel_create(db: Session) -> None:
    name = random_lower_string()
    version = '0.0.1'
    equipment_connections = {'pump1': ['valve1']}
    equipment_identifiers = ['pump1', 'valve1']
    vessel = create_or_update_vessel(
        session=db,
        name=name,
        version=version,
        equipment_connections=equipment_connections,
        equipment_identifiers=equipment_identifiers,
    )
    assert vessel.name == name
    assert vessel.version == version
    assert vessel.equipment_connections == equipment_connections
    assert vessel.equipment_identifiers == equipment_identifiers


def test_create_or_update_vessel_update(db: Session) -> None:
    name = random_lower_string()
    version = '0.0.1'
    vessel_in = VesselCreate(
        name=name,
        version=version,
        equipment_connections={'pump1': ['valve1']},
        equipment_identifiers=['pump1', 'valve1'],
    )
    vessel = create_vessel(session=db, vessel_in=vessel_in)
    new_equipment_connections = {'pump1': ['valve1', 'valve2']}
    new_equipment_identifiers = ['pump1', 'valve1', 'valve2']
    updated_vessel = create_or_update_vessel(
        session=db,
        name=name,
        version=version,
        equipment_connections=new_equipment_connections,
        equipment_identifiers=new_equipment_identifiers,
    )
    assert updated_vessel.id == vessel.id
    assert updated_vessel.equipment_connections == new_equipment_connections
    assert updated_vessel.equipment_identifiers == new_equipment_identifiers


def test_update_valve(db: Session) -> None:
    vessel_in = VesselCreate(
        name=random_lower_string(),
        version='0.0.1',
        equipment_connections={},
        equipment_identifiers=[],
    )
    vessel = create_vessel(session=db, vessel_in=vessel_in)
    valves = ['valve1']
    update_vessel_valves(session=db, vessel_id=vessel.id, valves=valves)
    updated_valve = update_valve(session=db, vessel_id=vessel.id, valve_identifier='valve1', is_open=True)
    assert updated_valve.is_open is True


def test_get_open_valves(db: Session) -> None:
    vessel_in = VesselCreate(
        name=random_lower_string(),
        version='0.0.1',
        equipment_connections={},
        equipment_identifiers=[],
    )
    vessel = create_vessel(session=db, vessel_in=vessel_in)
    valves = ['valve1', 'valve2']
    update_vessel_valves(session=db, vessel_id=vessel.id, valves=valves)
    update_valve(session=db, vessel_id=vessel.id, valve_identifier='valve2', is_open=False)
    open_valves = get_open_valves(session=db, vessel_id=vessel.id)
    assert open_valves == ['valve1']


def test_get_connected_equipment(db: Session, valve_ids: list, vessel_in: VesselCreate) -> None:
    vessel = create_vessel(session=db, vessel_in=vessel_in)
    update_vessel_valves(session=db, vessel_id=vessel.id, valves=valve_ids)
    update_valve(session=db, vessel_id=vessel.id, valve_identifier='VA002', is_open=False)
    update_valve(session=db, vessel_id=vessel.id, valve_identifier='VA023', is_open=False)
    update_valve(session=db, vessel_id=vessel.id, valve_identifier='VA006', is_open=False)
    connected_equipment = get_connected_equipment(session=db, vessel=vessel, start='pump1')
    assert connected_equipment == {'pump1', 'tank1'}
