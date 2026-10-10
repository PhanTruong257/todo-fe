import React from 'react';
import { Header } from './components/Header/Header';
import { StatsCards } from './components/StatsCards/StatsCards';
import { TodoInput } from './components/TodoInput/TodoInput';
import { FilterBar } from './components/FilterBar/FilterBar';
import { TodoList } from './components/TodoList/TodoList';
import { useTodos } from './components/TodoList/useTodos';
import './App.css';

export const App: React.FC = () => {
  const {
    todos,
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
    retryConnection,
  } = useTodos();

  return (
    <div className="app-container">
      {/* Header & Trạng thái kết nối */}
      <Header
        isBackendConnected={isBackendConnected}
        onRetryConnection={retryConnection}
      />

      {/* Thẻ thống kê số lượng */}
      <StatsCards stats={stats} />

      {/* Form thêm công việc */}
      <TodoInput onAddTodo={addTodo} />

      {/* Thanh tìm kiếm & bộ lọc */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        stats={stats}
      />

      {/* Danh sách công việc */}
      <TodoList
        todos={todos}
        loading={loading}
        search={search}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>TaskFlow ToDo List • Kiến trúc Co-location Component (TSX + CSS + Hook chung folder)</p>
      </footer>
    </div>
  );
};

export default App;
