import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const mockData = [
  { week: "Week 1", score: 65, benchmark: 70 },
  { week: "Week 2", score: 68, benchmark: 70 },
  { week: "Week 3", score: 74, benchmark: 72 },
  { week: "Week 4", score: 79, benchmark: 72 },
  { week: "Week 5", score: 82, benchmark: 75 },
  { week: "Week 6", score: 85, benchmark: 75 },
];

export const PerformanceTrendsChart = () => {
  return (
    <div className="bg-card border border-border shadow-sm rounded-[2rem] p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Performance Trends</h3>
          <p className="text-sm text-muted-foreground">Compared to National Benchmarks</p>
        </div>
        <div className="flex gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Student</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">Benchmark</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="week" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            />
            <Line 
              type="monotone" 
              dataKey="benchmark" 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false}
              activeDot={false}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3} 
              dot={{ strokeWidth: 2, r: 4, fill: "hsl(var(--background))" }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
