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

interface SignupProps {
  onSwitchToLogin: () => void;
}

export function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      notifications.show({
        title: 'Error',
        message: 'Please fill in all fields',
        color: 'red',
      });
      return;
    }

    if (password !== confirmPassword) {
      notifications.show({
        title: 'Error',
        message: 'Passwords do not match',
        color: 'red',
      });
      return;
    }

    if (password.length < 6) {
      notifications.show({
        title: 'Error',
        message: 'Password must be at least 6 characters long',
        color: 'red',
      });
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      notifications.show({
        title: 'Success',
        message: 'Account created successfully!',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create account',
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
          <Text size="xl" fw={700}>Create Account</Text>
          <Text c="dimmed" size="sm">Sign up to get started</Text>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              leftSection={<IconLock size={16} />}
              required
              minLength={6}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              leftSection={<IconLock size={16} />}
              required
              minLength={6}
            />

            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              disabled={!email || !password || !confirmPassword}
            >
              Create Account
            </Button>
          </Stack>
        </form>

        <Divider />

        <Group justify="center">
          <Text size="sm" c="dimmed">
            Already have an account?{' '}
            <Anchor size="sm" onClick={onSwitchToLogin} style={{ cursor: 'pointer' }}>
              Sign in
            </Anchor>
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
