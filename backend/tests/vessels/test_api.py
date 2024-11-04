import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from src.core.config import settings
from src.vessels import services
from src.vessels.schemas import VesselCreate
from tests.utils.utils import random_lower_string


@pytest.fixture
def vessel(equipment_ids, connections) -> VesselCreate:
    return VesselCreate(
        name=random_lower_string(),
        version='1.0',
        equipment_connections=connections,
        equipment_identifiers=equipment_ids,
    )


def test_read_vessel(
    client: TestClient, db: Session, normal_user_token_headers: dict[str, str], vessel: VesselCreate
) -> None:
    vessel = services.create_vessel(session=db, vessel_in=vessel)

    r = client.get(f'{settings.API_V1_STR}/vessels/{vessel.id}', headers=normal_user_token_headers)
    assert r.status_code == 200
    response = r.json()
    assert response['id'] == str(vessel.id)
    assert response['name'] == vessel.name


def test_read_vessels(
    client: TestClient,
    db: Session,
    normal_user_token_headers: dict[str, str],
    vessel: VesselCreate,
    equipment_ids: list,
    connections: dict,
) -> None:
    vessel2 = VesselCreate(
        name=random_lower_string(),
        version='1.0',
        equipment_connections=connections,
        equipment_identifiers=equipment_ids,
    )
    services.create_vessel(session=db, vessel_in=vessel)
    services.create_vessel(session=db, vessel_in=vessel2)

    r = client.get(
        f'{settings.API_V1_STR}/vessels/', headers=normal_user_token_headers, params={'skip': 0, 'limit': 10}
    )
    assert r.status_code == 200
    vessels = r.json()['data']
    assert len(vessels) >= 2


def test_read_valves(
    client: TestClient, db: Session, normal_user_token_headers: dict[str, str], vessel: VesselCreate
) -> None:
    identifier = 'VA001'
    valves_in = [identifier]
    vessel = services.create_vessel(session=db, vessel_in=vessel)
    services.update_vessel_valves(session=db, vessel_id=vessel.id, valves=valves_in)

    r = client.get(f'{settings.API_V1_STR}/vessels/{vessel.id}/valves', headers=normal_user_token_headers)
    assert r.status_code == 200
    valves = r.json()['data']
    assert len(valves) == 1
    assert valves[0]['identifier'] == identifier
    assert valves[0]['is_open'] is True


def test_update_valve(
    client: TestClient, db: Session, normal_user_token_headers: dict[str, str], vessel: VesselCreate
) -> None:
    identifier = 'VA001'
    valves_in = [identifier]
    vessel = services.create_vessel(session=db, vessel_in=vessel)
    services.update_vessel_valves(session=db, vessel_id=vessel.id, valves=valves_in)

    update_data = {'is_open': False}
    r = client.put(
        f'{settings.API_V1_STR}/vessels/{vessel.id}/valves/{identifier}',
        headers=normal_user_token_headers,
        json=update_data,
    )
    assert r.status_code == 200
    updated_valve = r.json()
    assert updated_valve['is_open'] is False


def test_fetch_connected_equipment(
    client: TestClient, db: Session, normal_user_token_headers: dict[str, str], vessel: VesselCreate, valve_ids: list
) -> None:
    equipment_indentifier = 'TA003'
    vessel = services.create_vessel(session=db, vessel_in=vessel)
    services.update_vessel_valves(session=db, vessel_id=vessel.id, valves=valve_ids)
    services.update_valve(session=db, vessel_id=vessel.id, valve_identifier='VA002', is_open=False)
    services.update_valve(session=db, vessel_id=vessel.id, valve_identifier='VA006', is_open=False)
    services.update_valve(session=db, vessel_id=vessel.id, valve_identifier='VA023', is_open=False)

    r = client.get(f'{settings.API_V1_STR}/vessels/{vessel.id}/valves', headers=normal_user_token_headers)

    r = client.get(
        f'{settings.API_V1_STR}/vessels/{vessel.id}/connected-equipment/{equipment_indentifier}',
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    connected_equipment = r.json()
    assert sorted(connected_equipment) == sorted(['TA003', 'TA002', 'PI014', 'PI002', 'PI003'])
