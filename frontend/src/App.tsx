import './App.css'

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthContainer } from './components/Auth/AuthContainer';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <>
      <Header />
      {currentUser ? (
        <ProtectedRoute>
          <TodoList />
        </ProtectedRoute>
      ) : (
        <AuthContainer />
      )}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

