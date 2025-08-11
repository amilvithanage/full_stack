package api

import (
    "testing"
)

func TestTodoService_BasicCRUD(t *testing.T) {
    store := NewTodoService()

    // Create
    todo := store.CreateTodo("read clean architecture")
    if todo.Id == "" || todo.Title != "read clean architecture" || todo.Completed {
        t.Fatalf("unexpected created todo: %+v", todo)
    }

    // Read all
    all := store.GetAllTodos()
    if len(all) != 1 {
        t.Fatalf("expected 1, got %d", len(all))
    }

    // Get by id
    got, ok := store.GetTodoByID(todo.Id)
    if !ok || got.Id != todo.Id {
        t.Fatalf("expected to find by id")
    }

    // Update title and completed
    newTitle := "read DDD"
    completed := true
    updated, ok := store.UpdateTodo(todo.Id, &newTitle, &completed)
    if !ok || updated.Title != newTitle || !updated.Completed {
        t.Fatalf("unexpected updated: %+v", updated)
    }

    // Delete
    if !store.DeleteTodo(todo.Id) {
        t.Fatalf("expected delete to succeed")
    }
    if store.DeleteTodo(todo.Id) {
        t.Fatalf("expected second delete to fail")
    }
}

