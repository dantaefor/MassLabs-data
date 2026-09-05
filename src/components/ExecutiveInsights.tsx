import React from 'react';
import { InsightItem } from '../types';
import { Lightbulb, ArrowUpRight, CheckCircle2, TrendingUp, Compass, Cpu } from 'lucide-react';

interface ExecutiveInsightsProps {
  insights: InsightItem[];
}

export const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({ insights }) => {
  const getCategoryIcon = (cat: InsightItem['category']) => {
    switch (cat) {
      case 'engagement':
        return <Cpu className="w-4 h-4 text-indigo-600" />;
      case 'growth':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'global':
        return <Compass className="w-4 h-4 text-blue-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
    }
  };

  const getBadgeStyle = (cat: InsightItem['category']) => {
    switch (cat) {
      case 'engagement':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'growth':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'global':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div id="executive-insights-panel" className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              데이터 기반 관리자 의사결정 핵심 인사이트
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            수집된 50개 사용자 데이터와 실시간 세션 지표를 분석하여 도출된 전략적 권장 조치입니다.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <span>AI 서비스 운영 최적화 가이드</span>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/60 hover:bg-slate-800/90 transition-all rounded-xl p-4 border border-slate-700/70 flex flex-col justify-between"
          >
            <div>
              {/* Category & Metric Header */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                    item.category
                  )}`}
                >
                  {getCategoryIcon(item.category)}
                  {item.category.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {item.metric}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            {/* Strategic Action Recommendation */}
            <div className="mt-2 pt-2.5 border-t border-slate-700/60 bg-slate-900/40 p-2.5 rounded-lg">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>추천 실행 액션:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                {item.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
