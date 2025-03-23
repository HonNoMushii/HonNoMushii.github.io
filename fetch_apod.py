import os
import json
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()

def fetch_apod():
    api_key = os.getenv('NASA_API_KEY')
    response = requests.get(f'https://api.nasa.gov/planetary/apod?api_key={api_key}')
    data = response.json()

    # Load existing data
    if os.path.exists('data/apod.json'):
        with open('data/apod.json', 'r') as json_file:
            existing_data = json.load(json_file)
    else:
        existing_data = []

    # Check for duplicates
    if not any(entry['date'] == data['date'] for entry in existing_data):
        existing_data.append(data)

    # Save the updated data to the JSON file
    os.makedirs('data', exist_ok=True)
    with open('data/apod.json', 'w') as json_file:
        json.dump(existing_data, json_file, indent=4)

if __name__ == '__main__':
    fetch_apod()
