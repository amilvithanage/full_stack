package api_test

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	api "full-stack-assesment/internal/api"
	"full-stack-assesment/internal/middleware"
)

// newTestServer wires the same stack as cmd/main.go for HTTP-level tests.
func newTestServer() http.Handler {
	server := api.NewServer()
	strict := api.NewStrictHandler(server, nil)
	mux := http.NewServeMux()
	h := api.HandlerFromMux(strict, mux)
	h = middleware.CORSMiddleware(h)
	h = middleware.LoggingMiddleware(h)
	return h
}

func doRequest(t *testing.T, h http.Handler, method, path string, body any) *httptest.ResponseRecorder {
	t.Helper()
	var bodyReader io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			t.Fatalf("failed to marshal body: %v", err)
		}
		bodyReader = bytes.NewReader(b)
	}
	req := httptest.NewRequest(method, path, bodyReader)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	rr := httptest.NewRecorder()
	h.ServeHTTP(rr, req)
	return rr
}

func TestHealthAndCORS(t *testing.T) {
	h := newTestServer()

	// OPTIONS preflight handled by CORS middleware
	rr := doRequest(t, h, http.MethodOptions, "/health", nil)
	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200 for OPTIONS, got %d", rr.Code)
	}
	if got := rr.Header().Get("Access-Control-Allow-Origin"); got == "" {
		t.Fatalf("expected CORS headers to be set")
	}

	// GET /health OK
	rr = doRequest(t, h, http.MethodGet, "/health", nil)
	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.Code)
	}
	var body struct {
		Status string `json:"status"`
	}
	if err := json.Unmarshal(rr.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if body.Status != "ok" {
		t.Fatalf("expected status ok, got %q", body.Status)
	}
}

func TestTodosCRUD(t *testing.T) {
	h := newTestServer()

	// Create validations
	rr := doRequest(t, h, http.MethodPost, "/todos", map[string]string{"title": ""})
	if rr.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for empty title, got %d", rr.Code)
	}

	// Create OK
	rr = doRequest(t, h, http.MethodPost, "/todos", map[string]string{"title": "Write tests"})
	if rr.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", rr.Code)
	}
	var created struct {
		Id        string `json:"id"`
		Title     string `json:"title"`
		Completed bool   `json:"completed"`
	}
	if err := json.Unmarshal(rr.Body.Bytes(), &created); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if created.Title != "Write tests" || created.Id == "" || created.Completed {
		t.Fatalf("unexpected created todo: %+v", created)
	}

	// List should contain 1 item
	rr = doRequest(t, h, http.MethodGet, "/todos", nil)
	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.Code)
	}
	var list []map[string]any
	if err := json.Unmarshal(rr.Body.Bytes(), &list); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if len(list) != 1 {
		t.Fatalf("expected 1 todo, got %d", len(list))
	}

	// Update validations
	rr = doRequest(t, h, http.MethodPut, "/todos/does-not-exist", map[string]any{"completed": true})
	if rr.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for missing id, got %d", rr.Code)
	}
	rr = doRequest(t, h, http.MethodPut, "/todos/"+created.Id, map[string]any{})
	if rr.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for empty body, got %d", rr.Code)
	}

	// Update OK
	rr = doRequest(t, h, http.MethodPut, "/todos/"+created.Id, map[string]any{"completed": true})
	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200 for update, got %d", rr.Code)
	}
	var updated struct {
		Id        string `json:"id"`
		Title     string `json:"title"`
		Completed bool   `json:"completed"`
	}
	if err := json.Unmarshal(rr.Body.Bytes(), &updated); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if !updated.Completed || updated.Id != created.Id {
		t.Fatalf("unexpected updated todo: %+v", updated)
	}

	// Delete OK
	rr = doRequest(t, h, http.MethodDelete, "/todos/"+created.Id, nil)
	if rr.Code != http.StatusNoContent {
		t.Fatalf("expected 204 for delete, got %d", rr.Code)
	}

	// Delete not found
	rr = doRequest(t, h, http.MethodDelete, "/todos/"+created.Id, nil)
	if rr.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for second delete, got %d", rr.Code)
	}
}
