import type { DiaryEntry } from '../types';
import { analyzeSentiment, moderateText } from './geminiService';

const DIARY_KEY = 'strike_diary_entries';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches diary entries.
 * On first load, it populates the store from a local JSON file,
 * moderating and analyzing each entry for sentiment, then caches it in localStorage.
 * This is done sequentially with delays to avoid API rate limiting.
 * Subsequent loads will retrieve data directly from localStorage.
 * @returns A promise that resolves to an array of DiaryEntry objects.
 */
export const getDiaries = async (): Promise<DiaryEntry[]> => {
  const diariesJson = localStorage.getItem(DIARY_KEY);

  // If diaries exist in localStorage, return them.
  if (diariesJson) {
    return JSON.parse(diariesJson);
  }

  // First time load: fetch data.json, moderate, process, analyze sentiment, and then cache.
  const response = await fetch('/data.json');
  if (!response.ok) {
      throw new Error('Failed to fetch data.json');
  }
  const initialDiaryData: { game_date: string; content: string }[] = await response.json();
  
  const processedDiaries: DiaryEntry[] = [];
  
  // Process entries sequentially with a delay to avoid hitting API rate limits.
  for (const [index, entry] of initialDiaryData.entries()) {
    try {
      const moderatedContent = await moderateText(entry.content);
      const coordinates = await analyzeSentiment(moderatedContent);
      const diaryEntry: DiaryEntry = {
        id: `${entry.game_date}-${index}`,
        date: entry.game_date,
        text: moderatedContent,
        x: coordinates.x,
        y: coordinates.y,
      };
      processedDiaries.push(diaryEntry);
    } catch (error) {
      console.error(`Failed to process entry for date ${entry.game_date}:`, error);
      // Continue to the next entry even if one fails.
    }
    
    // The Gemini API free tier often has a limit of 60 requests per minute (1 request per second).
    // Since we make 2 requests per entry (moderate + analyze), we need a delay of over 2 seconds.
    // A 2.1 second delay provides a safe buffer.
    await delay(2100);
  }

  localStorage.setItem(DIARY_KEY, JSON.stringify(processedDiaries));
  return processedDiaries;
};

/**
 * Adds a new diary entry to localStorage.
 * @param diary - The diary entry to add, without an ID.
 * @returns A promise that resolves to the newly created DiaryEntry with an ID.
 */
export const addDiary = async (diary: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry> => {
  const diariesJson = localStorage.getItem(DIARY_KEY);
  const diaries: DiaryEntry[] = diariesJson ? JSON.parse(diariesJson) : [];
  
  const newDiary: DiaryEntry = { ...diary, id: new Date().toISOString() };
  const updatedDiaries = [...diaries, newDiary];
  
  localStorage.setItem(DIARY_KEY, JSON.stringify(updatedDiaries));
  
  return Promise.resolve(newDiary);
};