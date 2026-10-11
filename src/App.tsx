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
    students,
    studentFilter,
    setStudentFilter,
    addStudent,
    loading,
    isBackendConnected,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
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

      {/* Thẻ thống kê số lượng học tập */}
      <StatsCards stats={stats} />

      {/* Form thêm báo cáo buổi học */}
      <TodoInput
        onAddTodo={addTodo}
        students={students}
        activeStudentFilter={studentFilter}
      />

      {/* Thanh lọc theo từng người học & tìm kiếm */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        studentFilter={studentFilter}
        onStudentFilterChange={setStudentFilter}
        students={students}
        onAddStudent={addStudent}
        stats={stats}
      />

      {/* Danh sách báo cáo buổi học */}
      <TodoList
        todos={todos}
        loading={loading}
        search={search}
        statusFilter={statusFilter}
        studentFilter={studentFilter}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>English Study Tracker • Báo cáo học Tiếng Anh hàng ngày • Trường & Nguyệt</p>
      </footer>
    </div>
  );
};

export default App;
