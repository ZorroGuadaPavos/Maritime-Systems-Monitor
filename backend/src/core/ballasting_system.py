from collections import defaultdict


class BallastingSystem:
    def __init__(self, config_data):
        # Initialize components from the parsed YAML config data
        self.name = config_data.get('vessel', 'Vessel')
        self.tanks = self._process_components(config_data.get('tanks', {}), 'T')
        self.pipes = self._process_components(config_data.get('pipes', {}), 'PI')
        self.pumps = self._process_components(config_data.get('pumps', {}), 'PU')
        self.sea = self._process_components(config_data.get('sea', {}), '')

        # Initialize graph and valve states
        self.graph = defaultdict(list)  # Store graph as an adjacency list
        self.valve_states = self._extract_all_valves()

        # Build graph connections
        self._build_graph()

    def _process_components(self, components_dict, prefix):
        return {f'{prefix}{cid}': [f'VA{vid}' for vid in valves] for cid, valves in components_dict.items()}

    def _build_graph(self):
        # Build the connections in the graph
        self._add_connections(self.tanks)
        self._add_connections(self.sea)
        self._add_connections(self.pipes, connect_sequence=True)
        self._add_connections(self.pumps, connect_sequence=True)

    def _add_connections(self, equipment_dict, connect_sequence=False):
        # Connect equipment and valves, and optionally link valves in sequence
        for equipment, components in equipment_dict.items():
            for component in components:
                self.graph[equipment].append(component)
                self.graph[component].append(equipment)
            if connect_sequence:
                for i in range(len(components) - 1):
                    self.graph[components[i]].append(components[i + 1])
                    self.graph[components[i + 1]].append(components[i])

    def _extract_all_valves(self):
        # Extract all unique valves from all connections
        valves = set()
        for connection in [self.tanks, self.pipes, self.pumps, self.sea]:
            for components in connection.values():
                valves.update(components)
        return list(valves)
