import { useState } from 'react';
import { Box, Container, Title, Text, Group } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons-react';
import { Login } from './Login';
import { Signup } from './Signup';

export function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container size="sm" py="xl">
      <Box style={{ textAlign: 'center' }} mb="xl">
        <Group justify="center" mb="md">
          <IconShieldLock size={48} color="var(--mantine-color-blue-6)" />
        </Group>
        <Title order={1} size="h2" mb="xs">
          Todo App
        </Title>
        <Text c="dimmed" size="lg">
          Secure authentication for your tasks
        </Text>
      </Box>

      {isLogin ? (
        <Login onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <Signup onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </Container>
  );
}
