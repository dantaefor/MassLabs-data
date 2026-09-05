import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { DurationBucket, UserRecord } from '../types';
import { Clock, ShieldCheck, Award, Zap } from 'lucide-react';

interface DurationDistributionChartProps {
  durationBuckets: DurationBucket[];
  users: UserRecord[];
}

export const DurationDistributionChart: React.FC<DurationDistributionChartProps> = ({
  durationBuckets,
  users,
}) => {
  // Plan vs Duration calculations
  const planStats = ['Free', 'Pro', 'Enterprise'].map((planName) => {
    const planUsers = users.filter((u) => u.plan === planName);
    const count = planUsers.length;
    const avg =
      count > 0
        ? Math.round(
            (planUsers.reduce((sum, u) => sum + u.sessionDurationMinutes, 0) / count) * 10
          ) / 10
        : 0;
    return {
      plan: planName,
      count,
      avgDuration: avg,
      color: planName === 'Enterprise' ? '#8b5cf6' : planName === 'Pro' ? '#3b82f6' : '#94a3b8',
    };
  });

  const bucketColors = ['#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'];

  return (
    <div id="duration-distribution-card" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              체류시간 구간별 분포 및 플랜별 몰입도
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            사용자가 세션당 얼마나 머무르는지와 구독 플랜(Free/Pro/Enterprise) 간의 상관관계를 분석합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>파워 유저(60분 이상) 비중: 42%</span>
        </div>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Duration Buckets Histogram (7 cols) */}
        <div className="md:col-span-7">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>세션 체류시간 구간별 사용자 수 (히스토그램)</span>
            <span className="text-slate-400 font-normal">총 50명 기준</span>
          </div>

          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={durationBuckets}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  unit="명"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as DurationBucket;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs">
                          <div className="font-bold text-sm">{data.range}</div>
                          <div className="text-indigo-300 font-medium text-[11px] mb-1">
                            {data.label}
                          </div>
                          <div className="text-slate-300">
                            해당 사용자: <strong className="text-white">{data.count}명</strong> ({data.percentage}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" name="사용자 수" radius={[6, 6, 0, 0]} barSize={34}>
                  {durationBuckets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={bucketColors[index % bucketColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Plan vs Duration correlation (5 cols) */}
        <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-3">
            <span>구독 플랜별 체류시간 비교</span>
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="space-y-3">
            {planStats.map((p) => {
              const maxScale = 110;
              const barWidth = Math.min(100, Math.round((p.avgDuration / maxScale) * 100));

              return (
                <div key={p.plan} className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span>{p.plan} 플랜</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        ({p.count}명)
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 text-xs">
                      평균 {p.avgDuration}분
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-[10px] text-slate-500 leading-relaxed">
            💡 <strong>핵심 비즈니스 인사이트:</strong> Enterprise 사용자는 평균 93.8분 동안 체류하며 Free(31.2분) 대비 <strong>3배 이상의 시간</strong>을 AI 툴에 투자하고 있습니다. 체류시간이 길수록 유료 전환율이 급상승합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
