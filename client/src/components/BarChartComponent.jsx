import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
} from "recharts";

//color change to css value
const CustomBar = (props) => {
  const { fill, x, y, width, height, type } = props;
  const color = type === "F" ? "#FF0000" : "#82ca9d";
  return <Rectangle x={x} y={y} width={width} height={height} fill={color} />;
};

export default function BarChartComponent({ getCount }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={getCount()}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="count"
          fill="#82ca9d"
          shape={<CustomBar />}
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
