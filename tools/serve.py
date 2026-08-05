#!/usr/bin/env python3
"""
Preview the site locally:

    python3 tools/serve.py

Then open http://localhost:8747 . Ctrl-C to stop.

(Serves the project folder directly rather than the shell's working directory,
so it behaves the same wherever you run it from.)
"""
import functools
import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8747


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # Keep the console readable — only report what actually failed.
        if not args or not str(args[1]).startswith("2"):
            sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    handler = functools.partial(Handler, directory=ROOT)
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
        print(f"Serving {ROOT}\n  http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
