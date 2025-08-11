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
- ✅ Update existing todo items
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
│   ├── api/                # Generated API handlers
│   ├── middleware/         # CORS and logging middleware
│   └── scheme/            # Generated schemas
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # Generated API client
│   │   └── App.tsx        # Main application
│   ├── Dockerfile         # Frontend container
│   └── package.json       # Frontend dependencies
├── Dockerfile.backend      # Backend container
├── docker-compose.yml      # Multi-service orchestration
└── go.mod                 # Go module definition
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
```

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

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update the OpenAPI specification if adding new endpoints
5. Regenerate code and test thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For questions or issues:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include logs and steps to reproduce if applicable
