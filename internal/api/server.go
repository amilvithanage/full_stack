package api

import (
	"context"
	"full-stack-assesment/internal/scheme"
	"sync"
	"time"

	"github.com/google/uuid"
)

var _ StrictServerInterface = (*Server)(nil)

type Server struct {
	todoService *TodoService
}

type TodoService struct {
	todos []scheme.Todo
	mu    sync.RWMutex
}

func NewTodoService() *TodoService {
	return &TodoService{
		todos: make([]scheme.Todo, 0),
	}
}

func (s *TodoService) CreateTodo(title string) scheme.Todo {
	s.mu.Lock()
	defer s.mu.Unlock()

	todo := scheme.Todo{
		Id:        uuid.New().String(),
		Title:     title,
		Completed: false,
		CreatedAt: time.Now(),
	}

	s.todos = append(s.todos, todo)
	return todo
}

func (s *TodoService) GetAllTodos() []scheme.Todo {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Return a copy to avoid race conditions
	todos := make([]scheme.Todo, len(s.todos))
	copy(todos, s.todos)
	return todos
}

func NewServer() *Server {
	return &Server{
		todoService: NewTodoService(),
	}
}

func (s *Server) GetHealth(ctx context.Context, req GetHealthRequestObject) (GetHealthResponseObject, error) {
	return GetHealth200JSONResponse{
		Status: "ok",
	}, nil
}

func (s *Server) GetTodos(ctx context.Context, req GetTodosRequestObject) (GetTodosResponseObject, error) {
	todos := s.todoService.GetAllTodos()
	return GetTodos200JSONResponse(todos), nil
}

func (s *Server) CreateTodo(ctx context.Context, req CreateTodoRequestObject) (CreateTodoResponseObject, error) {
	if req.Body == nil {
		return CreateTodo400JSONResponse{
			Code:    400,
			Message: "Request body is required",
		}, nil
	}

	if req.Body.Title == "" {
		return CreateTodo400JSONResponse{
			Code:    400,
			Message: "Todo title is required",
		}, nil
	}

	if len(req.Body.Title) > 500 {
		return CreateTodo400JSONResponse{
			Code:    400,
			Message: "Todo title must be less than 500 characters",
		}, nil
	}

	todo := s.todoService.CreateTodo(req.Body.Title)
	return CreateTodo201JSONResponse(todo), nil
}
