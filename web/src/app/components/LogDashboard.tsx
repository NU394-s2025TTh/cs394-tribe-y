import React, { useMemo, useState } from 'react';
import EvaluateAllButton from './EvaluateAllButton';
import TestMatchButton from './TestMatchButton';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { Home, Database, BarChart2, Settings } from 'lucide-react';

/* ───────── Types ───────── */
interface Tag {
  key: string;
  type: string;
  value: string | number;
}
interface Span {
  traceID: string;
  spanID: string;
  operationName: string;
  startTime: number;
  duration: number; // μs
  tags: Tag[];
}
interface Trace {
  traceID: string;
  spans: Span[];
}
export interface LogData {
  data: Trace[];
}

const COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e42',
  '#e11d48',
  '#a21caf',
  '#0ea5e9',
  '#fbbf24',
];
const percentile = (arr: number[], p: number) => {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(p * (sorted.length - 1))];
};

const LogDashboard: React.FC<{ data: LogData | LogData[] }> = ({ data }) => {
  const [range, setRange] = useState('Last 24 Hours');

  const logs: LogData[] = useMemo(
    () => (Array.isArray(data) ? data : [data]),
    [data]
  );
  const spans = useMemo(
    () => logs.flatMap((log) => log.data).flatMap((trace) => trace.spans),
    [logs]
  );

  const totalTraces = logs.flatMap((log) => log.data).length;
  const totalSpans = spans.length;
  const durationsMs = spans.map((s) => s.duration / 1_000_000);
  const avgDuration = totalSpans
    ? durationsMs.reduce((a, b) => a + b, 0) / totalSpans
    : 0;
  const p95 = percentile(durationsMs, 0.95);
  const statusBuckets = spans.reduce<
    Record<'2xx' | '4xx' | '5xx' | 'other', number>
  >(
    (acc, span) => {
      const code = span.tags.find((t) => t.key === 'http.status_code')
        ?.value as number;
      if (code >= 200 && code < 300) acc['2xx']++;
      else if (code >= 400 && code < 500) acc['4xx']++;
      else if (code >= 500 && code < 600) acc['5xx']++;
      else acc.other++;
      return acc;
    },
    { '2xx': 0, '4xx': 0, '5xx': 0, other: 0 }
  );
  const statusData = (Object.entries(statusBuckets) as [string, number][]).map(
    ([name, value]) => ({ name: name.toUpperCase(), value })
  );
  const errorRate = totalSpans
    ? ((statusBuckets['4xx'] + statusBuckets['5xx']) / totalSpans) * 100
    : 0;
  const opData = Object.entries(
    spans.reduce<Record<string, number>>((acc, s) => {
      acc[s.operationName] = (acc[s.operationName] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  const timeline = spans.map((s, idx) => ({
    name: `${s.spanID.slice(0, 6)}-${idx}`,
    ms: s.duration / 1_000_000,
  }));

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {[
          { Icon: Home, label: 'Home' },
          { Icon: Database, label: 'Data' },
          { Icon: BarChart2, label: 'Metrics' },
          { Icon: Settings, label: 'Settings' },
        ].map(({ Icon, label }) => (
          <div key={label} className="icon-group">
            <Icon className="sidebar-icon" title={label} />
            <span className="tooltip">{label}</span>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1 className="title">Log Metrics Dashboard</h1>
          <select
            className="dropdown"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </header>

        <section className="kpi-grid" aria-label="KPI Grid">
          {[
            { label: 'Traces', value: totalTraces },
            { label: 'Spans', value: totalSpans },
            { label: 'Avg Latency', value: `${avgDuration.toFixed(1)} ms` },
            { label: 'p95 Latency', value: `${p95.toFixed(1)} ms` },
            { label: 'Error Rate', value: `${errorRate.toFixed(1)}%` },
          ].map((kpi) => (
            <div key={kpi.label} className="kpi-card">
              <span className="kpi-label">{kpi.label}</span>
              <span className="kpi-value">{kpi.value}</span>
            </div>
          ))}
        </section>

        <section className="chart-section">
          <div className="chart-container">
            <h2 className="chart-title">HTTP Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  isAnimationActive
                  animationDuration={800}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentClassName="tooltip-content"
                  itemClassName="tooltip-item"
                />
                <Legend
                  wrapperClassName="legend"
                  iconType="circle"
                  verticalAlign="bottom"
                  layout="horizontal"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h2 className="chart-title">Operation Frequency</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={opData}
                layout="vertical"
                margin={{ left: 20 }}
                isAnimationActive
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  tick={{ fill: '#d1d5db', fontWeight: '600' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#d1d5db', fontWeight: '600' }}
                />
                <Tooltip
                  contentClassName="tooltip-content"
                  itemClassName="tooltip-item"
                />
                <Bar
                  dataKey="value"
                  fill={COLORS[0]}
                  radius={[0, 8, 8, 0]}
                  isAnimationActive
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="timeline-section">
          <h2 className="chart-title">Span Latency Timeline (ms)</h2>
          <div className="timeline-container">
            <div className="timeline-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeline}
                  margin={{ top: 0, bottom: 0, left: 20 }}
                  isAnimationActive
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#d1d5db', fontSize: 10 }}
                  />
                  <YAxis tick={{ fill: '#d1d5db' }} />
                  <Tooltip
                    contentClassName="tooltip-content"
                    itemClassName="tooltip-item"
                  />
                  <Line
                    type="monotone"
                    dataKey="ms"
                    stroke={COLORS[1]}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        <section className="llm-section">
          <h2>🧠 LLM Matcher</h2>
          <TestMatchButton />
          <EvaluateAllButton />
        </section>
      </main>
    </div>
  );
};

export default LogDashboard;
