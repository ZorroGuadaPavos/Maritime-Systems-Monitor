import traceback

try:
    from .users.models import User  # noqa
    from .vessels.models import Vessel  # noqa
except Exception:
    traceback.print_exc()
