import React, { useState, useEffect } from 'react';
import { SentimentChart } from './SentimentChart';
import { getDiaries } from '../services/diaryService';
import type { DiaryEntry } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export const MainPage: React.FC = () => {
    const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedDiaries = await getDiaries();
                setDiaries(fetchedDiaries);
            } catch (err) {
                setError('Failed to load diary entries.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDiaries();
    }, []);

    return (
        <section className="flex flex-col lg:flex-row items-center justify-center p-8 md:p-12 min-h-[calc(100vh-60px)] bg-[#CE2E2E]">
            <div className="w-full lg:w-1/3 text-center lg:text-left mb-12 lg:mb-0 lg:pr-12">
                <h3 className="text-4xl md:text-5xl font-extrabold text-[#FEFBF2] leading-tight">
                    호령하라's
                </h3>
                <h2 className="text-5xl md:text-6xl font-black text-[#FEFBF2] tracking-wider mt-2">
                    STRIKE DIARY
                </h2>
            </div>
            <div className="w-full lg:w-2/3 h-[50vh] lg:h-[70vh] bg-[#FEFBF2] rounded-3xl shadow-2xl p-4 md:p-6">
                 {isLoading ? (
                    <div className="flex justify-center items-center h-full text-gray-600">
                        <LoadingSpinner />
                        <p className="ml-4">Loading diaries...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full text-red-500">{error}</div>
                ) : diaries.length > 0 ? (
                    <SentimentChart data={diaries} />
                ) : (
                    <div className="flex justify-center items-center h-full text-center text-gray-500">
                        <p className="text-lg">
                            No diary entries found.
                            <br/>
                            Go to the 'WRITE' page to add your first one!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};