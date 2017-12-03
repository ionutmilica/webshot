# Webshot

Simple toy service that generates thumbnails and collects metadata
from various sites via a rest api.

## Requirements
- Node >= 8.9.1
- Yarn >= 1.3.1

## Development
You'll need to make the following steps:
```bash
yarn install
cp .env.example .env # edit this accordingly
yarn watch
```
See package.json for more commands.

## How to use
```bash
curl -X POST -d 'url=https://google.com' http://localhost:5000/api/v1/screenshot?secret=secret
```
Note: The secret is configurable from the .env file

## License
MIT
