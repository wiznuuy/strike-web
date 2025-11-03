
export interface SentimentCoordinates {
  x: number;
  y: number;
}

export interface DiaryEntry extends SentimentCoordinates {
  id: string;
  date: string;
  text: string;
}
