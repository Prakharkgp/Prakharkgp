"""SQLite-backed access to the local BDD fixtures (agents/bdd/*.json).

Files stay on disk (nothing is deleted); on first access their raw content is
loaded once into the `bdd_documents` table (as a BLOB) inside the same
signal_desk.db used by the rest of the app, and every subsequent read goes
through SQLite instead of the filesystem.
"""

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BACKEND_DIR / "signal_desk.db"
BDD_DIR = Path(__file__).resolve().parent / "bdd"


@contextmanager
def _get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def _ensure_loaded(conn) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS bdd_documents (
            filename TEXT PRIMARY KEY,
            content BLOB NOT NULL,
            loaded_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    if not BDD_DIR.exists():
        return
    now = datetime.now(timezone.utc).isoformat()
    for path in sorted(BDD_DIR.glob("*.json")):
        conn.execute(
            "INSERT OR IGNORE INTO bdd_documents (filename, content, loaded_at) VALUES (?, ?, ?)",
            (path.name, path.read_bytes(), now),
        )
    conn.commit()


def get_document(filename: str) -> dict:
    """Return one bdd/*.json document (parsed) by filename, from SQLite."""
    with _get_conn() as conn:
        _ensure_loaded(conn)
        row = conn.execute("SELECT content FROM bdd_documents WHERE filename = ?", (filename,)).fetchone()
        if row is None:
            raise FileNotFoundError(f"No bdd document stored for {filename!r}")
        return json.loads(bytes(row["content"]).decode("utf-8"))


def list_documents() -> list[str]:
    with _get_conn() as conn:
        _ensure_loaded(conn)
        return [r["filename"] for r in conn.execute("SELECT filename FROM bdd_documents ORDER BY filename")]
