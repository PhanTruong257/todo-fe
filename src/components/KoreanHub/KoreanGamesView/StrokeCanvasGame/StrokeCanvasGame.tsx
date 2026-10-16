import React from 'react';
import {
  PenTool,
  RotateCcw,
  Eye,
  EyeOff,
  Volume2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { STROKE_CHARACTERS } from '../gamesData';
import { useStrokeCanvas } from './useStrokeCanvas';
import './StrokeCanvasGame.css';

export const StrokeCanvasGame: React.FC = () => {
  const {
    currentChar,
    selectedCharIndex,
    setSelectedCharIndex,
    showGuide,
    setShowGuide,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    accuracy,
    canvasRef,
    petalsCanvasRef,
    clearCanvas,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleSpeakChar,
  } = useStrokeCanvas();

  return (
    <div className="stroke-canvas-game">
      {/* 1. Header Banner */}
      <div className="sc-header-banner">
        <div className="sc-banner-info">
          <div className="sc-banner-title">
            <span>Tập Đồ Nét Chữ Chuẩn Thư Pháp</span>
            <span className="sc-banner-badge">
              <PenTool size={11} /> Hangeul Brush
            </span>
          </div>
          <p className="sc-banner-desc">
            Vẽ từng nét chữ theo quy tắc chuẩn: Từ trên xuống dưới, từ trái sang phải. Rèn luyện nét chữ đẹp và trí nhớ cơ bắp!
          </p>
        </div>
      </div>

      {/* 2. Thanh Chọn Ký Tự Trượt Ngang */}
      <div className="sc-char-selector-wrap">
        <span className="sc-selector-label">Chọn Ký Tự Để Luyện Nét Bút</span>
        <div className="sc-char-pills-row">
          {STROKE_CHARACTERS.map((item, idx) => {
            const isActive = idx === selectedCharIndex;
            return (
              <button
                key={item.char}
                type="button"
                className={`sc-char-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCharIndex(idx)}
                title={`${item.char} (${item.name})`}
              >
                <span className="sc-pill-han">{item.char}</span>
                <span className="sc-pill-rom">{item.romanization}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Vùng Vẽ Thư Pháp Chính */}
      <div className="sc-drawing-stage">
        {/* Khung Canvas Trái */}
        <div className="sc-canvas-card">
          <div className="sc-canvas-container">
            {/* Vạch kẻ chữ thập kiểu giấy kẻ ô truyền thống */}
            <div className="sc-crosshair-v" />
            <div className="sc-crosshair-h" />

            {/* Mẫu nét chữ bóng mờ (Guide Shadow) */}
            {showGuide && (
              <div className="sc-guide-overlay">
                <span
                  style={{
                    fontSize: '11rem',
                    fontWeight: 900,
                    color: 'rgba(244, 63, 94, 0.16)',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {currentChar.char}
                </span>
              </div>
            )}

            {/* Canvas Vẽ Tương Tác */}
            <canvas
              ref={canvasRef}
              className="sc-canvas-element"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />

            {/* Canvas Cánh Hoa Anh Đào Rơi Khi Đạt Điểm Cao */}
            <canvas ref={petalsCanvasRef} className="sc-cherry-petals-canvas" />
          </div>

          {/* Thanh Công Cụ Điều Khiển Nét Bút */}
          <div className="sc-canvas-toolbar">
            <div className="sc-tool-group">
              <button type="button" className="btn-tool-icon" onClick={clearCanvas} title="Xóa viết lại">
                <RotateCcw size={15} />
                <span>Xóa làm lại</span>
              </button>

              <button
                type="button"
                className={`btn-tool-icon ${showGuide ? 'active' : ''}`}
                onClick={() => setShowGuide(!showGuide)}
                title="Hiện / Ẩn Nét Hướng Dẫn"
              >
                {showGuide ? <Eye size={15} /> : <EyeOff size={15} />}
                <span>{showGuide ? 'Ẩn Mẫu' : 'Hiện Mẫu'}</span>
              </button>

              <button
                type="button"
                className={`btn-tool-icon ${strokeWidth === 14 ? 'active' : ''}`}
                onClick={() => setStrokeWidth(strokeWidth === 10 ? 14 : 10)}
                title="Thay đổi độ dày nét bút"
              >
                <span>{strokeWidth === 14 ? 'Nét Dày ✒️' : 'Nét Vừa ✏️'}</span>
              </button>
            </div>

            <div className="sc-color-picker">
              <button
                type="button"
                className={`sc-color-dot ${strokeColor === '#0f172a' ? 'active' : ''}`}
                style={{ background: '#0f172a' }}
                onClick={() => setStrokeColor('#0f172a')}
                title="Mực Đen Thư Pháp (먹)"
              />
              <button
                type="button"
                className={`sc-color-dot ${strokeColor === '#f43f5e' ? 'active' : ''}`}
                style={{ background: '#f43f5e' }}
                onClick={() => setStrokeColor('#f43f5e')}
                title="Mực Đỏ Son K-Pastel (붉은 먹)"
              />
            </div>
          </div>
        </div>

        {/* Cột Phải: Hướng Dẫn Thứ Tự Nét & Đánh Giá */}
        <div className="sc-info-sidebar">
          {/* Thông tin ký tự */}
          <div className="sc-char-header-card">
            <div className="sc-char-head-row">
              <span className="sc-big-char">{currentChar.char}</span>
              <button
                type="button"
                className="btn-speak-char"
                onClick={handleSpeakChar}
                title="Nghe cách phát âm"
              >
                <Volume2 size={18} />
              </button>
            </div>
            <div className="sc-char-meta-name">
              {currentChar.name} ({currentChar.romanization})
            </div>
            <p className="sc-char-meta-desc">{currentChar.vietnameseMeaning}</p>
            {currentChar.culturalNote && (
              <p className="sc-char-meta-desc" style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                💡 {currentChar.culturalNote}
              </p>
            )}
          </div>

          {/* Các bước vẽ nét chuẩn */}
          <div className="sc-stroke-steps-card">
            <h4 className="sc-steps-title">
              <Sparkles size={14} style={{ color: '#f43f5e' }} />
              <span>Quy Tắc {currentChar.totalStrokes} Nét Chuẩn</span>
            </h4>
            <ul className="sc-steps-list">
              {currentChar.strokes.map((s) => (
                <li key={s.strokeNumber} className="sc-step-item">
                  <span className="sc-step-num">{s.strokeNumber}</span>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Thang đo độ chính xác */}
          {accuracy !== null && (
            <div className="sc-accuracy-box">
              <span className="sc-acc-label">
                <CheckCircle2 size={15} style={{ display: 'inline', marginRight: 5 }} />
                Độ Chuẩn Nét Bút
              </span>
              <span className="sc-acc-val">
                {accuracy}% {accuracy >= 80 ? '🌸 Tuyệt Tác!' : '👍 Khá Lắm!'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
