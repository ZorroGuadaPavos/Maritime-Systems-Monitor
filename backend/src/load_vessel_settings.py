import logging

import yaml
from sqlmodel import Session

from src.core.config import settings
from src.core.db import engine
from src.vessels.services import create_or_update_vessel, update_vessel_valves
from src.vessels.utils import BallastingSystem

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_ballasting_system_from_yaml(yaml_file_path):
    with open(yaml_file_path, 'r') as file:
        config_data = yaml.safe_load(file)
    return BallastingSystem(config_data)


def init_db(ballasting_system: BallastingSystem):
    with Session(engine) as session:
        vessel = create_or_update_vessel(
            session=session,
            name=ballasting_system.name,
            version=ballasting_system.version,
            equipment_connections=ballasting_system.graph,
            equipment_identifiers=ballasting_system.equipment_identifiers,
        )
        update_vessel_valves(session=session, vessel_id=vessel.id, valves=ballasting_system.valve_states)


def main() -> None:
    logger.info('Loading Vessel settings')
    ballasting_system = load_ballasting_system_from_yaml(settings.VESSEL_SETTINGS_PATH)
    init_db(ballasting_system)
    logger.info('Vessel data loaded successfully')


if __name__ == '__main__':
    main()
