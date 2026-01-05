# OpenAI Apps SDK Integration

This calendar application is built as a **ChatGPT Plugin/App** using the OpenAI Apps SDK architecture.

## Architecture

The application follows the OpenAI Apps SDK pattern with:

1. **Plugin Manifest** (`public/ai-plugin.json`) - Describes the plugin to ChatGPT
2. **OpenAPI Specification** (`public/openapi.json`) - Defines available API endpoints
3. **API Routes** (`src/app/api/*`) - Server-side endpoints that ChatGPT can call
4. **Web Interface** - Traditional web UI for direct user interaction

## ChatGPT Integration

ChatGPT can interact with this calendar through the following operations:

### Available Actions

1. **Get Events** - Query calendar events with filters
   ```
   GET /api/events?startDate=2026-01-01&endDate=2026-01-31&category=work
   ```

2. **Create Event** - Add new events to the calendar
   ```
   POST /api/events
   Body: { title, startDate, endDate, description, location, category }
   ```

3. **Update Event** - Modify existing events
   ```
   PUT /api/events/{id}
   Body: { title, startDate, endDate, ... }
   ```

4. **Delete Event** - Remove events
   ```
   DELETE /api/events/{id}
   ```

5. **Parse Natural Language** - Convert natural language to events
   ```
   POST /api/parse-natural-language
   Body: { input: "Schedule a meeting next Tuesday at 3pm" }
   ```

6. **Suggest Times** - Get AI-powered meeting time suggestions
   ```
   POST /api/suggest-times
   Body: { duration: 60, participants: 3 }
   ```

## How ChatGPT Uses This App

When installed as a ChatGPT plugin, users can interact with their calendar through natural conversation:

**User**: "What do I have scheduled next week?"
→ ChatGPT calls `GET /api/events?startDate=...&endDate=...`

**User**: "Schedule a team meeting on Friday at 2pm"
→ ChatGPT calls `POST /api/parse-natural-language` or `POST /api/events`

**User**: "Find a good time for a 1-hour meeting this week"
→ ChatGPT calls `POST /api/suggest-times`

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Add your OPENAI_API_KEY
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Plugin Manifest**
   - Plugin manifest: `http://localhost:3000/.well-known/ai-plugin.json`
   - OpenAPI spec: `http://localhost:3000/api/openapi.json`

## Installing in ChatGPT

1. Go to ChatGPT Plugin Store
2. Choose "Develop your own plugin"
3. Enter your local URL: `localhost:3000`
4. ChatGPT will discover and install your calendar plugin

## API Routes Structure

```
src/app/api/
├── events/
│   ├── route.ts           # GET (list), POST (create)
│   └── [id]/
│       └── route.ts       # PUT (update), DELETE (delete)
├── parse-natural-language/
│   └── route.ts           # POST (NLP parsing)
├── suggest-times/
│   └── route.ts           # POST (smart scheduling)
└── openapi.json/
    └── route.ts           # GET (OpenAPI spec)
```

## Key Differences from Standard OpenAI SDK

### Standard SDK Approach (Previous)
- Client-side OpenAI API calls
- `dangerouslyAllowBrowser: true`
- Direct GPT-4 integration in React components

### Apps SDK Approach (Current)
- Server-side API routes
- OpenAPI specification for ChatGPT discovery
- Plugin manifest for ChatGPT integration
- RESTful API that ChatGPT can call
- Secure server-side OpenAI API usage

## Security

- All OpenAI API calls are server-side (no exposed API keys)
- No `dangerouslyAllowBrowser` flag needed
- API routes can be protected with authentication
- CORS can be configured for production

## Production Deployment

When deploying to production:

1. Set `OPENAI_API_KEY` in your hosting environment
2. Update the `url` in `public/ai-plugin.json` to your production URL
3. Update the `servers.url` in `public/openapi.json`
4. Configure CORS if needed for ChatGPT access
5. Consider adding authentication to API routes

## Testing the API

You can test the API endpoints directly:

```bash
# Get all events
curl http://localhost:3000/api/events

# Create an event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","startDate":"2026-01-15T10:00:00Z","endDate":"2026-01-15T11:00:00Z"}'

# Parse natural language
curl -X POST http://localhost:3000/api/parse-natural-language \
  -H "Content-Type: application/json" \
  -d '{"input":"Schedule a dentist appointment tomorrow at 2pm"}'
```

## Learn More

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk/)
- [ChatGPT Plugin Development](https://platform.openai.com/docs/plugins)
- [OpenAPI Specification](https://swagger.io/specification/)
