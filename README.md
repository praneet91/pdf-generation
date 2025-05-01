# PDF Generator

A simple web application that converts webpages to PDF.

## Quick Start

1. Create `.env` file:

```
BROWSERLESS_TOKEN=your_browserless_token_here
```

2. Run with Docker:

```bash
docker compose up
```

3. Open http://localhost:3000 in your browser

## Development

```bash
npm install
npm run dev
```

## Features

- Convert any webpage to PDF
- Memory-efficient streaming of PDF output
- Robust image loading strategy
- Clean and simple user interface
- Input validation and error handling
- Dockerized deployment

## Prerequisites

- Node.js 20 or later
- Docker and Docker Compose (for containerized deployment)
- Browserless.io account and API token

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd pdf-generation
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```bash
cp .env.example .env
```

4. Add your Browserless token to the `.env` file:

```
BROWSERLESS_TOKEN=your_browserless_token_here
```

## Development

### Local Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Docker Development

Run the application using Docker Compose:

```bash
docker compose up
```

This will:

- Build the Docker image
- Start the container
- Mount your local files for development
- Watch for changes
- Automatically restart on crashes

To stop the application:

```bash
docker compose down
```

## Production Deployment

### Using Docker Compose

1. Build and start the containers:

```bash
docker compose -f docker-compose.yml up -d
```

2. Stop the containers:

```bash
docker compose down
```

### Using Docker (Alternative)

1. Build the Docker image:

```bash
docker build -t pdf-generation .
```

2. Run the container:

```bash
docker run -p 3000:3000 -e BROWSERLESS_TOKEN=your_browserless_token_here pdf-generation
```

## API Usage

Send a POST request to `/api/generate-pdf` with the following JSON body:

```json
{
  "url": "https://example.com"
}
```

The API will return a PDF file stream with the following headers:

- Content-Type: application/pdf
- Content-Disposition: attachment; filename="generated.pdf"

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400 Bad Request: Invalid input or unexpected properties
- 500 Internal Server Error: Server-side errors

## License

MIT
