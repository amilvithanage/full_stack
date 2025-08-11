import React, { useState } from 'react';
import { 
  Card, 
  TextInput, 
  PasswordInput, 
  Button, 
  Stack, 
  Text, 
  Anchor, 
  Group,
  Divider
} from '@mantine/core';
import { IconMail, IconLock } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import { notifications } from '@mantine/notifications';

interface LoginProps {
  onSwitchToSignup: () => void;
}

export function Login({ onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      notifications.show({
        title: 'Error',
        message: 'Please fill in all fields',
        color: 'red',
      });
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully!',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to log in',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder style={{ maxWidth: 400, margin: '0 auto' }}>
      <Stack gap="lg">
        <div style={{ textAlign: 'center' }}>
          <Text size="xl" fw={700}>Welcome Back</Text>
          <Text c="dimmed" size="sm">Sign in to your account</Text>
        </div>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              leftSection={<IconMail size={16} />}
              required
              type="email"
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              leftSection={<IconLock size={16} />}
              required
            />

            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              disabled={!email || !password}
            >
              Sign In
            </Button>
          </Stack>
        </form>

        <Divider />

        <Group justify="center">
          <Text size="sm" c="dimmed">
            Don't have an account?{' '}
            <Anchor size="sm" onClick={onSwitchToSignup} style={{ cursor: 'pointer' }}>
              Sign up
            </Anchor>
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
