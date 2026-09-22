"""Example function tool the agent can call mid-run.

Swap this out for whatever the agent actually needs to act on (an
internal API, a database lookup, a search call, ...). Any plain Python
function with type-hinted arguments and a docstring works — the SDK
turns it into a tool schema and invokes it automatically when the
model decides to call it.
"""

from datetime import datetime, timezone


def get_current_time() -> str:
    """Return the current UTC time as an ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


AGENT_FUNCTIONS = {get_current_time}
