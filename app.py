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

@app.route('/api/github-stats')
def github_stats():
    username = 'HonNoMushii'
    response = requests.get(f'https://api.github.com/users/{username}/repos')
    repos = response.json()
    repo_stats = [{'name': repo['name'], 'stars': repo['stargazers_count'], 'forks': repo['forks_count']} for repo in repos]
    return jsonify(repo_stats)

if __name__ == '__main__':
    app.run(debug=True)
