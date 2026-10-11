import React, { useState } from 'react';
import { StudentSidebar } from './components/StudentSidebar/StudentSidebar';
import { Header } from './components/Header/Header';
import { TodoInput } from './components/TodoInput/TodoInput';
import { FilterBar } from './components/FilterBar/FilterBar';
import { TodoList } from './components/TodoList/TodoList';
import { StatsView } from './components/StatsView/StatsView';
import { useTodos } from './components/TodoList/useTodos';
import './App.css';

export const App: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const {
    todos,
    allTodos,
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
    search,
    setSearch,
    addTodo,
    deleteTodo,
    updateTodo,
  } = useTodos();

  return (
    <div className="app-layout-wrapper">
      {/* Phía bên trái: Sidebar tên & danh sách học sinh */}
      <StudentSidebar
        activeStudent={studentFilter}
        onStudentChange={setStudentFilter}
        students={students}
        onAddStudent={addStudent}
        stats={stats}
      />

      {/* Phía bên phải: Nội dung chính */}
      <div className="app-main-content">
        {/* Header với ô Ngày Tháng Pop-up & Tabs Báo Cáo / Thống Kê */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeStudent={studentFilter}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          todos={allTodos}
        />

        {/* Tab 1: Báo Cáo Học Tập */}
        {activeTab === 'reports' ? (
          <main className="tab-content animate-fade-in">
            {/* Thanh tìm kiếm & nút + duy nhất để thêm báo cáo */}
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              totalCount={todos.length}
              isAddOpen={isAddOpen}
              onToggleAdd={() => setIsAddOpen((prev) => !prev)}
            />

            {/* Form Thêm Buổi Học (chỉ mở ra khi bấm dấu +) */}
            {isAddOpen && (
              <TodoInput
                onAddTodo={(payload) => {
                  addTodo(payload);
                  setIsAddOpen(false);
                }}
                onClose={() => setIsAddOpen(false)}
                students={students}
                activeStudentFilter={studentFilter}
                selectedDate={selectedDate}
              />
            )}

            {/* Danh sách Báo cáo buổi học */}
            <TodoList
              todos={todos}
              loading={loading}
              search={search}
              studentFilter={studentFilter}
              selectedDate={selectedDate}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          </main>
        ) : (
          /* Tab 2: Thống Kê & Phân Tích Tiến Độ Học */
          <main className="tab-content animate-fade-in">
            <StatsView
              todos={allTodos}
              stats={stats}
              students={students}
              onSelectStudent={(student) => {
                setStudentFilter(student);
              }}
              onGoToReports={() => {
                setActiveTab('reports');
              }}
            />
          </main>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <p>English Study Tracker • Báo cáo học Tiếng Anh hàng ngày • Trường & Nguyệt</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
