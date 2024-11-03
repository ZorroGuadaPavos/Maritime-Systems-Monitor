import uuid
from typing import Any

from fastapi import APIRouter, HTTPException

from src.auth.services import CurrentUser, SessionDep
from src.vessels import services
from src.vessels.schemas import ValveListPublic, ValvePublic, ValveUpdate, VesselListPublic, VesselPublic

router = APIRouter()


@router.get('/{vessel_id}', response_model=VesselPublic)
def read_vessel(session: SessionDep, current_user: CurrentUser, vessel_id: uuid.UUID) -> Any:
    """
    Get vessel.
    """
    vessel = services.get_vessel(session=session, id=vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail='Vessel not found')
    return vessel


@router.get('/', response_model=VesselListPublic)
def read_vessels(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    """
    Get list of vessels.
    """
    vessels, count = services.get_vessels(session=session, skip=skip, limit=limit)
    return VesselListPublic(data=vessels, count=count)


@router.get('/{vessel_id}/valves', response_model=ValveListPublic)
def read_valves(
    session: SessionDep, current_user: CurrentUser, vessel_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> Any:
    """
    Get valves of a vessel.
    """
    valves, count = services.get_valves(session=session, vessel_id=vessel_id, skip=skip, limit=limit)
    return ValveListPublic(data=valves, count=count)


@router.put('/{vessel_id}/valves/{valve_identifier}', response_model=ValvePublic)
def update_valve(
    session: SessionDep, current_user: CurrentUser, vessel_id: uuid.UUID, valve_identifier: str, valve_in: ValveUpdate
) -> Any:
    """
    Update valve of a vessel.
    """
    try:
        valve = services.update_valve(
            session=session, vessel_id=vessel_id, valve_identifier=valve_identifier, is_open=valve_in.is_open
        )
    except services.ValveNotFoundException:
        raise HTTPException(status_code=404, detail='Valve not found')
    return valve


@router.get('/{vessel_id}/connected-equipment/{equipment_identifer}', response_model=list[str])
def flow_connected_equipment(
    session: SessionDep, current_user: CurrentUser, vessel_id: uuid.UUID, equipment_identifer: str
) -> Any:
    """
    Get connected equipment.
    """
    vessel = services.get_vessel(session=session, id=vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail='Vessel not found')
    return services.get_connected_equipment(session=session, vessel=vessel, start=equipment_identifer)
