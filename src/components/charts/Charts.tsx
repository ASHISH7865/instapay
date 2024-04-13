'use client';

import {
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

export interface LineChartProps {
  data: { key: string; value: number }[];
  strokeColor?: string;
}

export const AreaChartComponent = ({data , strokeColor} :LineChartProps) => {
  
const generateStrokeVariant = (color: string) => {
  const stopColor1 = color + '11';
  const stopColor2 = color;
  return { stopColor1, stopColor2 };
};

  return (
    <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
      }}
    >
      <defs>
        <linearGradient id="colorview" x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stopColor={generateStrokeVariant(strokeColor || "#7a7a7a").stopColor2} stopOpacity={0.4} />
          <stop offset="85%" stopColor={generateStrokeVariant(strokeColor || "#7a7a7a").stopColor1} stopOpacity={0.2} />
        </linearGradient>
      </defs> 
      {/* <Tooltip cursor={false} /> */}
      <Area
        type="monotone"
        dataKey="value"
        stroke={strokeColor || '#7a7a7a'}
        fill="url(#colorview)"
      />
    </AreaChart>
  </ResponsiveContainer>
  );
};
