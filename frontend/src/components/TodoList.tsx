import { useState } from 'react';
import { Box, Card, Text, Button, TextInput, Group, Stack, ActionIcon, Checkbox, Modal, Textarea } from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, deleteTodo, updateTodo } from '../api/generated';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodo, setEditingTodo] = useState<{ id: string; title: string; completed: boolean } | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);
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

  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, title, completed }: { id: string; title?: string; completed?: boolean }) => {
      const response = await updateTodo({
        path: { id },
        body: { title, completed },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingTodo(null);
      setEditTitle('');
      setEditCompleted(false);
      notifications.show({
        title: 'Success',
        message: 'Todo updated successfully!',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update todo',
        color: 'red',
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteTodo({ path: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      notifications.show({
        title: 'Success',
        message: 'Todo deleted successfully!',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete todo',
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

  const handleEditTodo = (todo: { id: string; title: string; completed: boolean }) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditCompleted(todo.completed);
  };

  const handleSaveEdit = () => {
    if (editingTodo && editTitle.trim()) {
      updateTodoMutation.mutate({
        id: editingTodo.id,
        title: editTitle.trim(),
        completed: editCompleted,
      });
    }
  };

  const handleToggleComplete = (todo: { id: string; title: string; completed: boolean }) => {
    updateTodoMutation.mutate({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
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
                            onChange={() => handleToggleComplete(todo)}
                            disabled={updateTodoMutation.isPending}
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
                        <Text size="xs" c="dimmed">
                          Created: {new Date(todo.createdAt).toLocaleDateString()}
                        </Text>
                      </Box>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="sm"
                          onClick={() => handleEditTodo(todo)}
                          disabled={updateTodoMutation.isPending}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                          disabled={deleteTodoMutation.isPending}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Edit Todo Modal */}
        <Modal
          opened={editingTodo !== null}
          onClose={() => setEditingTodo(null)}
          title="Edit Todo"
          size="md"
        >
          <Stack gap="md">
            <Textarea
              label="Title"
              placeholder="Enter todo title..."
              value={editTitle}
              onChange={(event) => setEditTitle(event.currentTarget.value)}
              maxLength={500}
              autosize
              minRows={2}
            />
            <Checkbox
              label="Completed"
              checked={editCompleted}
              onChange={(event) => setEditCompleted(event.currentTarget.checked)}
            />
            <Group justify="flex-end" gap="sm">
              <Button
                variant="light"
                onClick={() => setEditingTodo(null)}
                disabled={updateTodoMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={!editTitle.trim() || updateTodoMutation.isPending}
                loading={updateTodoMutation.isPending}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Box>
  );
}
