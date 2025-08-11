package middleware

import (
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestCORSMiddleware_PreflightAndHeaders(t *testing.T) {
    next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusTeapot)
    })

    h := CORSMiddleware(next)

    // OPTIONS preflight should short-circuit with 200
    rr := httptest.NewRecorder()
    req := httptest.NewRequest(http.MethodOptions, "/anything", nil)
    h.ServeHTTP(rr, req)
    if rr.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rr.Code)
    }
    if rr.Header().Get("Access-Control-Allow-Origin") == "" {
        t.Fatalf("expected CORS headers to be present")
    }

    // Non-OPTIONS should pass through while still setting headers
    rr = httptest.NewRecorder()
    req = httptest.NewRequest(http.MethodGet, "/anything", nil)
    h.ServeHTTP(rr, req)
    if rr.Code != http.StatusTeapot {
        t.Fatalf("expected next to be called, got %d", rr.Code)
    }
    if rr.Header().Get("Access-Control-Allow-Methods") == "" {
        t.Fatalf("expected CORS methods header")
    }
}

