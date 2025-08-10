import { Box, Flex, Text, ThemeIcon, Image, Loader, Button, Group, Menu } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../api/generated';
import { IconCheck, IconX, IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import favicon from '../assets/favicon.svg';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { currentUser, logout } = useAuth();
  
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await getHealth({});
      return response.data;
    },
    refetchInterval: 5000,
  });

  const isHealthy = healthData?.status === 'ok';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box
      component="header"
      pos="sticky"
      top={0}
      style={{ zIndex: 1000, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'}}
      bg="dark.7"
      px="md"
      py="sm"
    >
      <Flex justify="space-between" align="center">
        <Flex gap="sm" align="center">
            <Image
                src={favicon}
                alt="Logo"
                width={32}
                height={32}
                fit="contain"
            />
            <Text fw={600} size="lg">Todo App</Text>
        </Flex>

        <Group gap="md" align="center">
          {isLoading ? (
            <Loader size="sm" />
          ) : (
              <Box
              style={{
                border: `1px solid ${isHealthy ? '#51cf66' : '#ff6b6b'}`,
                borderRadius: '20px',
                padding: '6px 12px',
                backgroundColor: isHealthy ? 'rgba(81, 207, 102, 0.1)' : 'rgba(255, 107, 107, 0.1)'
              }}
            >
              <Flex gap="sm" align="center">
                <ThemeIcon
                  color={isHealthy ? 'green' : 'red'}
                  variant="light"
                  size="sm"
                  radius="xl"
                >
                  {isHealthy ? <IconCheck size={14} /> : <IconX size={14} />}
                </ThemeIcon>
                <Text fw={500} c={isHealthy ? 'green' : 'red'} size="sm">
                  {isHealthy ? 'Healthy' : 'Unhealthy'}
                </Text>
              </Flex>
            </Box>
          )}

          {currentUser && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="light" leftSection={<IconUser size={16} />}>
                  {currentUser.email}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconSettings size={16} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  leftSection={<IconLogout size={16} />}
                  onClick={handleLogout}
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Flex>
    </Box>
  );
}
