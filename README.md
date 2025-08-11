# Todo Application - Full Stack Project

A modern full-stack Todo application built with Go backend and React frontend, featuring a clean API-first architecture using OpenAPI specifications.

## 🏗️ Architecture

- **Backend**: Go 1.24.2 using net/http with OpenAPI code generation (oapi-codegen)
- **Frontend**: React 19 with TypeScript, Vite, and Mantine UI components
- **API**: RESTful API with OpenAPI 3.0 specification
- **Data Store**: In-memory storage for todo items
- **Containerization**: Docker with docker-compose for easy deployment

## ✨ Features

- ✅ Health check endpoint
- ✅ Create new todo items
- ✅ List all todo items
- ✅ Delete todo items
- ✅ Toggle todo completion status
- ✅ Modern, responsive UI with Mantine components
- ✅ Real-time updates using React Query
- ✅ Type-safe API client generated from OpenAPI spec
- ✅ Docker containerization for both services
- ✅ Comprehensive error handling and notifications

## 🚀 Quick Start

### Prerequisites

- **Go**: Version 1.24.2 or later
- **Node.js**: Version 18 or later
- **Docker**: For containerized deployment

### Authentication Setup

This application uses Firebase Authentication. Before running:

- For local development, see `frontend/FIREBASE_SETUP.md` or create `frontend/.env.local` with:
  ```bash
  VITE_FIREBASE_API_KEY=your-api-key
  VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your-project-id
  VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
  VITE_FIREBASE_APP_ID=your-app-id
  ```

### Option 1: Docker (Recommended)

The easiest way to run the application:

```bash
# Clone the repository
git clone <your-repo-url>
cd full_stack

# Start both services
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Option 2: Local Development

#### Backend

```bash
# Generate Go code from OpenAPI spec
go generate ./...

# Run the backend
go run cmd/main.go
```

The backend will start on http://localhost:8080

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Generate TypeScript client from OpenAPI spec
npm run openapi

# Start development server
npm run dev
```

The frontend will be available at http://localhost:5173

## 📁 Project Structure

```
full_stack/
├── api/
│   └── openapi.yml          # OpenAPI specification
├── cmd/
│   └── main.go             # Backend entry point
├── internal/
│   ├── api/                # Generated API handlers and server logic
│   ├── middleware/         # CORS and logging middleware
│   ├── scheme/            # Generated schemas
│   └── config/            # Configuration (empty)
├── frontend/
│   ├── src/
│   │   ├── components/     # React components (Auth, Header, TodoList)
│   │   ├── api/           # Generated API client and hey-api.ts
│   │   ├── contexts/      # AuthContext for Firebase auth
│   │   ├── config/        # Firebase configuration
│   │   ├── hooks/         # Custom React hooks
│   │   ├── test/          # Test setup files
│   │   └── App.tsx        # Main application
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container
│   ├── nginx.conf         # Nginx configuration
│   ├── package.json       # Frontend dependencies
│   ├── FIREBASE_SETUP.md  # Firebase setup guide
│   └── AUTHENTICATION_SUMMARY.md # Auth implementation details
├── config/                # Configuration (empty)
├── Dockerfile.backend      # Backend container
├── docker-compose.yml      # Multi-service orchestration
├── go.mod                 # Go module definition
└── go.sum                 # Go dependencies checksum
```

## 🔧 API Endpoints

### Health Check
- `GET /health` - Service health status

### Todos
- `GET /todos` - Retrieve all todo items
- `POST /todos` - Create a new todo item
- `PUT /todos/{id}` - Update a todo item
- `DELETE /todos/{id}` - Delete a todo item

### Data Models

**Todo Item:**
```json
{
  "id": "uuid-string",
  "title": "Todo title",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Create Todo Request:**
```json
{
  "title": "Todo title"
}
```

**Update Todo Request:**
```json
{
  "title": "Updated todo title",
  "completed": true
}
```

## 🛠️ Development

### Code Generation

The project uses OpenAPI code generation to maintain consistency between the API specification and implementation:

```bash
# Generate Go backend code
go generate ./...

# Generate TypeScript frontend client
cd frontend && npm run openapi
```

### Adding New Features

1. Update the OpenAPI specification in `api/openapi.yml`
2. Regenerate the code using the commands above
3. Implement the business logic in the generated handlers
4. Update the frontend to use new endpoints

### Testing

```bash
# Backend tests
go test ./...

# Run specific test files
go test ./internal/api/...
go test ./internal/middleware/...

# Run tests with coverage
go test -cover ./...
```

**Note**: Frontend tests are planned for future implementation using Jest and React Testing Library.

## 📋 Assessment Requirements Status

This project was built as a full-stack engineer code assessment. Here's the status of the original requirements:

### 🚀 Additional Features Implemented
- [x] **Authentication**: Firebase Authentication integration
- [x] **Modern UI**: Mantine UI components with responsive design
- [x] **Health Checks**: Docker health checks and monitoring
- [x] **Documentation**: Comprehensive README and implementation review

## 🐳 Docker

### Backend Container
- Base image: `golang:1.24.2-alpine`
- Exposes port 8080
- Health check endpoint at `/health`

### Frontend Container
- Base image: `node:18-alpine` for build, `nginx:alpine` for runtime
- Exposes port 80
- Serves static files with Nginx

### Docker Compose
- Orchestrates both services
- Creates a bridge network for service communication
- Includes health checks and restart policies

## 🔍 Monitoring

Both services include health checks:
- Backend: HTTP health check at `/health`
- Frontend: HTTP health check at root endpoint
- Docker health checks configured for automatic restart

## 💾 Data Layer Limitations & Improvements

### Current Implementation ❌
- **In-Memory Storage**: Data is lost on server restart
- **No Persistence**: Todos are not saved between sessions
- **No User Isolation**: All todos are shared globally
- **No Data Validation**: Limited input validation
- **No Backup**: No data backup or recovery mechanism

### Required Database Implementation 🔴
- [ ] **PostgreSQL Setup** - Relational database for structured data

### Database Schema Design
```sql
-- Users table (Firebase auth integration)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Todos table
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at);
```

## 🧪 Testing Status

### Backend Testing ✅
- **Unit Tests**: Comprehensive tests for todo service logic
- **Integration Tests**: API endpoint testing with proper HTTP status codes
- **Coverage**: Good test coverage for critical business logic
- **Test Files**: 
  - `internal/api/todoservice_test.go`
  - `internal/api/server_test.go`
  - `internal/middleware/cors_test.go`

### Testing Improvements Needed
- [ ] **Setup Jest + React Testing Library** for frontend unit testing
- [ ] **Add component tests** for all React components
- [ ] **Implement API integration tests** for todo operations
- [ ] **Add E2E tests** with Playwright or Cypress
- [ ] **Add performance testing** for large todo lists
- [ ] **Implement visual regression testing** for UI consistency
- [ ] **Add test coverage reporting** for both frontend and backend

## 🚀 Future Enhancements

### 🔴 Critical Missing Features (High Priority)
- [ ] **Frontend Testing Suite** - Jest + React Testing Library setup
- [ ] **Database Layer** - Replace in-memory storage with PostgreSQL/MongoDB
- [ ] **User Authentication Integration** - Connect Firebase auth to backend
- [ ] **Input Validation** - Backend validation for todo creation/updates
- [ ] **Error Boundary** - React error boundaries for better error handling

### 🟡 Important Improvements (Medium Priority)
- [ ] **Search & Filtering** - Search todos by title, filter by completion status
- [ ] **Pagination** - Handle large todo lists efficiently
- [ ] **Todo Categories/Tags** - Organize todos with categories
- [ ] **Due Dates & Reminders** - Add due dates and notification system
- [ ] **Bulk Operations** - Select multiple todos for batch actions
- [ ] **Data Export/Import** - Export todos to JSON/CSV, import from files
- [ ] **Offline Support** - Service worker for offline functionality

### 🟢 Nice-to-Have Features (Low Priority)
- [ ] **Real-time Collaboration** - WebSocket support for shared todo lists
- [ ] **Advanced Analytics** - Todo completion statistics and insights
- [ ] **Mobile App** - React Native version
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Dark/Light Theme** - Theme switching capability
- [ ] **Keyboard Shortcuts** - Power user keyboard navigation
- [ ] **Todo Templates** - Predefined todo templates for common tasks

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

