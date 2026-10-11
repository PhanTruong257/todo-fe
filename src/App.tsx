import React, { useState } from 'react';
import { StudentSidebar } from './components/StudentSidebar/StudentSidebar';
import { Header } from './components/Header/Header';
import { MobileHeader } from './components/MobileHeader/MobileHeader';
import { TodoInput } from './components/TodoInput/TodoInput';
import { FilterBar } from './components/FilterBar/FilterBar';
import { TodoList } from './components/TodoList/TodoList';
import { StatsView } from './components/StatsView/StatsView';
import { StudyTimer } from './components/StudyTimer/StudyTimer';
import type { StudyTimerSession } from './components/StudyTimer/useStudyTimer';
import { useTodos } from './components/TodoList/useTodos';
import './App.css';

export const App: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerPreset, setTimerPreset] = useState<{
    startTime?: string;
    endTime?: string;
    studentName?: string;
    date?: string;
  } | null>(null);

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
      {/* 1. Header tinh gọn 3 hàng chuẩn App trên Mobile (chỉ hiện khi <= 800px) */}
      <div className="mobile-header-section">
        <MobileHeader
          activeStudent={studentFilter}
          onStudentChange={setStudentFilter}
          students={students}
          onAddStudent={addStudent}
          stats={stats}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          todos={allTodos}
          search={search}
          onSearchChange={setSearch}
          isAddOpen={isAddOpen}
          onToggleAdd={() => setIsAddOpen((prev) => !prev)}
          isTimerOpen={isTimerOpen}
          onToggleTimer={() => setIsTimerOpen((prev) => !prev)}
        />
      </div>

      {/* 2. Sidebar học sinh bên trái trên Desktop (CỐ ĐỊNH bên trái) */}
      <aside className="desktop-sidebar-section">
        <StudentSidebar
          activeStudent={studentFilter}
          onStudentChange={setStudentFilter}
          students={students}
          onAddStudent={addStudent}
          stats={stats}
          todos={allTodos}
        />
      </aside>

      {/* 3. Phía bên phải: Nội dung chính */}
      <div className="app-main-content">
        {/* Cụm thanh điều hướng và công cụ CỐ ĐỊNH trên Desktop */}
        <div className="desktop-header-sticky-container">
          <Header
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeStudent={studentFilter}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            todos={allTodos}
          />

          {activeTab === 'reports' && (
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              totalCount={todos.length}
              isAddOpen={isAddOpen}
              onToggleAdd={() => setIsAddOpen((prev) => !prev)}
              isTimerOpen={isTimerOpen}
              onToggleTimer={() => setIsTimerOpen((prev) => !prev)}
            />
          )}
        </div>

        {/* Tab 1: Báo Cáo Học Tập */}
        {activeTab === 'reports' ? (
          <main className="tab-content animate-fade-in">
            {/* Đồng Hồ Bấm Giờ Học Trực Tiếp */}
            {isTimerOpen && (
              <StudyTimer
                currentStudent={studentFilter}
                students={students}
                onFinishSession={(session: StudyTimerSession) => {
                  setTimerPreset({
                    startTime: session.startTime,
                    endTime: session.endTime,
                    studentName: session.studentName,
                    date: session.date,
                  });
                  setIsTimerOpen(false);
                  setIsAddOpen(true);
                }}
                onClose={() => setIsTimerOpen(false)}
              />
            )}

            {/* Form Thêm Buổi Học (mở ra khi bấm dấu + hoặc khi kết thúc bấm giờ) */}
            {isAddOpen && (
              <TodoInput
                onAddTodo={(payload) => {
                  addTodo(payload);
                  setIsAddOpen(false);
                  setTimerPreset(null);
                }}
                onClose={() => {
                  setIsAddOpen(false);
                  setTimerPreset(null);
                }}
                students={students}
                activeStudentFilter={timerPreset?.studentName || studentFilter}
                selectedDate={timerPreset?.date || selectedDate}
                initialStartTime={timerPreset?.startTime}
                initialEndTime={timerPreset?.endTime}
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
