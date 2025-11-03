
import React from 'react';

interface InputFormProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ inputText, setInputText, onSubmit, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      onSubmit();
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700">
      <label htmlFor="review-text" className="block text-lg font-medium text-slate-300 mb-3">
        관람 기록 입력
      </label>
      <textarea
        id="review-text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="여기에 경기 관람 후기를 입력하세요. 예: '오늘 우리 팀 선수들 정말 잘 싸웠다! 마지막 골은 정말 환상적이었어!'"
        className="w-full h-40 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 resize-none placeholder-slate-500"
        disabled={isLoading}
      />
      <div className="mt-4 flex justify-end items-center">
        <span className="text-xs text-slate-400 mr-4">Ctrl/Cmd + Enter로 제출</span>
        <button
          onClick={onSubmit}
          disabled={isLoading || !inputText.trim()}
          className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-200"
        >
          {isLoading ? '분석 중...' : '분석하기'}
        </button>
      </div>
    </div>
  );
};
