import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Students", value: 400 },
  { name: "Teachers", value: 100 },
  { name: "Staff", value: 50 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function MyPieChart() {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={120}
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default MyPieChart;