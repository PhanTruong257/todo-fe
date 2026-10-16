import React from 'react';
import {
  MessageSquare,
  Heart,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import { KCHAT_SCENARIOS } from '../gamesData';
import { useKChat } from './useKChat';
import './KChatGame.css';

export const KChatGame: React.FC = () => {
  const {
    activeScenario,
    activeScenarioIndex,
    chatHistory,
    affinity,
    isTyping,
    isScenarioFinished,
    availableOptions,
    chatStreamRef,
    initScenario,
    handleSelectOption,
    handleSpeak,
  } = useKChat();

  return (
    <div className="kchat-simulator-game">
      {/* 1. Header Banner */}
      <div className="kc-header-banner">
        <div className="kc-banner-info">
          <div className="kc-banner-title">
            <span>Mô Phỏng Nhắn Tin K-Chat KakaoTalk</span>
            <span className="kc-banner-badge">
              <MessageSquare size={11} /> K-Messenger
            </span>
          </div>
          <p className="kc-banner-desc">
            Nhập vai nhắn tin thực tế bằng tiếng Hàn đời thường với bạn bè, quán cafe, hỏi đường ga tàu và thần tượng K-Pop!
          </p>
        </div>
      </div>

      {/* 2. Danh Sách Chọn Kịch Bản */}
      <div className="kc-scenario-nav">
        {KCHAT_SCENARIOS.map((sc, idx) => {
          const isActive = idx === activeScenarioIndex;
          return (
            <button
              key={sc.id}
              type="button"
              className={`kc-scenario-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => initScenario(idx)}
            >
              <span className="kc-tab-tag">{sc.badge}</span>
              <span className="kc-tab-name">{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Khung Điện Thoại KakaoTalk */}
      <div className="kc-phone-frame">
        {/* Header Cuộc Trò Chuyện */}
        <div className="kc-phone-header">
          <div className="kc-profile-cluster">
            <div className="kc-partner-avatar">{activeScenario.partnerAvatar}</div>
            <div className="kc-profile-text">
              <div className="kc-partner-name-row">
                <span className="kc-partner-name">{activeScenario.partnerName}</span>
                <span className="kc-online-dot" title="Đang trực tuyến" />
              </div>
              <p className="kc-partner-status-msg">{activeScenario.statusQuote}</p>
            </div>
          </div>

          <div className="kc-affinity-pill" title="Mức độ thân thiết">
            <Heart size={13} fill="#f43f5e" />
            <span>{affinity}%</span>
          </div>
        </div>

        {/* Dòng Tin Nhắn (Stream) */}
        <div ref={chatStreamRef} className="kc-chat-stream">
          <div className="kc-chat-date-badge">Hôm nay • 2026년 10월 16일</div>

          {chatHistory.map((msg) => {
            if (msg.isNpc) {
              return (
                <div key={msg.id} className="kc-msg-row npc">
                  <div className="kc-msg-avatar">{msg.senderAvatar}</div>
                  <div className="kc-msg-bubble-wrap">
                    <span className="kc-msg-sender-name">{msg.senderName}</span>
                    <div className="kc-bubble-flex">
                      <div className="kc-speech-bubble npc">
                        <span>{msg.messageKo}</span>
                        <button
                          type="button"
                          className="btn-speak-bubble"
                          onClick={() => handleSpeak(msg.messageKo)}
                          title="Nghe phát âm"
                        >
                          <Volume2 size={13} />
                        </button>
                        <span className="kc-vi-subtext">{msg.messageVi}</span>
                      </div>
                      <span className="kc-msg-time">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="kc-msg-row user">
                <div className="kc-meta-column">
                  {msg.isUnread && <span className="kc-unread-badge">1</span>}
                  <span className="kc-msg-time">{msg.timestamp}</span>
                </div>
                <div className="kc-speech-bubble user">
                  <span>{msg.messageKo}</span>
                  <button
                    type="button"
                    className="btn-speak-bubble"
                    onClick={() => handleSpeak(msg.messageKo)}
                    title="Nghe phát âm"
                  >
                    <Volume2 size={13} />
                  </button>
                  <span className="kc-vi-subtext" style={{ color: '#475569' }}>
                    {msg.messageVi}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Hiệu ứng đối phương đang nhập */}
          {isTyping && (
            <div className="kc-typing-row">
              <span>{activeScenario.partnerName} đang soạn tin nhắn</span>
              <div className="kc-typing-dots">
                <span className="kc-dot" />
                <span className="kc-dot" />
                <span className="kc-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Khay Tùy Chọn Phản Hồi Dưới Đáy */}
        <div className="kc-reply-tray">
          {!isScenarioFinished && availableOptions.length > 0 && (
            <>
              <span className="kc-tray-label">Chọn câu phản hồi tiếng Hàn của bạn:</span>
              <div className="kc-choice-buttons-col">
                {availableOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className="btn-kc-reply-choice"
                    onClick={() => handleSelectOption(opt)}
                    disabled={isTyping}
                  >
                    <span className="kc-reply-ko">{opt.koreanText}</span>
                    <span className="kc-reply-vi">💡 {opt.vietnameseMeaning}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {isScenarioFinished && (
            <div className="kc-completed-card">
              <span className="kc-completed-badge">🎉</span>
              <h4 className="kc-completed-title">Cuộc trò chuyện đã diễn ra vô cùng tốt đẹp!</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Độ thân thiết đạt mức tối đa <strong>{affinity}%</strong> ❤️
              </p>
              <button
                type="button"
                className="btn-tool-icon"
                onClick={() => initScenario(activeScenarioIndex)}
                style={{ marginTop: '0.5rem', background: '#fff1f2', borderColor: '#fecdd3', color: '#e11d48' }}
              >
                <RotateCcw size={15} />
                <span>Trò chuyện lại từ đầu</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
