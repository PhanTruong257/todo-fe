import React, { useState } from 'react';
import { Header } from './components/Header/Header';
import type { KoreanStage } from './components/Header/Header';
import { KoreanHubView } from './components/KoreanHub/KoreanHubView';
import { FlashcardView } from './components/FlashcardView/FlashcardView';
import { Footer } from './components/Footer/Footer';
import { MobileBottomNav } from './components/MobileBottomNav/MobileBottomNav';
import { DailyQuestsModal } from './components/DailyQuestsModal/DailyQuestsModal';
import { StudyAdviceModal } from './components/StudyAdviceModal/StudyAdviceModal';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'korean' | 'flashcards'>('korean');
  const [koreanStage, setKoreanStage] = useState<KoreanStage>('hangeul');
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const streakDays = 3;

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
        onOpenQuests={() => setIsQuestsOpen(true)}
        onOpenAdvice={() => setIsAdviceOpen(true)}
        streakDays={streakDays}
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
          onOpenAdvice={() => setIsAdviceOpen(true)}
        />
      </main>

      {/* 4. Thanh Điều Hướng Đáy Màn Hình Cho Mobile (Thumb-Friendly) */}
      <MobileBottomNav
        currentStage={koreanStage}
        onSelectStage={setKoreanStage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenQuests={() => setIsQuestsOpen(true)}
        streakDays={streakDays}
      />

      {/* 5. Modal Nhiệm Vụ Hàng Ngày & Chuỗi Ngày Học 🔥 */}
      <DailyQuestsModal
        isOpen={isQuestsOpen}
        onClose={() => setIsQuestsOpen(false)}
        streakDays={streakDays}
      />

      {/* 6. Modal Cẩm Nang Bí Quyết & Động Lực Học Tiếng Hàn 💡 */}
      <StudyAdviceModal
        isOpen={isAdviceOpen}
        onClose={() => setIsAdviceOpen(false)}
      />
    </div>
  );
};

export default App;
