import React, { useState } from 'react';
import type { KoreanStage } from '../Header/Header';
import { HangeulView } from './HangeulView/HangeulView';
import { KoreanVocabView } from './KoreanVocabView/KoreanVocabView';
import { KoreanGrammarView } from './KoreanGrammarView/KoreanGrammarView';
import { KoreanDialogueView } from './KoreanDialogueView/KoreanDialogueView';
import './KoreanHubView.css';

export type { KoreanStage };

interface KoreanHubViewProps {
  activeStage?: KoreanStage;
  onStageChange?: (stage: KoreanStage) => void;
}

export const KoreanHubView: React.FC<KoreanHubViewProps> = ({
  activeStage: controlledStage,
}) => {
  const [internalStage] = useState<KoreanStage>('hangeul');
  const activeStage = controlledStage ?? internalStage;

  return (
    <div className="korean-hub-container">
      {/* Vùng Nội Dung Toàn Màn Hình - Giải Phóng Hoàn Toàn Diện Tích Bằng Menu Ngoài */}
      <div className="kr-stage-content-wrap">
        {activeStage === 'hangeul' && <HangeulView />}
        {activeStage === 'vocab' && <KoreanVocabView />}
        {activeStage === 'grammar' && <KoreanGrammarView />}
        {activeStage === 'dialogue' && <KoreanDialogueView />}
      </div>
    </div>
  );
};
