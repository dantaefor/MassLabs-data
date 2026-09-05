import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { MonthlyStat } from '../types';
import { TrendingUp, UserPlus, Info } from 'lucide-react';

interface GrowthChartProps {
  monthlyData: MonthlyStat[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ monthlyData }) => {
  const [chartMode, setChartMode] = useState<'combo' | 'cumulative' | 'newSignups'>('combo');

  // Key metrics calculation
  const latestMonth = monthlyData[monthlyData.length - 1];
  const firstMonth = monthlyData[0];
  const totalGrowthPercent = Math.round(
    ((latestMonth.cumulativeUsers - firstMonth.cumulativeUsers) / firstMonth.cumulativeUsers) * 100
  );
  const avgMonthlyNewSignups = Math.round(
    monthlyData.reduce((acc, curr) => acc + curr.newSignups, 0) / monthlyData.length
  );

  return (
    <div id="subscriber-growth-card" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              월별 가입자 수 변화 및 신규 가입자 추이
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            월단위 누적 가입자 총량(선 그래프)과 당월 신규 유입자(막대 그래프)의 복합 성장 추이입니다.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setChartMode('combo')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              chartMode === 'combo'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            복합 보기 (전체)
          </button>
          <button
            onClick={() => setChartMode('cumulative')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              chartMode === 'cumulative'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            누적 가입자만
          </button>
          <button
            onClick={() => setChartMode('newSignups')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              chartMode === 'newSignups'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            신규 유입만
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
        <div>
          <div className="text-slate-500 text-[11px]">총 누적 가입자</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            {latestMonth.cumulativeUsers}명
            <span className="text-[10px] text-indigo-600 font-normal ml-1">(+{totalGrowthPercent}% 성장)</span>
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px]">최근 월 신규 가입자</div>
          <div className="text-base font-bold text-emerald-600 mt-0.5">
            +{latestMonth.newSignups}명
            <span className="text-[10px] text-slate-500 font-normal ml-1">({latestMonth.monthLabel})</span>
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px]">월평균 신규 가입</div>
          <div className="text-base font-bold text-slate-800 mt-0.5">
            약 {avgMonthlyNewSignups}명/월
            <span className="text-[10px] text-slate-500 font-normal ml-1">(안정적 우상향)</span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={monthlyData}
            margin={{ top: 15, right: 15, bottom: 20, left: -10 }}
          >
            <defs>
              <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="monthLabel"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              domain={[0, 'dataMax + 10']}
              unit="명"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#10b981' }}
              tickLine={false}
              axisLine={false}
              domain={[0, 15]}
              unit="명"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as MonthlyStat;
                  return (
                    <div className="bg-slate-900/95 backdrop-blur text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700 min-w-44">
                      <div className="font-bold text-sm mb-1.5 border-b border-slate-800 pb-1 flex justify-between items-center">
                        <span>{data.monthLabel}</span>
                        <span className="text-[10px] text-slate-400">{data.month}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            누적 가입자:
                          </span>
                          <span className="font-bold text-white">{data.cumulativeUsers}명</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            신규 가입자:
                          </span>
                          <span className="font-bold text-emerald-400">+{data.newSignups}명</span>
                        </div>
                        {data.growthRate !== 0 && (
                          <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                            <span>신규 유입 증감률:</span>
                            <span
                              className={`font-semibold ${
                                data.growthRate > 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {data.growthRate > 0 ? `+${data.growthRate}%` : `${data.growthRate}%`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
            />

            {/* Bars for New Signups */}
            {(chartMode === 'combo' || chartMode === 'newSignups') && (
              <Bar
                yAxisId="right"
                dataKey="newSignups"
                name="신규 가입자 (월별)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
            )}

            {/* Area/Line for Cumulative Users */}
            {(chartMode === 'combo' || chartMode === 'cumulative') && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="cumulativeUsers"
                name="누적 가입자 수"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#growthAreaGradient)"
                dot={{ r: 3, fill: '#6366f1', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#4f46e5' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart insight bottom callout */}
      <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600 bg-indigo-50/40 p-2.5 rounded-lg">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-indigo-950 font-semibold">인사이트 해석:</strong> 초기에는 월 2~3명의 소규모 가입세를 보였으나, 2026년 6월 이후 가속화되어 최근 9월에는 단일 월 최대치인 9명의 신규 사용자가 유입되었습니다. 누적 곡선이 2차 지수 상승 곡선에 근접하고 있습니다.
        </p>
      </div>
    </div>
  );
};
