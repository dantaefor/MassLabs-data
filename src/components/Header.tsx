import React from 'react';
import { Sparkles, Radio, RefreshCw, Layers, ShieldCheck, Activity } from 'lucide-react';

interface HeaderProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetData: () => void;
  onlineCount: number;
  totalUsers: number;
}

export const Header: React.FC<HeaderProps> = ({
  isSimulating,
  onToggleSimulation,
  onResetData,
  onlineCount,
  totalUsers,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                AI 서비스 통합 관리자 대시보드
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                v2.6 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500">
              50개 유저 더미 데이터 기반 실시간 이용 현황, 국가 지도 시각화 및 체류시간 분석
            </p>
          </div>
        </div>

        {/* Right: Live Ticker & Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Live indicator chip */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-700">
              실시간 접속: <span className="text-emerald-600">{onlineCount}명</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">누적: {totalUsers}명</span>
          </div>

          {/* Live Simulation Toggle Button */}
          <button
            onClick={onToggleSimulation}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              isSimulating
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
            title="실시간 접속자 변동 시뮬레이션 켜기/끄기"
          >
            <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? '라이브 시뮬레이션 중' : '실시간 시뮬레이션'}</span>
          </button>

          {/* Data Reset Button */}
          <button
            onClick={onResetData}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            title="더미 데이터 초기화"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
