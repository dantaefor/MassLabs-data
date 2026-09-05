import React from 'react';
import { Users, Radio, Sparkles, Clock, TrendingUp, Cpu } from 'lucide-react';
import { AIProgram, ProgramStat } from '../types';
import { PROGRAM_CONFIG } from '../data/dummyData';

interface MetricsOverviewProps {
  totalUsers: number;
  onlineCount: number;
  idleCount: number;
  offlineCount: number;
  newSignupsThisMonth: number;
  newSignupsMoM: number;
  avgDurationOverall: number;
  topProgram: ProgramStat;
  laserFishStats: ProgramStat | undefined;
  archiMapStats: ProgramStat | undefined;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  totalUsers,
  onlineCount,
  idleCount,
  offlineCount,
  newSignupsThisMonth,
  newSignupsMoM,
  avgDurationOverall,
  topProgram,
  laserFishStats,
  archiMapStats,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. 실시간 이용자 (Real-time Live Users) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500" />
            실시간 이용자
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
            LIVE
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {onlineCount}
          </span>
          <span className="text-sm font-medium text-slate-500">명 접속 중</span>
        </div>

        {/* Breakdown bar */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            온라인 {onlineCount}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            대기 {idleCount}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            오프라인 {offlineCount}
          </span>
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          전체 가입자 대비 약 {Math.round((onlineCount / totalUsers) * 100)}%가 현재 활성 세션 유지
        </p>
      </div>

      {/* 2. 실시간 이용 프로그램 현황 (Active Tools Focus) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            실시간 이용 프로그램 1위
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${PROGRAM_CONFIG[topProgram.name]?.color}15`,
              color: PROGRAM_CONFIG[topProgram.name]?.color,
            }}
          >
            점유율 {topProgram.percentage}%
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl font-black tracking-tight"
            style={{ color: PROGRAM_CONFIG[topProgram.name]?.color }}
          >
            {topProgram.displayName}
          </span>
          <span className="text-xs font-medium text-slate-600">
            ({topProgram.onlineCount}명 사용 중)
          </span>
        </div>

        {/* LaserFish vs ArchiMap comparison */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <div className="text-slate-500 text-[10px]">LaserFish</div>
            <div className="font-semibold text-sky-600">
              {laserFishStats?.onlineCount ?? 0}명 온라인
            </div>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <div className="text-slate-500 text-[10px]">ArchiMap</div>
            <div className="font-semibold text-indigo-600">
              {archiMapStats?.onlineCount ?? 0}명 온라인
            </div>
          </div>
        </div>
      </div>

      {/* 3. 신규 가입자 (월단위) & 가입자 수 변화 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            당월 신규 가입자
          </span>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            +{newSignupsMoM}% MoM
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            +{newSignupsThisMonth}
          </span>
          <span className="text-sm font-medium text-slate-500">명 / 이번 달</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2.5 border-t border-slate-100">
          <span className="text-slate-500">누적 가입자:</span>
          <span className="font-bold text-slate-900">{totalUsers}명 달성</span>
        </div>

        <p className="mt-1 text-[11px] text-slate-500">
          최근 3개월간 가입자 유입 속도가 가속화되고 있습니다.
        </p>
      </div>

      {/* 4. 평균 체류시간 (Session Dwell Time) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            세션 평균 체류시간
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            몰입도 지수 HIGH
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {avgDurationOverall}
          </span>
          <span className="text-sm font-medium text-slate-500">분 / 세션당</span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">최고 체류 프로그램:</span>
          <span className="font-semibold text-indigo-600">
            ArchiMap ({archiMapStats?.avgDurationMinutes ?? 0}분)
          </span>
        </div>

        <p className="mt-1 text-[11px] text-slate-500">
          LaserFish 대비 약 80% 긴 설계 집중 세션을 유지하고 있습니다.
        </p>
      </div>
    </div>
  );
};
