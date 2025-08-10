import React from 'react';
import { Box, Loader, Text, Group } from '@mantine/core';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Group>
          <Loader size="lg" />
          <Text>Loading...</Text>
        </Group>
      </Box>
    );
  }

  if (!currentUser) {
    return null; // This will be handled by the parent component
  }

  return <>{children}</>;
}
