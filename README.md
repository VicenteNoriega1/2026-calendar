# 2026 Calendar - AI-Powered Calendar Application (OpenAI Apps SDK)

An advanced, production-ready interactive calendar application for 2026 built with **Next.js**, **TypeScript**, **OpenAI's Apps SDK**, and **Model Context Protocol (MCP)** integration. This is a **ChatGPT Plugin/App** that can be installed directly into ChatGPT for AI-powered calendar management through natural conversation.

![2026 Calendar](https://img.shields.io/badge/Year-2026-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![OpenAI Apps SDK](https://img.shields.io/badge/OpenAI-Apps%20SDK-green)

## 🌟 Features

### 📅 Calendar Views
- **Month View**: Full month calendar with color-coded events
- **Week View**: Detailed weekly schedule with hourly time slots
- **Day View**: Comprehensive daily agenda with event details
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile

### ✨ Event Management
- **Create/Edit/Delete Events**: Full CRUD operations
- **Event Details**: Title, description, date, time, location, category
- **All-Day Events**: Support for events without specific times
- **Color-Coded Categories**: Work, Personal, Health, Meeting, Appointment, Birthday, Holiday, Other
- **Recurring Events**: Daily, weekly, monthly patterns (planned)
- **Event Reminders**: Configurable notifications (planned)

### 🤖 AI-Powered Features (OpenAI Apps SDK)

**This is a ChatGPT Plugin/App!** Install it in ChatGPT to manage your calendar through natural conversation.

- **Natural Language Processing**: Create events using plain English
  - "Schedule a meeting next Tuesday at 3pm with the marketing team"
  - "Dentist appointment tomorrow at 2pm"
- **Smart Scheduling**: AI suggests optimal meeting times based on your calendar
- **Conflict Detection**: Automatically detect scheduling conflicts
- **Event Summarization**: AI-generated summaries of busy days/weeks
- **Auto-Categorization**: Automatically categorize events based on content
- **ChatGPT Integration**: Talk to ChatGPT to manage your calendar
  - "What do I have scheduled next week?"
  - "Find a good time for a 1-hour meeting"
  - "Reschedule my Friday meeting to Monday"

### 🔄 MCP Integration
- **Context Persistence**: Maintains calendar state across sessions
- **Rich Context**: Provides full calendar context to AI for better suggestions
- **Action Handling**: Execute calendar actions through MCP protocol
- **State Synchronization**: Real-time sync between calendar and MCP server

### 💾 Data Persistence
- **Local Storage**: Events persist in browser localStorage
- **Real-time Updates**: Automatic UI updates on data changes
- **Export/Import**: iCal format support (planned)

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **OpenAI API Key**: Required for AI features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VicenteNoriega1/2026-calendar.git
   cd 2026-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_DEFAULT_TIMEZONE=America/New_York
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔌 Installing as a ChatGPT Plugin

This app can be installed directly into ChatGPT:

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **In ChatGPT**:
   - Go to ChatGPT Plugin Store
   - Choose "Develop your own plugin"
   - Enter: `localhost:3000`
   - ChatGPT will discover and install your calendar plugin

3. **Use natural conversation**:
   - "What meetings do I have next week?"
   - "Schedule a team standup tomorrow at 9am"
   - "Find a good time for a 1-hour meeting this week"

See [APPS_SDK.md](./APPS_SDK.md) for detailed Apps SDK documentation.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
/
├── public/
│   ├── ai-plugin.json            # ChatGPT plugin manifest
│   └── openapi.json              # OpenAPI specification for ChatGPT
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── api/                  # API routes for ChatGPT plugin
│   │   │   ├── events/           # Event CRUD operations
│   │   │   ├── parse-natural-language/  # NLP endpoint
│   │   │   ├── suggest-times/    # Smart scheduling endpoint
│   │   │   └── openapi.json/     # OpenAPI spec endpoint
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main calendar page
│   ├── components/               # React components
│   │   ├── Calendar/             # Calendar views
│   │   │   ├── MonthView.tsx
│   │   │   ├── WeekView.tsx
│   │   │   ├── DayView.tsx
│   │   │   └── CalendarHeader.tsx
│   │   ├── Events/               # Event components
│   │   │   └── EventModal.tsx
│   │   ├── UI/                   # Shared UI components
│   │   └── AI/                   # AI integration components
│   │       └── NaturalLanguageInput.tsx
│   ├── lib/                      # Core libraries
│   │   ├── mcp/                  # MCP integration
│   │   │   └── server.ts
│   │   ├── calendar/             # Calendar logic
│   │   │   ├── eventStore.ts
│   │   │   └── utils.ts
│   │   └── utils/                # Helper functions
│   │       └── helpers.ts
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCalendar.ts
│   │   ├── useEvents.ts
│   │   └── useMCP.ts
│   ├── types/                   # TypeScript type definitions
│   │   ├── calendar.ts
│   │   ├── event.ts
│   │   ├── ai.ts
│   │   └── mcp.ts
│   └── styles/                  # CSS styling
│       └── globals.css
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── README.md
```

## 🎯 Usage Examples

### Creating Events

#### Manual Creation
1. Click the **"Create Event"** button in the header
2. Fill in event details (title, date, time, description, etc.)
3. Select a category
4. Click **"Create"**

#### Natural Language Creation
Use the AI-powered input at the top of the calendar:
- "Team meeting tomorrow at 10am"
- "Lunch with Sarah on Friday at noon"
- "Dentist appointment next Monday at 2:30pm"
- "Birthday party Saturday evening"

### Navigating the Calendar
- **View Switcher**: Toggle between Month, Week, and Day views
- **Navigation**: Use arrow buttons or click "Today" to jump to current date
- **Click Events**: Click any event to view/edit details
- **Click Dates/Times**: Quick event creation for that specific time

### Managing Events
- **Edit**: Click an event and modify details
- **Delete**: Open event modal and click "Delete Event"
- **Categories**: Assign color-coded categories for better organization

## 🔧 Configuration

### User Preferences (MCP)
The MCP server manages user preferences including:
- **Working Hours**: Default 9 AM - 5 PM
- **Working Days**: Monday - Friday
- **Default Event Duration**: 60 minutes
- **Default Reminders**: 15 minutes and 1 hour before events
- **Theme**: Light, dark, or auto

### Timezone Support
The app automatically detects your timezone using the browser's `Intl.DateTimeFormat` API.

## 🤖 AI Features in Detail

### Natural Language Parsing
The AI uses GPT-4 to parse natural language inputs and extract:
- Event title
- Description
- Start/end dates and times
- Location
- Category
- All-day flag

### Conflict Detection
When creating events, the AI:
1. Checks for overlapping events
2. Calculates overlap duration
3. Suggests alternative times
4. Provides severity ratings (low/medium/high)

### Smart Scheduling
The AI can suggest optimal meeting times based on:
- Existing calendar events
- Working hours preferences
- Participant availability
- Time zone considerations

### Event Summarization
Generate AI summaries of your day/week:
- Total number of events
- Busy hours calculation
- Category breakdown
- Brief textual summary

## 🏗️ Architecture

### Frontend Architecture
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code throughout
- **Tailwind CSS**: Utility-first styling
- **date-fns**: Date manipulation and formatting

### State Management
- **React Hooks**: Custom hooks for calendar, events, and MCP state
- **Event Store**: Centralized event management with observer pattern
- **MCP Server**: Context management and persistence

### AI Integration
- **OpenAI SDK**: Direct integration with GPT-4 Turbo
- **Function Calling**: Structured event creation
- **Streaming**: Real-time AI responses (planned)

### Data Flow
```
User Input → Component → Hook → EventStore/MCP → LocalStorage
                ↓
         AI Processing (if natural language)
                ↓
         OpenAI API → Parse → Create Event
```

## 🧪 Testing

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🔐 Security Considerations

⚠️ **Important**: This application uses `dangerouslyAllowBrowser: true` for the OpenAI client, which is **NOT recommended for production**. In a production environment:

1. **Use Server-Side API Routes**: Move OpenAI calls to Next.js API routes
2. **Secure API Keys**: Never expose API keys in client-side code
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Input Validation**: Validate all user inputs before processing
5. **Authentication**: Add user authentication for multi-user support

### Recommended Production Setup
```typescript
// app/api/parse-event/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { input } = await request.json();
  // Process with OpenAI
  // Return result
}
```

## 🚧 Roadmap & Future Enhancements

- [ ] **Google Calendar Integration**: Sync with Google Calendar
- [ ] **iCal Import/Export**: Standard calendar format support
- [ ] **Recurring Events**: Full implementation with UI
- [ ] **Email Reminders**: Email notifications for upcoming events
- [ ] **Browser Notifications**: Push notifications
- [ ] **Collaborative Features**: Share calendars with others
- [ ] **Multi-user Support**: Authentication and user accounts
- [ ] **Dark Mode**: Theme switching
- [ ] **Drag and Drop**: Reschedule events by dragging
- [ ] **Event Templates**: Quick event creation from templates
- [ ] **Search & Filters**: Advanced event search
- [ ] **Calendar Analytics**: Insights and statistics
- [ ] **Mobile App**: Native mobile applications
- [ ] **Offline Support**: PWA with offline capabilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Vicente Noriega**
- GitHub: [@VicenteNoriega1](https://github.com/VicenteNoriega1)

## 🙏 Acknowledgments

- **OpenAI** for providing the powerful GPT-4 API
- **Next.js** team for the excellent React framework
- **Vercel** for hosting and deployment platform
- **date-fns** for date manipulation utilities
- **Tailwind CSS** for the styling framework

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/VicenteNoriega1/2026-calendar/issues) page
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

---

**Built with ❤️ using OpenAI's Apps SDK and Model Context Protocol** 
