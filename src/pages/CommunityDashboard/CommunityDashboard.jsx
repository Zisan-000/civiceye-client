import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const CommunityDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:1069/api/admin/community-stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats)
    return (
      <div className="p-20 text-center font-black italic uppercase animate-pulse">
        Loading Analytics...
      </div>
    );

  return (
    <div className=" bg-base-200 p-8 my-10 rounded-2xl">
      <div className="max-w-6xl mx-auto mt-10">
        <header className="mb-12 text-center lg:text-left">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900">
            Community <span className="text-primary">Impact</span>
          </h1>
          <p className="font-bold opacity-50 uppercase tracking-widest mt-2">
            Analytical insights for society management
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CHART 1: SOCIETY HEALTH GAUGE */}
          <div className="bg-white p-10 rounded-[50px] shadow-2xl flex flex-col items-center justify-center">
            <h3 className="text-sm font-black uppercase opacity-40 mb-8 tracking-[0.3em]">
              Society Health Score
            </h3>

            <div className="relative flex items-center justify-center">
              {/* Simple Radial Progress using DaisyUI/Tailwind */}
              <div
                className={`radial-progress font-black italic text-4xl shadow-2xl border-8 border-slate-50`}
                style={{
                  "--value": stats.healthScore,
                  "--size": "15rem",
                  "--thickness": "1.5rem",
                  color:
                    stats.healthScore > 70
                      ? "#10b981"
                      : stats.healthScore > 40
                        ? "#f59e0b"
                        : "#ef4444",
                }}
                role="progressbar"
              >
                {stats.healthScore}%
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="font-black uppercase italic text-2xl text-slate-800">
                {stats.resolved} / {stats.total}
              </p>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                Issues Resolved Successfully
              </p>
            </div>
          </div>

          {/* CHART 2: CATEGORY DISTRIBUTION DOUGHNUT */}
          <div className="bg-white p-10 rounded-[50px] shadow-2xl flex flex-col">
            <h3 className="text-sm font-black uppercase opacity-40 mb-4 tracking-[0.3em] text-center">
              Issue Distribution
            </h3>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      fontWeight: "bold",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{
                      textTransform: "uppercase",
                      fontSize: "10px",
                      fontWeight: "900",
                      letterSpacing: "1px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <p className="text-center text-[10px] font-bold opacity-30 uppercase mt-4">
              Data updated in real-time based on citizen reports
            </p>
          </div>
        </div>

        {/* BOTTOM STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-xl">
            <p className="text-[10px] font-black uppercase opacity-50 tracking-widest mb-1">
              Total Reports
            </p>
            <p className="text-4xl font-black italic">{stats.total}</p>
          </div>
          <div className="bg-primary text-white p-8 rounded-[40px] shadow-xl">
            <p className="text-[10px] font-black uppercase opacity-50 tracking-widest mb-1">
              Active Now
            </p>
            <p className="text-4xl font-black italic">
              {stats.total - stats.resolved}
            </p>
          </div>
          <div className="bg-white text-slate-900 p-8 rounded-[40px] shadow-xl border border-slate-200">
            <p className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-1">
              Status
            </p>
            <p
              className={`text-2xl font-black italic uppercase ${stats.statusColor}`}
            >
              {stats.statusLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;
