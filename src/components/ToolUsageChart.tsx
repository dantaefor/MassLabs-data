import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ProgramStat, AIProgram } from '../types';
import { PROGRAM_CONFIG } from '../data/dummyData';
import { Cpu, Clock, CheckCircle2, Zap } from 'lucide-react';

interface ToolUsageChartProps {
  programStats: ProgramStat[];
  selectedProgram: AIProgram | null;
  onSelectProgram: (prog: AIProgram | null) => void;
}

export const ToolUsageChart: React.FC<ToolUsageChartProps> = ({
  programStats,
  selectedProgram,
  onSelectProgram,
}) => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'duration'>('realtime');

  // Total online
  const totalOnline = programStats.reduce((acc, p) => acc + p.onlineCount, 0);

  // Data for Pie Chart (Real-time online users)
  const pieData = programStats.map((p) => ({
    name: p.displayName,
    value: p.onlineCount,
    percentage: totalOnline > 0 ? Math.round((p.onlineCount / totalOnline) * 100) : 0,
    color: p.color,
    totalCount: p.totalCount,
    avgDuration: p.avgDurationMinutes,
  }));

  // Data for Bar Chart (Average session duration)
  const durationData = [...programStats]
    .sort((a, b) => b.avgDurationMinutes - a.avgDurationMinutes)
    .map((p) => ({
      name: p.displayName,
      avgMinutes: p.avgDurationMinutes,
      color: p.color,
      onlineCount: p.onlineCount,
    }));

  return (
    <div id="tool-usage-analytics-card" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <Cpu className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              실시간 AI 프로그램 사용 현황 및 체류시간 분석
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            LaserFish, ArchiMap 등 각 AI 서비스 도구별 실시간 동시 접속 및 평균 체류시간을 비교합니다.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('realtime')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'realtime'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            실시간 점유율 (도넛)
          </button>
          <button
            onClick={() => setActiveTab('duration')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'duration'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            프로그램별 체류시간 (막대)
          </button>
        </div>
      </div>

      {/* Main Visual Content */}
      {activeTab === 'realtime' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Donut Chart */}
          <div className="md:col-span-6 h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={(entry) => {
                    const prog = entry.name as AIProgram;
                    onSelectProgram(selectedProgram === prog ? null : prog);
                  }}
                  className="cursor-pointer"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={entry.color}
                      stroke={selectedProgram === entry.name ? '#0f172a' : '#ffffff'}
                      strokeWidth={selectedProgram === entry.name ? 2.5 : 1}
                      opacity={selectedProgram && selectedProgram !== entry.name ? 0.35 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 backdrop-blur text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-700 min-w-36">
                          <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            {data.name}
                          </div>
                          <div className="text-slate-300">
                            실시간 이용자: <strong className="text-white">{data.value}명</strong>
                          </div>
                          <div className="text-slate-300">
                            점유율: <strong className="text-emerald-400">{data.percentage}%</strong>
                          </div>
                          <div className="text-slate-400 text-[10px] mt-1 pt-1 border-t border-slate-800">
                            평균 체류: {data.avgDuration}분
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label in Donut */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400">실시간 활성</span>
              <span className="text-2xl font-black text-slate-900">{totalOnline}명</span>
              <span className="text-[9px] text-emerald-600 font-medium">동시 세션</span>
            </div>
          </div>

          {/* Interactive Tool Cards / List */}
          <div className="md:col-span-6 space-y-2">
            {programStats.map((p) => {
              const isSelected = selectedProgram === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => onSelectProgram(isSelected ? null : p.name)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50/70 hover:bg-slate-100/80 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{p.displayName}</span>
                        {p.name === 'ArchiMap' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                            체류 1위
                          </span>
                        )}
                        {p.name === 'LaserFish' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 font-semibold">
                            호출빈도 1위
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] truncate max-w-[190px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {p.description}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold">
                      {p.onlineCount}명 <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>/ {p.totalCount}</span>
                    </div>
                    <div className={`text-[10px] font-medium ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                      평균 {p.avgDurationMinutes}분
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Duration Bar Chart Comparison */
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={durationData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                unit="분"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs">
                        <div className="font-bold text-sm">{data.name}</div>
                        <div className="text-slate-300 mt-1">
                          세션당 평균 체류시간: <strong className="text-purple-300">{data.avgMinutes}분</strong>
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          현재 {data.onlineCount}명 온라인 사용 중
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="avgMinutes"
                name="평균 체류시간(분)"
                radius={[0, 6, 6, 0]}
                barSize={18}
                onClick={(entry) => {
                  const prog = entry.name as AIProgram;
                  onSelectProgram(selectedProgram === prog ? null : prog);
                }}
                className="cursor-pointer"
              >
                {durationData.map((entry) => (
                  <Cell
                    key={`bar-${entry.name}`}
                    fill={entry.color}
                    opacity={selectedProgram && selectedProgram !== entry.name ? 0.35 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* LaserFish vs ArchiMap Focused Callout Comparison */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100">
          <div className="flex items-center gap-1.5 font-bold text-sky-950 mb-1">
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            LaserFish 사용 패턴
          </div>
          <p className="text-[11px] text-sky-900 leading-relaxed">
            체류시간은 <strong>평균 43.8분</strong>으로 비교적 짧고 집중된 쿼리 중심이나, 일일 재방문 빈도가 높아 실시간 문서 처리 허브로 정착되었습니다.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            ArchiMap 사용 패턴
          </div>
          <p className="text-[11px] text-indigo-900 leading-relaxed">
            체류시간이 <strong>평균 82.4분</strong>(최장 128분)으로 가장 길며, 전체 가입자의 36%가 주력으로 삼고 있어 B2B 고관여 파워 유저 비중이 높습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
