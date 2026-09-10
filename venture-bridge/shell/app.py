"""Prakhar Bridge Shell — a standalone box whose only job is hosting a
token-gated live terminal, kept in its own container/env deliberately
separate from the Prakhar Bridge Board app. See ../README.md's terminal
section before enabling this anywhere real."""

import asyncio
import fcntl
import hmac
import os
import pty
import struct
import termios
import time

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import PlainTextResponse

TERMINAL_TOKEN = os.environ.get("TERMINAL_TOKEN", "")
TERMINAL_MAX_ATTEMPTS = 5
TERMINAL_ATTEMPT_WINDOW_S = 300
_failed_attempts: dict[str, list[float]] = {}

app = FastAPI(title="Prakhar Bridge Shell")


def _rate_limited(client_host: str) -> bool:
    now = time.time()
    attempts = [
        t for t in _failed_attempts.get(client_host, [])
        if now - t < TERMINAL_ATTEMPT_WINDOW_S
    ]
    _failed_attempts[client_host] = attempts
    return len(attempts) >= TERMINAL_MAX_ATTEMPTS


def _record_failure(client_host: str) -> None:
    _failed_attempts.setdefault(client_host, []).append(time.time())


@app.get("/")
def root():
    return PlainTextResponse(
        "Prakhar Bridge Shell is up. Connect via a WebSocket client at /ws/terminal "
        "(first text frame must be the terminal token)."
    )


@app.websocket("/ws/terminal")
async def terminal_ws(websocket: WebSocket):
    await websocket.accept()

    if not TERMINAL_TOKEN:
        await websocket.send_text("\r\n\x1b[31mTerminal is disabled: TERMINAL_TOKEN is not set on the server.\x1b[0m\r\n")
        await websocket.close()
        return

    client_host = websocket.client.host if websocket.client else "unknown"
    if _rate_limited(client_host):
        await websocket.send_text("\r\n\x1b[31mToo many failed attempts. Try again later.\x1b[0m\r\n")
        await websocket.close()
        return

    try:
        submitted_token = await asyncio.wait_for(websocket.receive_text(), timeout=10)
    except asyncio.TimeoutError:
        await websocket.close()
        return

    if not hmac.compare_digest(submitted_token, TERMINAL_TOKEN):
        _record_failure(client_host)
        await websocket.send_text("\r\n\x1b[31mInvalid token.\x1b[0m\r\n")
        await websocket.close()
        return

    await websocket.send_text("\x1b[32mConnected.\x1b[0m\r\n")

    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("/bin/bash", ["/bin/bash"])
        return  # unreachable; execvp replaces this process

    loop = asyncio.get_event_loop()

    def read_pty() -> bytes:
        try:
            return os.read(fd, 4096)
        except OSError:
            return b""

    async def pty_to_ws():
        while True:
            data = await loop.run_in_executor(None, read_pty)
            if not data:
                break
            await websocket.send_bytes(data)

    reader_task = asyncio.create_task(pty_to_ws())
    try:
        while True:
            message = await websocket.receive()
            if message["type"] == "websocket.disconnect":
                break
            text = message.get("text")
            data = message.get("bytes")
            if text is not None:
                if text.startswith("\x00RESIZE:"):
                    try:
                        cols, rows = map(int, text[len("\x00RESIZE:"):].split(","))
                        fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", rows, cols, 0, 0))
                    except (ValueError, OSError):
                        pass
                else:
                    os.write(fd, text.encode())
            elif data is not None:
                os.write(fd, data)
    except (WebSocketDisconnect, OSError):
        pass
    finally:
        reader_task.cancel()
        try:
            os.kill(pid, 9)
        except ProcessLookupError:
            pass
        try:
            os.close(fd)
        except OSError:
            pass
