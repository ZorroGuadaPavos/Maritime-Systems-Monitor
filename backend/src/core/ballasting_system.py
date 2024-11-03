from collections import defaultdict


class BallastingSystem:
    def __init__(self, config_data: dict):
        """
        Initialize the ballasting system with the parsed YAML config data
        """
        self.equipment_identifiers = []
        self.name = config_data.get('vessel', 'Vessel')
        self.version = config_data.get('version', '0.0.1')
        self.tanks = self._process_components(config_data.get('tanks', {}), 'TA')
        self.pipes = self._process_components(config_data.get('pipes', {}), 'PI')
        self.pumps = self._process_components(config_data.get('pumps', {}), 'PU')
        self.sea = self._process_components(config_data.get('sea', {}), '')

        self.graph = defaultdict(list)
        self.valve_states = self._extract_all_valves()

        self._build_graph()

    def _process_components(self, components: dict, prefix: str) -> dict:
        """
        Transform the components dictionary into a dictionary with prefixed component IDs
        """
        result = {f'{prefix}{cid}': [f'VA{vid}' for vid in valves] for cid, valves in components.items()}
        self.equipment_identifiers.extend(result.keys())
        return result

    def _build_graph(self):
        """
        Build the graph of connections between equipment and valves
        """
        self._add_connections(self.tanks)
        self._add_connections(self.sea)
        self._add_connections(self.pipes, connect_sequence=True)
        self._add_connections(self.pumps, connect_sequence=True)

    def _add_connections(self, equipment_dict: dict, connect_sequence=False):
        """
        Add connections between equipment and valves to the graph
        """
        for equipment, components in equipment_dict.items():
            for component in components:
                self.graph[equipment].append(component)
                self.graph[component].append(equipment)
            if connect_sequence:
                for i in range(len(components) - 1):
                    self.graph[components[i]].append(components[i + 1])
                    self.graph[components[i + 1]].append(components[i])

    def _extract_all_valves(self) -> list[str]:
        """
        Extract all valves from the equipment dictionaries
        """
        valves = set()
        for connection in [self.tanks, self.pipes, self.pumps, self.sea]:
            for components in connection.values():
                valves.update(components)
        return list(valves)
