import { useState, useEffect, useMemo } from 'react';
import type { Todo, CreateTodoPayload, UpdateTodoPayload, TodoStats, PriorityLevel } from '../../types/todo';
import { api } from '../../services/api';

const DEFAULT_MOCK_TODOS: Todo[] = [
  {
    id: 'mock-1',
    title: 'Khởi chạy MongoDB Atlas (AWS Region Singapore)',
    description: 'Cụm M0 512MB đã kết nối thành công qua MONGODB_URI trong backend/.env',
    isCompleted: true,
    priority: 'high',
    dueDate: '2026-10-12',
    tags: ['database', 'aws'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Kiểm thử NestJS REST API tại Swagger UI',
    description: 'Truy cập http://localhost:4000/api/docs để xem và test các endpoint',
    isCompleted: false,
    priority: 'medium',
    dueDate: '2026-10-15',
    tags: ['backend', 'api'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Triển khai Frontend & Backend lên Cloud',
    description: 'Mỗi component đã được co-locate sạch sẽ (tsx, css, hook chung 1 folder)',
    isCompleted: false,
    priority: 'low',
    dueDate: '2026-10-20',
    tags: ['frontend', 'deployment'],
    createdAt: new Date().toISOString(),
  },
];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await api.getTodos();
      setTodos(data);
      setIsBackendConnected(true);
    } catch {
      setIsBackendConnected(false);
      const saved = localStorage.getItem('taskflow_mock_todos');
      if (saved) {
        try {
          setTodos(JSON.parse(saved));
        } catch {
          setTodos(DEFAULT_MOCK_TODOS);
        }
      } else {
        setTodos(DEFAULT_MOCK_TODOS);
        localStorage.setItem('taskflow_mock_todos', JSON.stringify(DEFAULT_MOCK_TODOS));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const updateLocalMock = (updatedList: Todo[]) => {
    setTodos(updatedList);
    if (!isBackendConnected) {
      localStorage.setItem('taskflow_mock_todos', JSON.stringify(updatedList));
    }
  };

  const addTodo = async (payload: CreateTodoPayload) => {
    if (isBackendConnected) {
      try {
        const created = await api.createTodo(payload);
        setTodos((prev) => [created, ...prev]);
      } catch (err) {
        console.error('Lỗi khi tạo công việc:', err);
      }
    } else {
      const newMock: Todo = {
        id: `mock-${Date.now()}`,
        ...payload,
        priority: payload.priority || 'medium',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      updateLocalMock([newMock, ...todos]);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    if (isBackendConnected) {
      try {
        const updated = await api.toggleTodo(todo.id);
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      } catch (err) {
        console.error('Lỗi toggle todo:', err);
      }
    } else {
      const updated = todos.map((t) =>
        t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t
      );
      updateLocalMock(updated);
    }
  };

  const deleteTodo = async (id: string) => {
    if (isBackendConnected) {
      try {
        await api.deleteTodo(id);
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error('Lỗi xóa todo:', err);
      }
    } else {
      updateLocalMock(todos.filter((t) => t.id !== id));
    }
  };

  const updateTodo = async (
    id: string,
    updates: { title: string; description?: string; priority: PriorityLevel }
  ) => {
    if (isBackendConnected) {
      try {
        const updated = await api.updateTodo(id, updates as UpdateTodoPayload);
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch (err) {
        console.error('Lỗi cập nhật todo:', err);
      }
    } else {
      const updated = todos.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      updateLocalMock(updated);
    }
  };

  // Filtered List
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchSearch =
        search === '' ||
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !todo.isCompleted) ||
        (statusFilter === 'completed' && todo.isCompleted);

      const matchPriority =
        priorityFilter === 'all' || todo.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [todos, search, statusFilter, priorityFilter]);

  // Dynamic stats
  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    const highPriority = todos.filter((t) => t.priority === 'high' && !t.isCompleted).length;
    return {
      total,
      active: total - completed,
      completed,
      highPriority,
    };
  }, [todos]);

  return {
    todos: filteredTodos,
    stats,
    loading,
    isBackendConnected,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    retryConnection: fetchTodos,
  };
}

export default useTodos;
