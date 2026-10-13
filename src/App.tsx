import React, { useState } from 'react';
import { Header } from './components/Header/Header';
import { KoreanHubView } from './components/KoreanHub/KoreanHubView';
import { FlashcardView } from './components/FlashcardView/FlashcardView';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'korean' | 'flashcards'>('korean');

  return (
    <div className="app-layout-wrapper">
      {/* 1. Header Thương Hiệu & Điều Hướng */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. Vùng Nội Dung Toàn Màn Hình */}
      <main className="app-main-content">
        {activeTab === 'korean' ? (
          <KoreanHubView />
        ) : (
          <FlashcardView currentStudent="all" />
        )}

        {/* Footer */}
        <footer className="app-footer">
          <p>
            TaskFlow Korean • Lộ trình tự học tiếng Hàn toàn diện từ con số 0 • Hangeul, TOPIK 1 SRS, Ngữ pháp & Hội thoại
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
