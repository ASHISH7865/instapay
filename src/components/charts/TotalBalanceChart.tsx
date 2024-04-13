import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const TotalBalanceChart = () => {
  const totalBalance = 1000000;

  return (
    <LineChart width={600} height={300} data={[{ name: 'Total Balance', totalBalance }]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="totalBalance" stroke="#8884d8" />
    </LineChart>
  );
};

export default TotalBalanceChart;
