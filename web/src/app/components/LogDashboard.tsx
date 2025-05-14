import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import '../app.module.css'; 


interface Span {
  traceID: string;
  spanID: string;
  operationName: string;
  startTime: number;
  duration: number; // micro‑seconds
  tags: {
    key: string;
    type: string;
    value: string | number;
  }[];
}

interface LogData {
  data: {
    traceID: string;
    spans: Span[];
    processes: {
      [key: string]: {
        serviceName: string;
        tags: {
          key: string;
          type: string;
          value: string;
        }[];
      };
    };
  }[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e42', '#e11d48', '#a21caf', '#0ea5e9', '#fbbf24'];

const LogDashboard: React.FC<{ data: LogData }> = ({ data }) => {
  const spans = data.data[0].spans;

  /* ────────  Metrics  ──────── */
  const totalSpans = spans.length;
  const avgDuration = spans.reduce((acc, s) => acc + s.duration, 0) / totalSpans; // µs

  /* status‑code distribution */
  const statusCodes = spans.reduce<Record<string, number>>((acc, span) => {
    const status = span.tags.find(t => t.key === 'http.status_code')?.value;
    if (status) acc[status.toString()] = (acc[status.toString()] || 0) + 1;
    return acc;
  }, {});

  const statusCodeData = Object.entries(statusCodes).map(([code, count]) => ({
    name: `Status ${code}`,
    value: count,
  }));

  /* operation distribution */
  const operations = spans.reduce<Record<string, number>>((acc, span) => {
    acc[span.operationName] = (acc[span.operationName] || 0) + 1;
    return acc;
  }, {});

  const operationData = Object.entries(operations).map(([name, count]) => ({
    name,
    value: count,
  }));

  /* timeline */
  const timelineData = spans.map((s, i) => ({
    name: `${s.operationName} #${i + 1}`,
    duration: s.duration,
  }));

  /* ────────  UI  ──────── */
  return (
    <div className="body-bg">
      <main className="dashboard-main">
        {/* Title w/ underline */}
        <div className="top-border">
          <h1>Log Metrics Dashboard</h1>
        </div>

        {/* Metrics table */}
        <div className="metrics-wrapper">
          <table className="metrics-table">
            <tbody>
              <tr>
                <th>Total Spans</th>
                <td>{totalSpans}</td>
              </tr>
              <tr>
                <th>Average Duration</th>
                <td>{(avgDuration / 1_000_000).toFixed(2)}ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Charts row */}
        <div className="charts-row">
          {/* Pie ─ Status codes */}
          <div className="dashboard-card">
            <h3>HTTP Status Code Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusCodeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={3}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusCodeData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar ─ operations */}
          <div className="dashboard-card">
            <h3>Operation Name Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={operationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="name" tick={{ fill: '#334155', fontWeight: 600 }} />
                <YAxis tick={{ fill: '#334155', fontWeight: 600 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-row">
          <h3>Span Timeline</h3>
          <div className="timeline-scroll dashboard-card">
            <ResponsiveContainer
              width={timelineData.length > 6 ? timelineData.length * 80 : '100%'}
              height={240}
            >
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="name" tick={{ fill: '#334155', fontWeight: 600 }} />
                <YAxis tick={{ fill: '#334155', fontWeight: 600 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogDashboard;
