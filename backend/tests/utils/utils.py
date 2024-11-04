import random
import string

from fastapi.testclient import TestClient

from src.core.config import settings


def random_lower_string() -> str:
    return ''.join(random.choices(string.ascii_lowercase, k=32))


def random_email() -> str:
    return f'{random_lower_string()}@{random_lower_string()}.com'


def get_superuser_token_headers(client: TestClient) -> dict[str, str]:
    login_data = {
        'username': settings.FIRST_SUPERUSER,
        'password': settings.FIRST_SUPERUSER_PASSWORD,
    }
    r = client.post(f'{settings.API_V1_STR}/login/access-token', data=login_data)
    tokens = r.json()
    a_token = tokens['access_token']
    headers = {'Authorization': f'Bearer {a_token}'}
    return headers


def default_equipment_connections() -> dict:
    return {
        'TA001': ['VA001'],
        'VA001': ['TA001', 'PI001', 'VA002'],
        'TA002': ['VA003'],
        'VA003': ['TA002', 'PI002', 'VA002', 'VA004'],
        'TA003': ['VA005'],
        'VA005': ['TA003', 'PI003', 'VA004', 'VA006'],
        'TA004': ['VA007'],
        'VA007': ['TA004', 'PI004', 'VA006', 'VA008'],
        'TA005': ['VA009'],
        'VA009': ['TA005', 'PI005', 'VA008', 'VA010'],
        'TA006': ['VA011'],
        'VA011': ['TA006', 'PI006', 'VA010', 'VA012'],
        'overboard': ['VA015', 'VA016'],
        'VA015': ['overboard', 'PI010', 'VA013', 'VA017'],
        'VA016': ['overboard', 'PI011', 'VA014', 'VA018'],
        'seachest': ['VA021', 'VA022'],
        'VA021': ['seachest', 'PI012', 'VA019', 'VA023'],
        'VA022': ['seachest', 'PI013', 'VA020', 'VA024'],
        'PI001': ['VA001', 'VA002', 'VA012'],
        'VA002': ['PI001', 'VA001', 'VA012', 'PI002', 'VA003', 'PI007', 'VA013'],
        'VA012': ['PI001', 'VA002', 'PI006', 'VA011'],
        'PI002': ['VA002', 'VA003', 'VA004'],
        'VA004': ['PI002', 'VA003', 'PI003', 'VA005', 'PI014', 'VA023'],
        'PI003': ['VA004', 'VA005', 'VA006'],
        'VA006': ['PI003', 'VA005', 'PI004', 'VA007'],
        'PI004': ['VA006', 'VA007', 'VA008'],
        'VA008': ['PI004', 'VA007', 'PI005', 'VA009', 'PI016', 'VA024'],
        'PI005': ['VA008', 'VA009', 'VA010'],
        'VA010': ['PI005', 'VA009', 'PI006', 'VA011', 'PI009', 'VA014'],
        'PI006': ['VA010', 'VA011', 'VA012'],
        'PI007': ['VA002', 'VA013'],
        'VA013': ['PI007', 'VA002', 'PI008', 'VA014', 'PI010', 'VA015'],
        'PI008': ['VA013', 'VA014'],
        'VA014': ['PI008', 'VA013', 'PI009', 'VA010', 'PI011', 'VA016'],
        'PI009': ['VA010', 'VA014'],
        'PI010': ['VA013', 'VA015', 'VA017'],
        'VA017': ['PI010', 'VA015', 'PU01', 'VA019'],
        'PI011': ['VA014', 'VA016', 'VA018'],
        'VA018': ['PI011', 'VA016', 'PU02', 'VA020'],
        'PI012': ['VA019', 'VA021', 'VA023'],
        'VA019': ['PI012', 'VA021', 'PU01', 'VA017'],
        'VA023': ['PI012', 'VA021', 'PI014', 'VA004', 'PI015', 'VA024'],
        'PI013': ['VA020', 'VA022', 'VA024'],
        'VA020': ['PI013', 'VA022', 'PU02', 'VA018'],
        'VA024': ['PI013', 'VA022', 'PI015', 'VA023', 'PI016', 'VA008'],
        'PI014': ['VA004', 'VA023'],
        'PI015': ['VA023', 'VA024'],
        'PI016': ['VA008', 'VA024'],
        'PU01': ['VA017', 'VA019'],
        'PU02': ['VA018', 'VA020'],
    }


def default_equipment_identifiers() -> list[str]:
    return [
        'TA001',
        'TA002',
        'TA003',
        'TA004',
        'TA005',
        'TA006',
        'PI001',
        'PI002',
        'PI003',
        'PI004',
        'PI005',
        'PI006',
        'PI007',
        'PI008',
        'PI009',
        'PI010',
        'PI011',
        'PI012',
        'PI013',
        'PI014',
        'PI015',
        'PI016',
        'PU01',
        'PU02',
        'overboard',
        'seachest',
    ]


def default_valve_identifiers() -> list:
    return [
        'VA001',
        'VA002',
        'VA003',
        'VA004',
        'VA005',
        'VA006',
        'VA007',
        'VA008',
        'VA009',
        'VA010',
        'VA011',
        'VA012',
        'VA013',
        'VA014',
        'VA015',
        'VA016',
        'VA017',
        'VA018',
        'VA019',
        'VA020',
        'VA021',
        'VA022',
        'VA023',
        'VA024',
    ]
