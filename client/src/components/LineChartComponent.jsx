import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineChartComponent({
  dataKey,
  name,
  color,
  minY,
  maxY,
  width,
  data,
}) {
  const dataLength = data.length;
  const interval = Math.max(1, Math.floor(dataLength / 10));
  console.log("its me data");
  console.log(data);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="uid" interval={interval} />
        <YAxis domain={[minY, maxY]} />
        <Tooltip c />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          name={name}
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
