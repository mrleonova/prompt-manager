# Prompt Manager

A comprehensive prompt management system for organizing, versioning, and sharing AI prompts.

## Features

### Backend
- **Express.js API** with RESTful endpoints
- **SQLite Database** for reliable data persistence
- **Comprehensive Data Models** for prompts, categories, tags, and versions
- **Input Validation** using Joi schemas
- **Error Handling** with detailed error responses
- **CORS Support** for frontend integration
- **Rate Limiting** for API protection
- **Logging System** using Winston
- **Version Control** for prompts with change tracking
- **Template System** with configurable variables
- **Batch Operations** for efficient management
- **Export Functionality** to JSON format

### Frontend
- **React 18** with TypeScript for type safety
- **Modern UI** with responsive design
- **Real-time Search** and filtering capabilities
- **Category Management** with color coding
- **Tag-based Organization** for easy discovery
- **Template System** with variable management
- **Version History** for tracking changes
- **Export/Import** functionality
- **Mobile-responsive** design

### Database Schema
- **Prompts**: Store content, metadata, and relationships
- **Categories**: Organize prompts with colors and descriptions
- **Tags**: Flexible labeling system with popularity tracking
- **Prompt Versions**: Complete version history with change logs
- **Template Variables**: Define reusable template parameters
- **Indexes**: Optimized for performance

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prompt-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Initialize the database**
   ```bash
   cd backend
   npm run db:init
   npm run db:seed
   ```

4. **Start the development servers**
   ```bash
   # In the root directory
   npm run dev
   ```

   This will start:
   - Backend API server on `http://localhost:3001`
   - Frontend development server on `http://localhost:5173`

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## API Documentation

See [API.md](./docs/API.md) for complete API documentation.

### Quick API Examples

```bash
# Health check
curl http://localhost:3001/api/health

# Get all prompts
curl http://localhost:3001/api/prompts

# Get prompts by category
curl "http://localhost:3001/api/prompts?categoryId=1"

# Search prompts
curl "http://localhost:3001/api/prompts?search=python"

# Create a new prompt
curl -X POST http://localhost:3001/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Prompt",
    "content": "Create a function that {description}",
    "isTemplate": true,
    "tags": ["development", "template"],
    "variables": [
      {
        "name": "description",
        "description": "What the function should do",
        "variableType": "text",
        "required": true
      }
    ]
  }'
```

## Project Structure

```
prompt-manager/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── database/        # Database connection and setup
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration
│   │   └── server.js        # Main server file
│   └── package.json
│
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main app component
│   └── package.json
│
├── database/                # Database schema and migrations
│   └── schema.sql           # SQLite database schema
│
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   └── README.md           # This file
│
└── package.json            # Root package.json with scripts
```

## Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_PATH=./database/prompts.db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend in development mode
npm run dev:backend      # Start only backend in development mode
npm run dev:frontend     # Start only frontend in development mode

# Building
npm run build           # Build both frontend and backend
npm run build:backend   # Build backend
npm run build:frontend  # Build frontend

# Testing
npm run test           # Run all tests
npm run test:backend   # Run backend tests
npm run test:frontend  # Run frontend tests

# Database
cd backend
npm run db:init        # Initialize database schema
npm run db:seed        # Populate with sample data

# Installation
npm run install:all    # Install all dependencies
```

## Features in Detail

### Prompt Management
- Create, read, update, delete prompts
- Rich text content with markdown support
- Categorization and tagging
- Favorite marking
- Usage tracking
- Search and filtering

### Template System
- Mark prompts as templates
- Define template variables with types
- Support for text, number, boolean, and select types
- Default values and validation
- Variable replacement engine

### Version Control
- Automatic version creation on content changes
- Change log tracking
- Version comparison
- Rollback capability
- Version history display

### Categories
- Color-coded organization
- Hierarchical structure support
- Category-based filtering
- Usage statistics

### Tags
- Flexible labeling system
- Popular tags tracking
- Tag-based search and filtering
- Auto-suggestion

### Data Export/Import
- JSON export with full data
- Batch operations
- Data validation on import
- Backup and restore capability

## License

This project is licensed under the MIT License.
