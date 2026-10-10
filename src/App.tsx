import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  ListTodo,
  Layers,
  Clock,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Server,
  Cloud,
} from 'lucide-react';
import type { Todo, PriorityLevel, TodoStats } from './types/todo';
import { api } from './services/api';
import './App.css';

const DEFAULT_MOCK_TODOS: Todo[] = [
  {
    id: 'mock-1',
    title: 'Khởi chạy MongoDB (Local hoặc MongoDB Atlas on AWS)',
    description: 'Chạy lệnh docker compose up -d hoặc dán URI MongoDB Atlas vào file backend/.env',
    isCompleted: true,
    priority: 'high',
    dueDate: '2026-10-12',
    tags: ['database', 'aws'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Kiểm thử NestJS REST API tại Swagger UI',
    description: 'Mở trình duyệt truy cập http://localhost:4000/api/docs để xem đầy đủ OpenAPI endpoints',
    isCompleted: false,
    priority: 'medium',
    dueDate: '2026-10-15',
    tags: ['backend', 'api'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Triển khai Frontend lên AWS S3 + CloudFront',
    description: 'Đóng gói build dist và phân phối qua CDN AWS với SSL bảo mật',
    isCompleted: false,
    priority: 'low',
    dueDate: '2026-10-20',
    tags: ['frontend', 'deployment'],
    createdAt: new Date().toISOString(),
  },
];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('medium');
  const [newDueDate, setNewDueDate] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Edit inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<PriorityLevel>('medium');

  // Fetch todos from Backend or fall back to mock
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await api.getTodos();
      setTodos(data);
      setIsBackendConnected(true);
    } catch {
      setIsBackendConnected(false);
      // Load from localStorage if mock
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

  // Sync to localStorage when running in mock mode
  const updateLocalMock = (updatedList: Todo[]) => {
    setTodos(updatedList);
    if (!isBackendConnected) {
      localStorage.setItem('taskflow_mock_todos', JSON.stringify(updatedList));
    }
  };

  // Add Todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const payload = {
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      priority: newPriority,
      dueDate: newDueDate || undefined,
    };

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
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      updateLocalMock([newMock, ...todos]);
    }

    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setNewDueDate('');
  };

  // Toggle Todo
  const handleToggle = async (todo: Todo) => {
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

  // Delete Todo
  const handleDelete = async (id: string) => {
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

  // Start Edit
  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
  };

  // Save Edit
  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;

    if (isBackendConnected) {
      try {
        const updated = await api.updateTodo(id, {
          title: editTitle.trim(),
          description: editDescription.trim(),
          priority: editPriority,
        });
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch (err) {
        console.error('Lỗi cập nhật todo:', err);
      }
    } else {
      const updated = todos.map((t) =>
        t.id === id
          ? {
              ...t,
              title: editTitle.trim(),
              description: editDescription.trim(),
              priority: editPriority,
            }
          : t
      );
      updateLocalMock(updated);
    }
    setEditingId(null);
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

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="logo-badge">
            <ListTodo size={28} />
          </div>
          <div className="brand-text">
            <h1>TaskFlow</h1>
            <p>
              Quản lý công việc thông minh • React TS + NestJS + MongoDB
            </p>
          </div>
        </div>

        <div className="tech-badges">
          <span className="badge-pill badge-aws">
            <Cloud size={13} /> AWS Ready
          </span>
          <span
            className={`badge-pill ${
              isBackendConnected ? 'badge-connected' : 'badge-disconnected'
            }`}
          >
            <Server size={13} />
            {isBackendConnected ? 'Backend Connected' : 'Local Preview'}
          </span>
        </div>
      </header>

      {/* Backend connection warning/guide banner if offline */}
      {!isBackendConnected && (
        <div className="connection-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#f59e0b" />
            <span>
              <strong>Chế độ xem trước (Local Preview)</strong>: Chưa kết nối tới Backend NestJS tại{' '}
              <code>http://localhost:4000</code>. Dữ liệu đang được lưu tạm trên trình duyệt.
            </span>
          </div>
          <button onClick={fetchTodos} title="Bấm để thử kết nối lại NestJS">
            <RefreshCw size={13} style={{ marginRight: 6, display: 'inline' }} />
            Kết nối lại
          </button>
        </div>
      )}

      {/* Stats Counter Bar */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Layers size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Tổng công việc</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Đang thực hiện</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Đã hoàn thành</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon high">
            <Sparkles size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.highPriority}</div>
            <div className="stat-label">Ưu tiên cao</div>
          </div>
        </div>
      </section>

      {/* Add New Todo Form */}
      <section className="add-todo-section">
        <form onSubmit={handleAddTodo}>
          <div className="add-input-main">
            <input
              type="text"
              className="input-primary"
              placeholder="Bạn muốn hoàn thành điều gì hôm nay?..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              <Plus size={18} />
              <span>Thêm việc</span>
            </button>
          </div>

          <div className="add-options-row">
            <input
              type="text"
              className="input-secondary"
              placeholder="Ghi chú / mô tả thêm (tùy chọn)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />

            <select
              className="select-priority"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
              title="Mức độ ưu tiên"
            >
              <option value="low">Ưu tiên: Thấp (Low)</option>
              <option value="medium">Ưu tiên: Bình thường (Medium)</option>
              <option value="high">Ưu tiên: Cao (High)</option>
            </select>

            <input
              type="date"
              className="select-priority"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              title="Hạn chót"
            />
          </div>
        </form>
      </section>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm công việc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-tabs">
          <button
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Tất cả ({stats.total})
          </button>
          <button
            className={`tab-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Đang làm ({stats.active})
          </button>
          <button
            className={`tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Đã xong ({stats.completed})
          </button>
        </div>

        <select
          className="select-priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          title="Lọc theo mức độ ưu tiên"
        >
          <option value="all">Mọi mức ưu tiên</option>
          <option value="high">Chỉ ưu tiên cao</option>
          <option value="medium">Chỉ bình thường</option>
          <option value="low">Chỉ ưu tiên thấp</option>
        </select>
      </div>

      {/* Todo List Content */}
      <div className="todo-list">
        {loading ? (
          <div className="empty-state">
            <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 12px' }} />
            <p>Đang tải danh sách công việc...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CheckCircle2 size={32} />
            </div>
            <h3>Không có công việc nào</h3>
            <p>
              {search || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại.'
                : 'Tuyệt vời! Bạn không có công việc tồn đọng. Hãy thêm nhiệm vụ mới để bắt đầu.'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isEditing = editingId === todo.id;

            return (
              <div
                key={todo.id}
                className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}
              >
                {!isEditing && (
                  <button
                    className={`todo-checkbox ${todo.isCompleted ? 'checked' : ''}`}
                    onClick={() => handleToggle(todo)}
                    title={todo.isCompleted ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                  >
                    {todo.isCompleted ? <Check size={14} /> : <Circle size={14} />}
                  </button>
                )}

                {isEditing ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      className="input-primary"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                    />
                    <input
                      type="text"
                      className="input-secondary"
                      placeholder="Mô tả bổ sung"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <select
                        className="select-priority"
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as PriorityLevel)}
                      >
                        <option value="low">Thấp</option>
                        <option value="medium">Bình thường</option>
                        <option value="high">Cao</option>
                      </select>
                      <div className="edit-actions">
                        <button
                          className="btn-sm-save"
                          onClick={() => handleSaveEdit(todo.id)}
                        >
                          Lưu
                        </button>
                        <button
                          className="btn-sm-cancel"
                          onClick={() => setEditingId(null)}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content">
                      <div className="todo-title">{todo.title}</div>
                      {todo.description && (
                        <div className="todo-description">{todo.description}</div>
                      )}
                      <div className="todo-meta">
                        <span className={`priority-badge ${todo.priority}`}>
                          {todo.priority === 'high'
                            ? 'Ưu tiên cao'
                            : todo.priority === 'medium'
                            ? 'Bình thường'
                            : 'Ưu tiên thấp'}
                        </span>
                        {todo.dueDate && (
                          <span className="todo-date">
                            <Clock size={12} />
                            Hạn: {todo.dueDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="todo-actions">
                      <button
                        className="action-btn"
                        onClick={() => handleStartEdit(todo)}
                        title="Chỉnh sửa"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(todo.id)}
                        title="Xóa công việc"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>TaskFlow ToDo List • Được thiết kế chuẩn Modular NestJS + React TypeScript + MongoDB</p>
      </footer>
    </div>
  );
};

export default App;
