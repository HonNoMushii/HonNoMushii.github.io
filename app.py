from flask import Flask, send_from_directory, jsonify
import os
from dotenv import load_dotenv
import requests

app = Flask(__name__, static_folder='.', static_url_path='')

# Load environment variables from .env file
load_dotenv()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(debug=True)
