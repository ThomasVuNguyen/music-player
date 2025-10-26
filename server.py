#!/usr/bin/env python3
"""
Simple HTTP server for the music player that auto-detects music files
"""

import os
import json
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, unquote
import pathlib

class MusicPlayerHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)

        # API endpoint to list music files
        if parsed_path.path == '/api/songs':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Get all music files from the music directory
            music_dir = os.path.join(os.getcwd(), 'music')
            songs = []

            if os.path.exists(music_dir):
                supported_formats = {'.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'}

                for filename in os.listdir(music_dir):
                    file_path = os.path.join(music_dir, filename)
                    if os.path.isfile(file_path):
                        ext = os.path.splitext(filename)[1].lower()
                        if ext in supported_formats:
                            # Remove extension from title for display
                            title = os.path.splitext(filename)[0]

                            # Try to parse artist from filename if it contains a dash
                            # Format: "Artist - Title.mp3" or "Title.mp3"
                            if ' - ' in title:
                                parts = title.split(' - ', 1)
                                artist = parts[0].strip()
                                song_title = parts[1].strip()
                            else:
                                artist = 'Unknown Artist'
                                song_title = title

                            songs.append({
                                'file': f'music/{filename}',
                                'title': song_title,
                                'artist': artist,
                                'filename': filename
                            })

            # Sort songs by filename for consistent ordering
            songs.sort(key=lambda x: x['filename'])

            response = {
                'songs': songs,
                'count': len(songs)
            }

            self.wfile.write(json.dumps(response).encode())
            return

        # Serve static files normally
        super().do_GET()

def run_server(port=1306):
    server_address = ('', port)
    httpd = HTTPServer(server_address, MusicPlayerHandler)
    print(f'Music Player Server running on http://localhost:{port}')
    print(f'Serving files from: {os.getcwd()}')
    print(f'Music folder: {os.path.join(os.getcwd(), "music")}')
    print('\nPress Ctrl+C to stop the server')

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n\nServer stopped')
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
