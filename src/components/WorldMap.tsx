import React, { useState } from 'react';
import { geoEquirectangular } from 'd3-geo';
import { CountryStat, AIProgram } from '../types';
import { PROGRAM_CONFIG } from '../data/dummyData';
import { Globe, Users, Clock, Compass, Activity, Check } from 'lucide-react';

interface WorldMapProps {
  countryStats: CountryStat[];
  selectedCountry: string | null;
  onSelectCountry: (code: string | null) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  countryStats,
  selectedCountry,
  onSelectCountry,
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<CountryStat | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const width = 880;
  const height = 440;

  // Equirectangular projection
  const projection = geoEquirectangular()
    .scale(135)
    .translate([width / 2, height / 2 + 10]);

  // Major continent stylized backdrop paths (simplified high-contrast geo polygons for clean visual background)
  const continentPolygons = [
    // North America
    "M 140,80 L 260,80 L 290,130 L 250,190 L 190,230 L 170,210 L 140,150 Z",
    // South America
    "M 240,240 L 290,260 L 310,320 L 280,390 L 240,340 L 230,270 Z",
    // Europe
    "M 430,70 L 510,70 L 520,130 L 460,140 L 420,110 Z",
    // Africa
    "M 430,150 L 510,160 L 530,250 L 490,340 L 450,290 L 420,200 Z",
    // Asia
    "M 520,70 L 750,80 L 780,180 L 690,230 L 570,180 L 520,130 Z",
    // Australia
    "M 680,280 L 770,280 L 780,350 L 700,360 L 670,310 Z",
  ];

  return (
    <div id="world-map-container" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 transition-all">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              글로벌 이용자 국가별 인터랙티브 맵
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
              실시간 접속 분포
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            국가별 총 이용자 수, 실시간 활성 접속자 및 주요 사용 AI 프로그램을 지도로 파악할 수 있습니다.
          </p>
        </div>

        {/* Action / Reset */}
        <div className="flex items-center gap-2">
          {selectedCountry && (
            <button
              onClick={() => onSelectCountry(null)}
              className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>필터 초기화</span>
              <span className="font-bold">✕</span>
            </button>
          )}
          <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            총 {countryStats.length}개국 접속 중
          </div>
        </div>
      </div>

      {/* Main Map & Country Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG World Map (8 cols on lg) */}
        <div className="lg:col-span-8 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl p-3 sm:p-4 border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between">
          {/* Subtle Grid Lat/Long background lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Compass watermark */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono tracking-wider pointer-events-none">
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>GEO-RADAR // LIVE DISTRIBUTION</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[2/1] min-h-[260px] flex items-center justify-center">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
              onMouseLeave={() => {
                setHoveredCountry(null);
                setTooltipPos(null);
              }}
            >
              <defs>
                {/* Glow filter */}
                <filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="ocean-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
                </radialGradient>
              </defs>

              {/* Ocean base */}
              <rect x="0" y="0" width={width} height={height} fill="url(#ocean-glow)" rx="10" />

              {/* Latitude & Longitude Grids */}
              <g stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.35">
                {/* Equator & parallels */}
                <line x1="20" y1={height / 2 + 10} x2={width - 20} y2={height / 2 + 10} stroke="#64748b" strokeWidth="0.8" />
                <line x1="20" y1="120" x2={width - 20} y2="120" />
                <line x1="20" y1="330" x2={width - 20} y2="330" />
                {/* Meridians */}
                <line x1={width / 2} y1="30" x2={width / 2} y2={height - 30} stroke="#64748b" strokeWidth="0.8" />
                <line x1="220" y1="30" x2="220" y2={height - 30} />
                <line x1="660" y1="30" x2="660" y2={height - 30} />
              </g>

              {/* Stylized world land masses */}
              <g fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.55">
                {continentPolygons.map((poly, idx) => (
                  <path key={idx} d={poly} />
                ))}
              </g>

              {/* Country Nodes with Projection */}
              {countryStats.map((country) => {
                const coords = projection(country.coordinates);
                if (!coords) return null;
                const [cx, cy] = coords;

                const isSelected = selectedCountry === country.code;
                const isHovered = hoveredCountry?.code === country.code;
                const radius = Math.max(7, Math.min(22, 6 + country.totalUsers * 1.1));
                const progColor = PROGRAM_CONFIG[country.topProgram]?.color || '#3b82f6';

                return (
                  <g
                    key={country.code}
                    className="cursor-pointer transition-transform duration-200"
                    transform={`translate(${cx}, ${cy})`}
                    onClick={() => {
                      onSelectCountry(isSelected ? null : country.code);
                    }}
                    onMouseEnter={(e) => {
                      setHoveredCountry(country);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
                    }}
                  >
                    {/* Pulsing ripple wave for online users */}
                    {country.onlineUsers > 0 && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke={progColor}
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping origin-center"
                        style={{ animationDuration: '2.5s' }}
                      />
                    )}

                    {/* Outer Ring */}
                    <circle
                      r={radius + 3}
                      fill={isSelected ? '#ffffff' : progColor}
                      fillOpacity={isSelected ? 0.3 : 0.15}
                      stroke={isSelected ? '#ffffff' : progColor}
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {/* Main Node Bubble */}
                    <circle
                      r={radius}
                      fill={progColor}
                      fillOpacity={isSelected || isHovered ? 0.95 : 0.75}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2 : 1}
                      filter="url(#radar-glow)"
                    />

                    {/* Country Code & User count text */}
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill="#ffffff"
                      fontSize={radius > 12 ? '11' : '9'}
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {country.totalUsers}
                    </text>

                    {/* Country label under node */}
                    <text
                      textAnchor="middle"
                      dy={radius + 14}
                      fill={isSelected ? '#60a5fa' : '#94a3b8'}
                      fontSize="10"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none drop-shadow"
                    >
                      {country.flag} {country.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Tooltip when hovering over a country */}
            {hoveredCountry && (
              <div className="absolute top-4 right-4 z-20 bg-slate-900/95 backdrop-blur border border-slate-700 text-white rounded-xl p-3 shadow-2xl w-60 text-xs pointer-events-none transition-all">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <span className="text-base">{hoveredCountry.flag}</span>
                    <span>{hoveredCountry.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({hoveredCountry.code})</span>
                  </div>
                  {hoveredCountry.onlineUsers > 0 ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {hoveredCountry.onlineUsers}명 라이브
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">오프라인</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>전체 가입자:</span>
                    <span className="font-semibold text-white">{hoveredCountry.totalUsers}명</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>평균 체류시간:</span>
                    <span className="font-semibold text-white">{hoveredCountry.avgDuration}분</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>최다 사용 프로그램:</span>
                    <span
                      className="font-medium px-1.5 py-0.5 rounded text-[11px]"
                      style={{
                        backgroundColor: `${PROGRAM_CONFIG[hoveredCountry.topProgram]?.color}22`,
                        color: PROGRAM_CONFIG[hoveredCountry.topProgram]?.color,
                      }}
                    >
                      {hoveredCountry.topProgram}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center">
                  클릭 시 하단 사용자 목록 필터링
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-medium">프로그램 색상:</span>
              {(['LaserFish', 'ArchiMap', 'VisionSynth', 'CodePulse', 'NeuroScribe'] as AIProgram[]).map(
                (prog) => (
                  <div key={prog} className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: PROGRAM_CONFIG[prog].color }}
                    />
                    <span className="text-slate-300 text-[10px]">{prog}</span>
                  </div>
                )
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>외곽 펄스 파동 = 실시간 이용자 활동 중</span>
            </div>
          </div>
        </div>

        {/* Country Rankings & Stats (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                국가별 사용자 점유율 TOP 7
              </h3>
              <span className="text-[11px] text-slate-500">실시간 / 총합</span>
            </div>

            <div className="space-y-2.5">
              {countryStats.slice(0, 7).map((c, idx) => {
                const isSelected = selectedCountry === c.code;
                const percentage = Math.round((c.totalUsers / 50) * 100);

                return (
                  <button
                    key={c.code}
                    onClick={() => onSelectCountry(isSelected ? null : c.code)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                        : 'bg-white hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-4 text-center font-bold text-slate-400 text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="text-sm">{c.flag}</span>
                        <span className="font-medium text-slate-800">{c.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 ml-1" />}
                      </div>
                      <div className="flex items-center gap-2">
                        {c.onlineUsers > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-emerald-100 text-emerald-700">
                            {c.onlineUsers}명 라이브
                          </span>
                        )}
                        <span className="font-semibold text-slate-900">{c.totalUsers}명</span>
                        <span className="text-slate-400 text-[10px]">({percentage}%)</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage * 2}%`,
                          backgroundColor: PROGRAM_CONFIG[c.topProgram]?.color || '#3b82f6',
                        }}
                      />
                    </div>

                    {/* Sub info */}
                    <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-500">
                      <span>평균 체류: {c.avgDuration}분</span>
                      <span className="text-slate-600 font-medium">인기: {c.topProgram}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              국가 클릭 시 해당 국가 데이터로 필터링
            </span>
            {selectedCountry && (
              <button
                onClick={() => onSelectCountry(null)}
                className="text-blue-600 hover:underline font-medium text-xs cursor-pointer"
              >
                전체 보기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
