import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Download, Share2, Sparkles } from 'lucide-react';
import { AESTHETIC_KOREAN_QUOTES } from '../gamesData';
import './AestheticStoryCardModal.css';

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
}

function safeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

interface AestheticStoryCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  speedRushScore?: number;
  metroStampsCount?: number;
}

export const AestheticStoryCardModal: React.FC<AestheticStoryCardModalProps> = ({
  isOpen,
  onClose,
  speedRushScore = 320,
  metroStampsCount = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedQuoteIdx, setSelectedQuoteIdx] = useState(0);

  const activeQuote = AESTHETIC_KOREAN_QUOTES[selectedQuoteIdx];

  // Draw story card on canvas
  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution 720 x 1280 (9:16 aspect ratio)
    canvas.width = 720;
    canvas.height = 1280;

    // 1. Background Gradient (Strawberry Milk & Snow)
    const bgGradient = ctx.createLinearGradient(0, 0, 720, 1280);
    bgGradient.addColorStop(0, '#ffffff');
    bgGradient.addColorStop(0.5, '#fff1f2');
    bgGradient.addColorStop(1, '#ffe4e6');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 720, 1280);

    // Subtle background decorative circles
    ctx.fillStyle = 'rgba(244, 63, 94, 0.05)';
    ctx.beginPath();
    ctx.arc(620, 120, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(244, 63, 94, 0.04)';
    ctx.beginPath();
    ctx.arc(80, 1100, 220, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Border Frame
    ctx.strokeStyle = '#fecdd3';
    ctx.lineWidth = 14;
    ctx.strokeRect(36, 36, 720 - 72, 1280 - 72);

    // Inner fine border
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 720 - 96, 1280 - 96);

    // 3. Header: Brand & Date
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌸 TASKFLOW KOREAN ARCADE 🌸', 360, 110);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('2026년 10월 16일 • 한국어 일일 챌린지', 360, 145);

    // 4. White Center Polaroid Card
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(244, 63, 94, 0.15)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.beginPath();
    safeRoundRect(ctx, 80, 200, 560, 680, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent'; // reset shadow

    // Center Card Border
    ctx.strokeStyle = '#ffe4e6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    safeRoundRect(ctx, 80, 200, 560, 680, 24);
    ctx.stroke();

    // Visual Icon Circle
    ctx.fillStyle = '#fff1f2';
    ctx.beginPath();
    ctx.arc(360, 310, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fecdd3';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '64px -apple-system';
    ctx.textAlign = 'center';
    ctx.fillText('⚡', 360, 332);

    // Learner Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Hangeul Explorer', 360, 420);

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🏅 CHIẾN BINH PHẢN XẠ TIẾNG HÀN', 360, 455);

    // Stats Grid inside Polaroid
    // Stat 1: Speed Rush
    ctx.fillStyle = '#fcfbfb';
    ctx.beginPath();
    safeRoundRect(ctx, 115, 500, 230, 120, 16);
    ctx.fill();
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('SPEED RUSH KỶ LỤC', 230, 538);

    ctx.fillStyle = '#e11d48';
    ctx.font = '900 38px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${speedRushScore} pts`, 230, 592);

    // Stat 2: Metro Stamps
    ctx.fillStyle = '#fcfbfb';
    ctx.beginPath();
    safeRoundRect(ctx, 375, 500, 230, 120, 16);
    ctx.fill();
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('CON DẤU METRO', 490, 538);

    ctx.fillStyle = '#10b981';
    ctx.font = '900 38px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${metroStampsCount} / 5 💮`, 490, 592);

    // Divider Line
    ctx.strokeStyle = '#ffe4e6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 655);
    ctx.lineTo(600, 655);
    ctx.stroke();

    // Korean Proverb / Quote
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(activeQuote.korean, 360, 725);

    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 500 20px -apple-system, BlinkMacSystemFont, sans-serif';
    wrapText(ctx, activeQuote.vietnamese, 360, 775, 500, 28);

    // 5. Bottom Stamp & Stickers
    ctx.fillStyle = '#e11d48';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('💮 서울 인증 • TASKFLOW K-PLAY 💮', 360, 960);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Học tiếng Hàn mỗi ngày cùng sự hứng khởi bất tận', 360, 1000);

    // Cute footer emojis
    ctx.font = '36px -apple-system';
    ctx.fillText('🌸  ☕  🇰🇷  🎮  ✨', 360, 1070);
  }, [activeQuote, speedRushScore, metroStampsCount]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(drawCard, 50);
    }
  }, [isOpen, drawCard]);

  if (!isOpen) return null;

  // Download image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `TaskFlow_KCard_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Share story
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (navigator.share && canvas.toBlob) {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'kcard_story.png', { type: 'image/png' });
        try {
          await navigator.share({
            title: 'Kỷ lục TaskFlow Korean của tôi!',
            text: `Tôi vừa đạt ${speedRushScore} điểm trong Đấu Trường Phản Xạ 60s! Cùng học tiếng Hàn nào 🌸`,
            files: [file],
          });
        } catch {
          // user cancelled or share failed
        }
      });
    } else {
      handleDownload();
    }
  };

  return (
    <div className="kcard-modal-backdrop" onClick={onClose}>
      <div className="kcard-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="kcard-modal-header">
          <div className="kcard-header-title">
            <Sparkles size={18} style={{ color: '#f43f5e' }} />
            <span>Thẻ Thành Tích Instagram Story 📸</span>
          </div>
          <button type="button" className="btn-close-kcard" onClick={onClose} title="Đóng modal">
            <X size={16} />
          </button>
        </div>

        {/* Vùng xem trước thẻ */}
        <div className="kcard-preview-wrap">
          <canvas ref={canvasRef} className="kcard-canvas-element" />
        </div>

        {/* Chọn danh ngôn */}
        <div className="kcard-quote-selector">
          <span className="kcard-quote-label">Đổi Châm Ngôn Động Lực:</span>
          <div className="kcard-quote-chips">
            {AESTHETIC_KOREAN_QUOTES.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className={`btn-quote-chip ${idx === selectedQuoteIdx ? 'active' : ''}`}
                onClick={() => setSelectedQuoteIdx(idx)}
              >
                {q.mood}
              </button>
            ))}
          </div>
        </div>

        {/* Nút hành động */}
        <div className="kcard-action-bar">
          <button type="button" className="btn-download-kcard" onClick={handleDownload}>
            <Download size={16} />
            <span>Tải Ảnh Story Về Máy</span>
          </button>
          <button type="button" className="btn-share-kcard" onClick={handleShare} title="Chia sẻ ngay">
            <Share2 size={16} />
            <span>Chia Sẻ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
