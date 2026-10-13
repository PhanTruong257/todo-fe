import { useState, useEffect, useMemo } from 'react';
import type { Todo, CreateTodoPayload, UpdateTodoPayload, TodoStats, PriorityLevel } from '../../types/todo';
import { api } from '../../services/api';
import { matchesSearch } from '../../utils/text';
import { getTodayLocalISO, getYesterdayLocalISO } from '../../utils/date';

const DEFAULT_MOCK_TODOS: Todo[] = [
  {
    id: 'mock-1',
    title: 'Luyện Phát Âm & Shadowing IELTS Speaking',
    studentName: 'Trường',
    date: getTodayLocalISO(),
    startTime: '19:30',
    endTime: '21:00',
    lessonContent: 'Luyện phát âm đuôi -ed, -s/es và shadowing 2 đoạn hội thoại BBC 6-Minute English. Thu âm và so sánh giọng mẫu.',
    isCompleted: true,
    priority: 'high',
    tags: ['speaking', 'pronunciation'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Học 30 Từ Vựng Topic Môi Trường (Cam 18)',
    studentName: 'Nguyệt',
    date: getTodayLocalISO(),
    startTime: '20:00',
    endTime: '21:30',
    lessonContent: 'Học thuộc và đặt 10 câu ví dụ với từ vựng chủ đề Environment trong đề Cam 18 Test 1. Làm quiz ôn tập Quizlet.',
    isCompleted: false,
    priority: 'medium',
    tags: ['vocabulary', 'ielts'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Luyện Nghe IELTS Listening Section 3',
    studentName: 'Trường',
    date: getYesterdayLocalISO(),
    startTime: '20:30',
    endTime: '21:45',
    lessonContent: 'Nghe chép chính tả Section 3 đề Cam 17 Test 2. Phân tích bẫy distractors và học 15 collocations mới.',
    isCompleted: true,
    priority: 'medium',
    tags: ['listening'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [customStudents, setCustomStudents] = useState<string[]>(['Trường', 'Nguyệt']);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Navigation tab ('reports' | 'stats' | 'flashcards' | 'korean')
  const [activeTab, setActiveTab] = useState<'reports' | 'stats' | 'flashcards' | 'korean'>('reports');

  // Selected date filter (mặc định luôn luôn là ngày hôm nay theo giờ địa phương)
  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayLocalISO());

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [studentFilter, setStudentFilter] = useState<string>('Trường');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await api.getTodos();
      setTodos(data);
      setIsBackendConnected(true);

      // Fetch distinct students from API
      const apiStudents = await api.getStudents();
      setCustomStudents((prev) => Array.from(new Set([...prev, ...apiStudents])));
    } catch {
      setIsBackendConnected(false);
      const saved = localStorage.getItem('taskflow_mock_reports');
      if (saved) {
        try {
          setTodos(JSON.parse(saved));
        } catch {
          setTodos(DEFAULT_MOCK_TODOS);
        }
      } else {
        setTodos(DEFAULT_MOCK_TODOS);
        localStorage.setItem('taskflow_mock_reports', JSON.stringify(DEFAULT_MOCK_TODOS));
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
      localStorage.setItem('taskflow_mock_reports', JSON.stringify(updatedList));
    }
  };

  // Danh sách tất cả người học (luôn có Trường & Nguyệt + các tên đã có)
  const students = useMemo(() => {
    const list = new Set(['Trường', 'Nguyệt', ...customStudents]);
    todos.forEach((t) => {
      if (t.studentName) list.add(t.studentName);
    });
    return Array.from(list);
  }, [customStudents, todos]);

  const addStudent = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !students.includes(trimmed)) {
      setCustomStudents((prev) => [...prev, trimmed]);
      setStudentFilter(trimmed);
    }
  };

  const addTodo = async (payload: CreateTodoPayload) => {
    const student = payload.studentName || 'Trường';
    if (!students.includes(student)) {
      setCustomStudents((prev) => [...prev, student]);
    }

    if (isBackendConnected) {
      try {
        const created = await api.createTodo(payload);
        setTodos((prev) => [created, ...prev]);
      } catch (err) {
        console.error('Lỗi khi tạo báo cáo:', err);
      }
    } else {
      const newMock: Todo = {
        id: `mock-${Date.now()}`,
        title: payload.title || `Nhật ký học của ${student}`,
        studentName: student,
        date: payload.date || getTodayLocalISO(),
        startTime: payload.startTime || '19:30',
        endTime: payload.endTime || '21:00',
        lessonContent: payload.lessonContent || payload.description || '',
        description: payload.description || '',
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
        console.error('Lỗi toggle báo cáo:', err);
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
        console.error('Lỗi xóa báo cáo:', err);
      }
    } else {
      updateLocalMock(todos.filter((t) => t.id !== id));
    }
  };

  const updateTodo = async (
    id: string,
    updates: {
      title?: string;
      studentName?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
      lessonContent?: string;
      description?: string;
      priority?: PriorityLevel;
    }
  ) => {
    if (isBackendConnected) {
      try {
        const updated = await api.updateTodo(id, updates as UpdateTodoPayload);
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch (err) {
        console.error('Lỗi cập nhật báo cáo:', err);
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
      const studentName = todo.studentName || 'Trường';
      const matchStudent = studentFilter === 'all' || studentName === studentFilter;

      // Filter theo ngày nếu có chọn ngày cụ thể
      const matchDate = !selectedDate || todo.date === selectedDate;

      const matchSearch =
        !search.trim() ||
        matchesSearch(todo.title, search) ||
        (Boolean(todo.lessonContent) && matchesSearch(todo.lessonContent!, search)) ||
        (Boolean(todo.description) && matchesSearch(todo.description!, search)) ||
        matchesSearch(studentName, search);

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !todo.isCompleted) ||
        (statusFilter === 'completed' && todo.isCompleted);

      const matchPriority =
        priorityFilter === 'all' || todo.priority === priorityFilter;

      return matchStudent && matchDate && matchSearch && matchStatus && matchPriority;
    });
  }, [todos, search, statusFilter, priorityFilter, studentFilter, selectedDate]);

  // Dynamic stats
  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    const highPriority = todos.filter((t) => t.priority === 'high' && !t.isCompleted).length;

    const studentStats: Record<string, { total: number; completed: number }> = {};
    students.forEach((name) => {
      const studentReports = todos.filter((t) => (t.studentName || 'Trường') === name);
      studentStats[name] = {
        total: studentReports.length,
        completed: studentReports.filter((t) => t.isCompleted).length,
      };
    });

    return {
      total,
      active: total - completed,
      completed,
      highPriority,
      studentStats,
      students,
    };
  }, [todos, students]);

  return {
    todos: filteredTodos,
    allTodos: todos,
    stats,
    students,
    studentFilter,
    setStudentFilter,
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    addStudent,
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
