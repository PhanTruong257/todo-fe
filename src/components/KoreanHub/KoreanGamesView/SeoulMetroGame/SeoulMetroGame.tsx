import React from 'react';
import {
  Train,
  MapPin,
  Volume2,
  Award,
  RotateCcw,
} from 'lucide-react';
import { SEOUL_METRO_MISSIONS } from '../gamesData';
import { useSeoulMetro } from './useSeoulMetro';
import './SeoulMetroGame.css';

export const SeoulMetroGame: React.FC = () => {
  const {
    currentMission,
    activeStationIndex,
    collectedStamps,
    selectedOptionIndex,
    isAnswerLocked,
    feedbackText,
    isCurrentStationCompleted,
    handleSelectStation,
    handleAnswerOption,
    handleRetryCurrentStation,
    handleSpeakCurrentStation,
  } = useSeoulMetro();

  return (
    <div className="seoul-metro-game">
      {/* 1. Header Banner */}
      <div className="sm-header-banner">
        <div className="sm-banner-info">
          <div className="sm-banner-title">
            <span>Bản Đồ Thám Hiểm Tuyến Số 2 Seoul Metro</span>
            <span className="sm-banner-badge">
              <Train size={11} /> Seoul Line 2
            </span>
          </div>
          <p className="sm-banner-desc">
            Vượt qua các tình huống giao tiếp thực tế tại 5 ga biểu tượng của thủ đô Seoul và thu thập đủ 5 con dấu Hộ chiếu!
          </p>
        </div>
      </div>

      {/* 2. Bản Đồ Tuyến Tàu Điện Trực Quan */}
      <div className="sm-map-card">
        <div className="sm-map-header-row">
          <span className="sm-line-badge">
            <Train size={13} /> Tuyến Vòng Tròn Xanh Lá (2호선)
          </span>
          <span className="sm-stamps-counter">
            Đã sưu tập: {collectedStamps.length} / {SEOUL_METRO_MISSIONS.length} Con Dấu 💮
          </span>
        </div>

        <div className="sm-stations-track-wrap">
          <div className="sm-track-line" />
          <div className="sm-stations-row">
            {SEOUL_METRO_MISSIONS.map((st, idx) => {
              const isActive = idx === activeStationIndex;
              const isDone = collectedStamps.includes(st.id);
              return (
                <button
                  key={st.id}
                  type="button"
                  className={`sm-station-node-btn ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                  onClick={() => handleSelectStation(idx)}
                >
                  <div className="sm-node-circle">
                    {isDone ? '💮' : st.stationNumber}
                  </div>
                  <span className="sm-node-name-ko">{st.stationNameKo}</span>
                  <span className="sm-node-name-vi">{st.stationNameRom}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Thẻ Nhiệm Vụ Ga Đang Đỗ */}
      <div className="sm-mission-card">
        <div className="sm-mission-header">
          <div className="sm-mission-station-name">
            <div className="sm-station-big-icon">{currentMission.icon}</div>
            <div className="sm-station-text-wrap">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="sm-station-title-ko">{currentMission.stationNameKo}</h3>
                <button
                  type="button"
                  className="btn-tool-icon"
                  style={{ padding: '0.2rem 0.4rem', minHeight: 28 }}
                  onClick={handleSpeakCurrentStation}
                  title="Nghe phát âm tên ga"
                >
                  <Volume2 size={13} />
                </button>
              </div>
              <p className="sm-station-title-vi">{currentMission.stationNameVi}</p>
            </div>
          </div>
          <span className="sm-banner-badge">
            Ga Số {currentMission.stationNumber}
          </span>
        </div>

        {/* Khung Tình Huống Thực Tế */}
        <div className="sm-scenario-box">
          <span className="sm-scenario-label">
            <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
            Tình Huống Sống Sót Tại Điểm Đến
          </span>
          <p className="sm-scenario-text">{currentMission.situationScenario}</p>
        </div>

        {/* Khung Câu Hỏi Trắc Nghiệm */}
        <div className="sm-question-wrap">
          <h4 className="sm-question-title">{currentMission.questionVi}</h4>
          <div className="sm-options-list">
            {currentMission.options.map((opt, oIdx) => {
              const isSelected = selectedOptionIndex === oIdx;
              let choiceClass = 'btn-sm-choice';
              if (isAnswerLocked) {
                if (isSelected && opt.isCorrect) choiceClass += ' correct';
                else if (isSelected && !opt.isCorrect) choiceClass += ' wrong';
                else if (opt.isCorrect) choiceClass += ' correct';
              }

              return (
                <button
                  key={oIdx}
                  type="button"
                  className={choiceClass}
                  onClick={() => handleAnswerOption(oIdx)}
                  disabled={isAnswerLocked}
                >
                  <span className="sm-choice-ko">{opt.korean}</span>
                  <span className="sm-choice-vi">💡 {opt.vietnamese}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phản Hồi Khi Đã Trả Lời */}
        {feedbackText && (
          <div className="sm-feedback-card">
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', fontSize: '0.88rem', color: isCurrentStationCompleted ? '#065f46' : '#991b1b' }}>
                {isCurrentStationCompleted ? '🎉 Bạn Đã Xử Lý Tuyệt Vời!' : '💡 Gợi Ý Thử Lại:'}
              </strong>
              <span style={{ fontSize: '0.8rem', color: isCurrentStationCompleted ? '#047857' : '#b91c1c' }}>
                {feedbackText}
              </span>
            </div>
            {isCurrentStationCompleted ? (
              <div className="sm-stamp-badge">
                <div className="sm-stamp-seal">💮</div>
              </div>
            ) : (
              <button
                type="button"
                className="btn-tool-icon"
                onClick={handleRetryCurrentStation}
                style={{ background: '#ffffff', borderColor: '#fecdd3', color: '#e11d48', flexShrink: 0 }}
              >
                <RotateCcw size={14} />
                <span>Thử Lại</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. Sổ Tay Hộ Chiếu Thu Thập Con Dấu */}
      <div className="sm-passport-shelf">
        <h4 className="sm-shelf-title">
          <Award size={15} style={{ color: '#10b981' }} />
          <span>Hộ Chiếu Du Hành Seoul (Seoul Travel Passport)</span>
        </h4>
        <div className="sm-stamps-grid">
          {SEOUL_METRO_MISSIONS.map((st) => {
            const isCollected = collectedStamps.includes(st.id);
            return (
              <div key={st.id} className={`sm-stamp-slot ${isCollected ? 'collected' : ''}`}>
                <span className="sm-slot-icon">{isCollected ? '💮' : '🔒'}</span>
                <span className="sm-slot-title">{st.stationNameKo.split('역')[0]}</span>
                <span style={{ fontSize: '0.65rem', color: isCollected ? '#e11d48' : '#94a3b8' }}>
                  {isCollected ? 'Đã đóng dấu' : 'Chưa mở khóa'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
