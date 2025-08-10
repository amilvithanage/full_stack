import { useState } from 'react';
import { Box, Card, Text, Button, TextInput, Group, Stack, Badge, ActionIcon, Checkbox } from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo } from '../api/generated';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await getTodos({});
      return response.data;
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await createTodo({
        body: { title },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
      notifications.show({
        title: 'Success',
        message: 'Todo created successfully!',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create todo',
        color: 'red',
      });
    },
  });

  const handleCreateTodo = () => {
    if (newTodoTitle.trim()) {
      createTodoMutation.mutate(newTodoTitle.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleCreateTodo();
    }
  };

  if (isLoading) {
    return (
      <Box p="md">
        <Text>Loading todos...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="md">
        <Text c="red">Error loading todos: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box p="md">
      <Stack gap="lg">
        {/* Add Todo Form */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Text size="lg" fw={500}>Add New Todo</Text>
            <Group gap="sm" align="flex-end">
              <TextInput
                placeholder="Enter todo title..."
                value={newTodoTitle}
                onChange={(event) => setNewTodoTitle(event.currentTarget.value)}
                onKeyPress={handleKeyPress}
                style={{ flex: 1 }}
                maxLength={500}
              />
              <Button
                onClick={handleCreateTodo}
                disabled={!newTodoTitle.trim() || createTodoMutation.isPending}
                loading={createTodoMutation.isPending}
                leftSection={<IconPlus size={16} />}
              >
                Add
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Todo List */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Text size="lg" fw={500}>
              Todos ({todos.length})
            </Text>
            
            {todos.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No todos yet. Add one above!
              </Text>
            ) : (
              <Stack gap="sm">
                {todos.map((todo) => (
                  <Card
                    key={todo.id}
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    withBorder
                    style={{
                      borderLeft: `4px solid ${todo.completed ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-blue-6)'}`,
                    }}
                  >
                    <Group justify="space-between" align="flex-start">
                      <Box style={{ flex: 1 }}>
                        <Group gap="sm" align="center" mb="xs">
                          <Checkbox
                            checked={todo.completed}
                            onChange={() => {}} // TODO: Implement toggle functionality
                            size="sm"
                          />
                          <Text
                            fw={500}
                            style={{
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              color: todo.completed ? 'var(--mantine-color-dimmed)' : 'inherit',
                            }}
                          >
                            {todo.title}
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <Badge
                            variant={todo.completed ? 'light' : 'filled'}
                            color={todo.completed ? 'green' : 'blue'}
                            size="sm"
                          >
                            {todo.completed ? 'Completed' : 'Pending'}
                          </Badge>
                          <Text size="xs" c="dimmed">
                            Created: {new Date(todo.createdAt).toLocaleDateString()}
                          </Text>
                        </Group>
                      </Box>
                      <ActionIcon
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => {}} // TODO: Implement delete functionality
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
