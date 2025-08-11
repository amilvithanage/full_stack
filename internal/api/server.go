package api

import (
	"context"
	"full-stack-assesment/internal/scheme"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"
)

var _ StrictServerInterface = (*Server)(nil)

type Server struct {
	todoStore TodoStore
}

// TodoStore abstracts todo persistence for Dependency Inversion and easier testing.
type TodoStore interface {
	CreateTodo(title string) scheme.Todo
	GetAllTodos() []scheme.Todo
	GetTodoByID(id string) (scheme.Todo, bool)
	UpdateTodo(id string, title *string, completed *bool) (scheme.Todo, bool)
	DeleteTodo(id string) bool
}

type TodoService struct {
	todos map[string]scheme.Todo
	mu    sync.RWMutex
}

func NewTodoService() *TodoService {
	return &TodoService{
		todos: make(map[string]scheme.Todo),
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

	s.todos[todo.Id] = todo
	return todo
}

func (s *TodoService) GetAllTodos() []scheme.Todo {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Build a slice copy to avoid race conditions
	todos := make([]scheme.Todo, 0, len(s.todos))
	for _, todo := range s.todos {
		todos = append(todos, todo)
	}
	// Optional: provide deterministic ordering (by CreatedAt ascending)
	sort.Slice(todos, func(i, j int) bool { return todos[i].CreatedAt.Before(todos[j].CreatedAt) })
	return todos
}

func (s *TodoService) GetTodoByID(id string) (scheme.Todo, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	todo, ok := s.todos[id]
	if !ok {
		return scheme.Todo{}, false
	}
	return todo, true
}

func (s *TodoService) UpdateTodo(id string, title *string, completed *bool) (scheme.Todo, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	todo, ok := s.todos[id]
	if !ok {
		return scheme.Todo{}, false
	}
	if title != nil {
		todo.Title = *title
	}
	if completed != nil {
		todo.Completed = *completed
	}
	s.todos[id] = todo
	return todo, true
}

func (s *TodoService) DeleteTodo(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.todos[id]; !ok {
		return false
	}
	delete(s.todos, id)
	return true
}

func NewServer() *Server { return NewServerWithStore(NewTodoService()) }

func NewServerWithStore(store TodoStore) *Server {
	return &Server{todoStore: store}
}

func (s *Server) GetHealth(ctx context.Context, req GetHealthRequestObject) (GetHealthResponseObject, error) {
	return GetHealth200JSONResponse{
		Status: "ok",
	}, nil
}

func (s *Server) GetTodos(ctx context.Context, req GetTodosRequestObject) (GetTodosResponseObject, error) {
	todos := s.todoStore.GetAllTodos()
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

	todo := s.todoStore.CreateTodo(req.Body.Title)
	return CreateTodo201JSONResponse(todo), nil
}

func (s *Server) UpdateTodo(ctx context.Context, req UpdateTodoRequestObject) (UpdateTodoResponseObject, error) {
	if req.Body == nil {
		return UpdateTodo400JSONResponse{
			Code:    400,
			Message: "Request body is required",
		}, nil
	}

	// Validate title if provided
	if req.Body.Title != nil {
		if *req.Body.Title == "" {
			return UpdateTodo400JSONResponse{
				Code:    400,
				Message: "Todo title cannot be empty",
			}, nil
		}
		if len(*req.Body.Title) > 500 {
			return UpdateTodo400JSONResponse{
				Code:    400,
				Message: "Todo title must be less than 500 characters",
			}, nil
		}
	}

	// Check if at least one field is provided
	if req.Body.Title == nil && req.Body.Completed == nil {
		return UpdateTodo400JSONResponse{
			Code:    400,
			Message: "At least one field (title or completed) must be provided",
		}, nil
	}

	todo, found := s.todoStore.UpdateTodo(req.Id, req.Body.Title, req.Body.Completed)
	if !found {
		return UpdateTodo404JSONResponse{
			Code:    404,
			Message: "Todo not found",
		}, nil
	}

	return UpdateTodo200JSONResponse(todo), nil
}

func (s *Server) DeleteTodo(ctx context.Context, req DeleteTodoRequestObject) (DeleteTodoResponseObject, error) {
	deleted := s.todoStore.DeleteTodo(req.Id)
	if !deleted {
		return DeleteTodo404JSONResponse{
			Code:    404,
			Message: "Todo not found",
		}, nil
	}

	return DeleteTodo204Response{}, nil
}
