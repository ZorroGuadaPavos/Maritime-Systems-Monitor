from unittest.mock import MagicMock, patch

from src.load_vessel_settings import init_db, load_ballasting_system_from_yaml, logger


def test_load_ballasting_system_successful() -> None:
    yaml_file_mock = MagicMock()
    config_data_mock = {'name': 'Test Vessel', 'version': '1.0'}

    with (
        patch('builtins.open', return_value=yaml_file_mock),
        patch('yaml.safe_load', return_value=config_data_mock),
        patch('src.core.db.engine'),
        patch.object(logger, 'info'),
        patch.object(logger, 'error'),
        patch.object(logger, 'warn'),
    ):
        try:
            ballasting_system = load_ballasting_system_from_yaml('dummy_path')
            init_db(ballasting_system)
            load_successful = True
        except Exception:
            load_successful = False

        assert load_successful, 'Loading vessel settings should be successful and not raise an exception.'
