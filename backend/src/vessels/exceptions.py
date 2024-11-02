class ValveNotFoundException(Exception):
    def __init__(self, detail: str = 'Valve not found'):
        self.detail = detail
