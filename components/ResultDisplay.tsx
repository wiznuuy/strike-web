import React from 'react';
import { SentimentChart } from './SentimentChart';
import type { SentimentCoordinates } from '../types';

interface ResultDisplayProps {
  moderatedText: string;
  sentimentCoordinates: SentimentCoordinates | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ moderatedText, sentimentCoordinates, error }) => {
  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg shadow-lg text-center">
        <p className="font-semibold">오류</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {moderatedText && (
        <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-sky-400 mb-3">순화된 텍스트</h2>
          <p className="text-slate-300 whitespace-pre-wrap">{moderatedText}</p>
        </div>
      )}
      {sentimentCoordinates && (
        <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-sky-400 mb-4">감정 분석 결과</h2>
          <div className="h-80 w-full">
            {/* FIX: Create a temporary DiaryEntry object to satisfy the SentimentChart's expected data prop type. */}
            <SentimentChart data={[{
                ...sentimentCoordinates,
                id: 'temp-result',
                date: '현재 분석',
                text: moderatedText
            }]} />
          </div>
        </div>
      )}
    </div>
  );
};
