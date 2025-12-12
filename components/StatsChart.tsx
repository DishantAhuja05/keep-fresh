import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatsChartProps {
  fresh: number;
  soon: number;
  expired: number;
}

const StatsChart: React.FC<StatsChartProps> = ({ fresh, soon, expired }) => {
  const data = [
    { name: 'Expired', value: expired, color: '#EF4444' }, // red-500
    { name: 'Soon', value: soon, color: '#EAB308' },    // yellow-500
    { name: 'Fresh', value: fresh, color: '#10B981' },   // emerald-500
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
        No items tracked
      </div>
    );
  }

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
