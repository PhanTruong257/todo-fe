import React, { useState } from 'react';
import { Header } from './components/Header/Header';
import type { KoreanStage } from './components/Header/Header';
import { KoreanHubView } from './components/KoreanHub/KoreanHubView';
import { FlashcardView } from './components/FlashcardView/FlashcardView';
import { Footer } from './components/Footer/Footer';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'korean' | 'flashcards'>('korean');
  const [koreanStage, setKoreanStage] = useState<KoreanStage>('hangeul');

  return (
    <div className="app-layout-wrapper">
      {/* 1. Header Thương Hiệu & Menu Ngoài Chọn Giai Đoạn */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        koreanStage={koreanStage}
        onKoreanStageChange={(stage) => {
          setKoreanStage(stage);
          setActiveTab('korean');
        }}
      />

      {/* 2. Vùng Nội Dung Toàn Màn Hình */}
      <main className="app-main-content">
        {activeTab === 'korean' ? (
          <KoreanHubView
            activeStage={koreanStage}
            onStageChange={setKoreanStage}
          />
        ) : (
          <FlashcardView currentStudent="all" />
        )}

        {/* 3. Footer Sang Trọng, Đa Tính Năng & Responsive */}
        <Footer
          currentStage={koreanStage}
          onSelectStage={(stage) => {
            setKoreanStage(stage);
            setActiveTab('korean');
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </main>
    </div>
  );
};

export default App;
