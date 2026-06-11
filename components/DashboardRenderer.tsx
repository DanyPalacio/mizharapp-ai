"use client";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

type Kpi = { label: string; value: string; change?: string; trend?: "up" | "down" | "neutral" };
type Chart = { title: string; type: string; x_key: string; keys: string[]; colors?: string[]; data: any[] };
export type DashboardData = {
  title: string; executive_summary?: string; kpi_cards?: Kpi[]; charts?: Chart[];
  ai_insight?: string; key_conclusions?: string[]; sources?: { name: string; url?: string; date?: string }[];
  category?: string;
};

const PALETTE = ["#FF6A00", "#1A1F24", "#3D6DFF", "#8A2EFF", "#B14EFF"];

function ChartBlock({ c }: { c: Chart }) {
  const colors = c.colors?.length ? c.colors : PALETTE;
  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-4">{c.title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {c.type === "bar" ? (
            <BarChart data={c.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
              <XAxis dataKey={c.x_key} fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
              {c.keys.map((k, i) => <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[6, 6, 0, 0]} />)}
            </BarChart>
          ) : c.type === "area" ? (
            <AreaChart data={c.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
              <XAxis dataKey={c.x_key} fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
              {c.keys.map((k, i) => (
                <Area key={k} dataKey={k} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.15} strokeWidth={2.5} />
              ))}
            </AreaChart>
          ) : c.type === "pie" ? (
            <PieChart>
              <Pie data={c.data} dataKey={c.keys[0]} nameKey={c.x_key} innerRadius={60} outerRadius={100} paddingAngle={2}>
                {c.data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          ) : (
            <LineChart data={c.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
              <XAxis dataKey={c.x_key} fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
              {c.keys.map((k, i) => (
                <Line key={k} dataKey={k} stroke={colors[i % colors.length]} strokeWidth={2.5} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DashboardRenderer({ d }: { d: DashboardData }) {
  return (
    <div className="space-y-6">
      {/* KPI cards: número grande, texto mínimo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {d.kpi_cards?.map((k, i) => (
          <div key={i} className="card p-6">
            <div className="eyebrow">{k.label}</div>
            <div className="kpi-value mt-2">{k.value}</div>
            {k.change && (
              <div className={`text-sm mt-1 font-medium ${k.trend === "up" ? "text-green-600" : k.trend === "down" ? "text-red-500" : "text-ink/50"}`}>
                {k.change}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {d.charts?.map((c, i) => <ChartBlock key={i} c={c} />)}
      </div>

      {/* AI Insight: componente firma */}
      {d.ai_insight && (
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#8A2EFF]/10 to-[#3D6DFF]/10 border border-[#8A2EFF]/25">
          <div className="eyebrow text-[#8A2EFF]">✦ AI Insight</div>
          <p className="mt-2 font-display font-semibold text-lg text-[#4B1FA6]">{d.ai_insight}</p>
        </div>
      )}

      {d.key_conclusions?.length ? (
        <div className="card p-6">
          <h3 className="font-semibold mb-3">Conclusiones clave</h3>
          <ul className="space-y-2">
            {d.key_conclusions.map((c, i) => (
              <li key={i} className="flex gap-3 text-ink/80">
                <span className="text-ember font-bold">→</span>{c}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {d.sources?.length ? (
        <div className="card p-6">
          <div className="eyebrow mb-3">Fuentes</div>
          <div className="flex flex-wrap gap-6 text-sm font-medium">
            {d.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="hover:text-ember">
                {s.name}{s.date ? ` · ${s.date}` : ""}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
