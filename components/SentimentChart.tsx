
import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, ReferenceLine,
} from 'recharts';
import type { DiaryEntry } from '../types';

interface SentimentChartProps {
  data: DiaryEntry[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data: DiaryEntry = payload[0].payload;
        return (
            <div className="bg-slate-800 text-white p-4 border border-slate-600 rounded-md shadow-lg max-w-xs break-words">
                <p className="font-bold text-base mb-2">{data.date}</p>
                <p className="text-sm whitespace-pre-wrap mb-2">{data.text}</p>
                <hr className="border-slate-500 my-2" />
                <p className="text-xs">{`긍정/부정 (x): ${data.x.toFixed(2)}`}</p>
                <p className="text-xs">{`각성/차분 (y): ${data.y.toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
        
        <XAxis
          type="number" dataKey="x" name="Valence" domain={[-1, 1]}
          ticks={[-1, -0.5, 0, 0.5, 1]} stroke="#4b5563"
        >
          <Label value="부정 ↔ 긍정" offset={-30} position="insideBottom" fill="#4b5563" />
        </XAxis>
        
        <YAxis
          type="number" dataKey="y" name="Arousal" domain={[-1, 1]}
          ticks={[-1, -0.5, 0, 0.5, 1]} stroke="#4b5563"
        >
          <Label value="차분 ↔ 격양" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#4b5563' }} offset={-5} />
        </YAxis>

        <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={1} />
        <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />

        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        
        <Scatter name="Sentiment" data={data} fill="#D93B3B" shape="circle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
