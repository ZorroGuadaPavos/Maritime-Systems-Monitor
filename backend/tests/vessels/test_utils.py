import pytest

from src.vessels.utils import BallastingSystem


@pytest.fixture
def config_data():
    return {
        'vessel': 'test_vessel',
        'version': '0.0.2',
        'tanks': {
            '001': ['001'],
            '002': ['003'],
            '003': ['005'],
        },
        'pipes': {
            '001': ['001', '002', '012'],
            '002': ['002', '003', '004'],
            '003': ['004', '005', '006'],
            '004': ['005', '009', '010'],
        },
        'pumps': {
            '001': ['009', '010'],
        },
        'sea': {
            'overboard': ['006'],
            'seachest': ['012'],
        },
    }


def test_ballasting_system_initialization(config_data):
    bs = BallastingSystem(config_data)
    assert bs.name == 'test_vessel'
    assert bs.version == '0.0.2'


def test_process_components(config_data):
    bs = BallastingSystem(config_data)
    assert bs.pipes == {
        'PI001': ['VA001', 'VA002', 'VA012'],
        'PI002': ['VA002', 'VA003', 'VA004'],
        'PI003': ['VA004', 'VA005', 'VA006'],
        'PI004': ['VA005', 'VA009', 'VA010'],
    }
    assert bs.tanks == {'TA001': ['VA001'], 'TA002': ['VA003'], 'TA003': ['VA005']}
    assert bs.pumps == {'PU001': ['VA009', 'VA010']}
    assert bs.sea == {'overboard': ['VA006'], 'seachest': ['VA012']}


def test_build_graph(config_data):
    bs = BallastingSystem(config_data)
    assert bs.graph['TA001'] == ['VA001']
    assert bs.graph['VA001'] == ['TA001', 'PI001', 'VA002']
    assert bs.graph['PI001'] == ['VA001', 'VA002', 'VA012']
    assert bs.graph['overboard'] == ['VA006']
    assert bs.graph['seachest'] == ['VA012']
    assert bs.graph['VA012'] == ['seachest', 'PI001', 'VA002']


def test_extract_all_valves(config_data):
    bs = BallastingSystem(config_data)
    valves = bs._extract_all_valves()
    assert sorted(valves) == sorted(['VA001', 'VA006', 'VA004', 'VA010', 'VA009', 'VA002', 'VA003', 'VA012', 'VA005'])
