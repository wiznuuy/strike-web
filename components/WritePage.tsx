import React, { useState } from 'react';
import { analyzeSentiment, moderateText } from '../services/geminiService';
import { addDiary } from '../services/diaryService';
import { LoadingSpinner } from './LoadingSpinner';

interface WritePageProps {
    onFinish: () => void;
}

export const WritePage: React.FC<WritePageProps> = ({ onFinish }) => {
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [text, setText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!text.trim() || !date) {
            setError('Please select a date and write your diary entry.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const moderatedText = await moderateText(text);
            const coordinates = await analyzeSentiment(moderatedText);
            await addDiary({
                date,
                text: moderatedText,
                x: coordinates.x,
                y: coordinates.y
            });
            onFinish(); // Navigate back to the main page
        } catch (err) {
            console.error(err);
            setError('Failed to analyze and save the entry. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-[calc(100vh-60px)] bg-[#FCF3E3] text-black p-8 md:p-12 lg:p-16">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <label htmlFor="diary-date" className="text-2xl font-bold text-gray-700 block mb-3">날짜 선택</label>
                    <input
                        id="diary-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full md:w-1/3 p-3 border-2 border-gray-300 rounded-lg text-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>

                <div className="mb-8">
                    <label htmlFor="diary-text" className="text-2xl font-bold text-gray-700 block mb-3">관람 일기 작성</label>
                    <textarea
                        id="diary-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="오늘 경기에 대한 당신의 생각과 감정을 자유롭게 적어주세요..."
                        className="w-full h-64 md:h-80 p-4 border-2 border-gray-300 rounded-lg text-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none placeholder-gray-400"
                        disabled={isLoading}
                        aria-label="Diary entry text area"
                    />
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !text.trim()}
                        className="bg-[#D93B3B] text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center shadow-lg"
                        aria-live="polite"
                    >
                        {isLoading && <LoadingSpinner />}
                        <span className={isLoading ? 'ml-2' : ''}>
                            {isLoading ? 'Analyzing...' : '입력하기'}
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};