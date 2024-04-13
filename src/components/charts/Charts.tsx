'use client';

import {
  ResponsiveContainer,
  Area,
  Tooltip,
  AreaChart,
} from 'recharts';

export interface LineChartProps {
  data: { key: string; value: number }[];
}

export const AreaChartComponent = ({data} :LineChartProps) => {
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
          <stop offset="30%" stopColor="#7a7a7a" stopOpacity={0.4} />
          <stop offset="85%" stopColor="#7a7a7a11" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <Tooltip cursor={false} />
      <Area
        type="monotone"
        dataKey="value1"
        stroke="#12562a"
        fill="url(#colorview)"
      />
      <Area
        type="monotone"
        dataKey="value2"
        stroke="#720714"
        fill="url(#colorview)"
      />
    </AreaChart>
  </ResponsiveContainer>
  );
};
