import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Trophy,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';
import { ROLEPLAY_SCENARIOS } from '../../../../constants/roleplayData';
import type { RoleplayScenario, RoleplayTurn, RoleplayChoice } from '../../../../types/korean';
import { speakKorean } from '../../../../constants/koreanData';
import { useKoreanSpeech } from '../../../../hooks/useKoreanSpeech';
import './RoleplayView.css';

interface RoleplayViewProps {
  hideRomanization?: boolean;
}

export const RoleplayView: React.FC<RoleplayViewProps> = ({
  hideRomanization = false,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('rp-cafe');
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<
    { speaker: 'npc' | 'user'; text: string; vi: string; reaction?: string }[]
  >([]);
  const [scenarioCompleted, setScenarioCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const {
    isListening,
    isSupported: isSpeechSupported,
    feedbackMessage,
    startListening,
    stopListening,
  } = useKoreanSpeech();

  const currentScenario: RoleplayScenario =
    ROLEPLAY_SCENARIOS.find((s) => s.id === selectedScenarioId) || ROLEPLAY_SCENARIOS[0];

  const currentTurn: RoleplayTurn | undefined = currentScenario.turns[currentTurnIndex];

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentTurnIndex(0);
    setChatHistory([]);
    setScenarioCompleted(false);
    setTotalScore(0);
    stopListening();
  };

  const handleChooseResponse = (choice: RoleplayChoice) => {
    // Thêm lượt user vào lịch sử
    const nextHistory = [
      ...chatHistory,
      { speaker: 'npc' as const, text: currentTurn.korean, vi: currentTurn.vietnamese },
      {
        speaker: 'user' as const,
        text: choice.korean,
        vi: choice.vietnamese,
        reaction: choice.replyReaction,
      },
    ];

    setChatHistory(nextHistory);
    setTotalScore((prev) => prev + (choice.scoreBonus || 10));

    // Phát âm câu nói của NPC phản hồi
    if (choice.replyReaction) {
      setTimeout(() => {
        speakKorean(choice.replyReaction);
      }, 500);
    }

    // Chuyển sang lượt kế tiếp hoặc hoàn thành
    if (currentTurnIndex < currentScenario.turns.length - 1) {
      setCurrentTurnIndex((prev) => prev + 1);
    } else {
      setScenarioCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentTurnIndex(0);
    setChatHistory([]);
    setScenarioCompleted(false);
    setTotalScore(0);
  };

  return (
    <div className="roleplay-container">
      {/* 1. Thanh Chọn Kịch Bản Tình Huống */}
      <div className="roleplay-scenarios-bar">
        {ROLEPLAY_SCENARIOS.map((sc) => {
          const isSelected = sc.id === currentScenario.id;
          return (
            <button
              key={sc.id}
              type="button"
              className={`scenario-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelectScenario(sc.id)}
            >
              <span className="sc-icon">{sc.icon}</span>
              <div className="sc-info">
                <span className="sc-title">{sc.title}</span>
                <span className="sc-location">{sc.location}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Thẻ Kịch Bản Chính */}
      <div className="roleplay-main-card">
        <div className="rp-card-header">
          <div className="rp-header-left">
            <span style={{ fontSize: 24 }}>{currentScenario.icon}</span>
            <div>
              <div className="rp-title">{currentScenario.title}</div>
              <div className="rp-sub">{currentScenario.subtitle}</div>
            </div>
          </div>
          <div className="rp-score-pill">
            <Trophy size={14} color="#fbbf24" />
            <span>Điểm: {totalScore}</span>
          </div>
        </div>

        {/* Khung Chat Lịch Sử Hội Thoại */}
        <div className="rp-dialogue-flow">
          {/* Lịch sử các câu trước */}
          {chatHistory.map((item, idx) => (
            <div key={idx} className={`flow-message-row ${item.speaker}`}>
              <div className="flow-bubble">
                <div className="flow-bubble-speaker">
                  {item.speaker === 'npc' ? 'Nhân viên / Đối phương' : 'Bạn (Học viên)'}
                </div>
                <div className="flow-bubble-ko">{item.text}</div>
                <div className="flow-bubble-vi">{item.vi}</div>
                {item.reaction && (
                  <div className="flow-bubble-reaction">
                    <em>💬 "{item.reaction}"</em>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Lượt hiện tại của NPC (nếu chưa hoàn thành) */}
          {!scenarioCompleted && currentTurn && (
            <div className="flow-message-row npc active-turn">
              <div className="flow-bubble current-npc">
                <div className="flow-bubble-top">
                  <span className="npc-speaker-name">{currentTurn.speakerName}</span>
                  <button
                    type="button"
                    className="npc-audio-btn"
                    onClick={() => speakKorean(currentTurn.korean)}
                    title="Nghe phát âm"
                  >
                    <Volume2 size={16} /> Nghe âm
                  </button>
                </div>

                <div className="flow-bubble-ko">{currentTurn.korean}</div>
                {!hideRomanization && (
                  <div className="flow-bubble-rom">[{currentTurn.romanization}]</div>
                )}
                <div className="flow-bubble-vi">{currentTurn.vietnamese}</div>

                {currentTurn.tip && (
                  <div className="current-tip-box">
                    <Lightbulb size={13} color="#fbbf24" />
                    <span>{currentTurn.tip}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banner Hoàn Thành Kịch Bản */}
          {scenarioCompleted && (
            <div className="rp-victory-banner">
              <Trophy size={36} color="#fbbf24" />
              <div className="victory-title">Xuất Sắc! Bạn Đã Hoàn Thành Kịch Bản 🎉</div>
              <div className="victory-desc">
                Bạn đã giao tiếp thành công và ghi được <strong>+{totalScore} EXP</strong>!
              </div>
              <button type="button" className="rp-btn-restart" onClick={handleRestart}>
                <RotateCcw size={15} /> Luyện tập lại kịch bản này
              </button>
            </div>
          )}
        </div>

        {/* Vùng Lựa Chọn Câu Trả Lời Của Bạn */}
        {!scenarioCompleted && currentTurn && currentTurn.choices && (
          <div className="rp-choices-area">
            <div className="choices-header-row">
              <span className="choices-title">Chọn hoặc Nói câu trả lời của bạn:</span>

              {/* Nút Mic luyện nói */}
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`rp-mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={() => {
                    if (isListening) stopListening();
                    else startListening(currentTurn.choices?.[0]?.korean);
                  }}
                  title="Bấm để phát âm thử bằng Micro"
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  <span>{isListening ? 'Đang nghe...' : 'Nói thử 🎙️'}</span>
                </button>
              )}
            </div>

            {/* Phản hồi Speech Recognition nếu có */}
            {feedbackMessage && (
              <div className="speech-feedback-pill">
                <span>{feedbackMessage}</span>
              </div>
            )}

            {/* Danh sách 2-3 phương án trả lời */}
            <div className="rp-choices-grid">
              {currentTurn.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="rp-choice-btn"
                  onClick={() => handleChooseResponse(c)}
                >
                  <div className="choice-left">
                    <span className="choice-korean">{c.korean}</span>
                    {!hideRomanization && (
                      <span className="choice-rom">[{c.romanization}]</span>
                    )}
                    <span className="choice-vi">{c.vietnamese}</span>
                  </div>
                  <div
                    className="choice-preview-audio"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakKorean(c.korean);
                    }}
                    title="Nghe trước"
                  >
                    <Volume2 size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
