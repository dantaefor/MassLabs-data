import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_USERS, MONTHLY_STATS, STRATEGIC_INSIGHTS } from './data/dummyData';
import { UserRecord, AIProgram, MonthlyStat } from './types';
import { calculateAnalytics } from './utils/analytics';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { WorldMap } from './components/WorldMap';
import { GrowthChart } from './components/GrowthChart';
import { ToolUsageChart } from './components/ToolUsageChart';
import { DurationDistributionChart } from './components/DurationDistributionChart';
import { ExecutiveInsights } from './components/ExecutiveInsights';
import { UserTable } from './components/UserTable';

export default function App() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>(MONTHLY_STATS);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<AIProgram | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Compute analytics from current state
  const analytics = useMemo(() => {
    return calculateAnalytics(users, monthlyData);
  }, [users, monthlyData]);

  // Specific stats for LaserFish and ArchiMap
  const laserFishStats = useMemo(
    () => analytics.programStats.find((p) => p.name === 'LaserFish'),
    [analytics]
  );
  const archiMapStats = useMemo(
    () => analytics.programStats.find((p) => p.name === 'ArchiMap'),
    [analytics]
  );

  // Live simulation tick
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setUsers((prevUsers) => {
        // Pick a random user to update slightly
        const randomIndex = Math.floor(Math.random() * prevUsers.length);
        const target = prevUsers[randomIndex];

        // Randomly toggle online/idle or add 1 minute to duration if online
        const newUsers = [...prevUsers];
        const statusPool: ('online' | 'idle' | 'offline')[] = ['online', 'online', 'online', 'idle', 'offline'];
        const newStatus = statusPool[Math.floor(Math.random() * statusPool.length)];

        newUsers[randomIndex] = {
          ...target,
          currentStatus: newStatus,
          sessionDurationMinutes:
            newStatus === 'online'
              ? target.sessionDurationMinutes + 1
              : target.sessionDurationMinutes,
          lastActive: newStatus === 'online' ? '방금 전' : '1분 전',
        };

        return newUsers;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Reset to initial dummy data
  const handleResetData = useCallback(() => {
    setUsers(INITIAL_USERS);
    setSelectedCountry(null);
    setSelectedProgram(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased">
      {/* Header */}
      <Header
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating((prev) => !prev)}
        onResetData={handleResetData}
        onlineCount={analytics.onlineCount}
        totalUsers={analytics.totalUsers}
      />

      {/* Main Content Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top KPI Metrics Overview */}
        <MetricsOverview
          totalUsers={analytics.totalUsers}
          onlineCount={analytics.onlineCount}
          idleCount={analytics.idleCount}
          offlineCount={analytics.offlineCount}
          newSignupsThisMonth={analytics.newSignupsThisMonth}
          newSignupsMoM={analytics.newSignupsMoM}
          avgDurationOverall={analytics.avgDurationOverall}
          topProgram={analytics.topProgram}
          laserFishStats={laserFishStats}
          archiMapStats={archiMapStats}
        />

        {/* 1. Global User Map (이용자 국가 - 지도로 데이터화) */}
        <WorldMap
          countryStats={analytics.countryStats}
          selectedCountry={selectedCountry}
          onSelectCountry={(code) => setSelectedCountry(code)}
        />

        {/* 2. Core Trends: Monthly Growth & Real-time Tool Usage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 가입자 수 변화 (월단위) & 신규 가입자 (월단위) */}
          <GrowthChart monthlyData={monthlyData} />

          {/* 실시간 이용하는 프로그램 (LaserFish, ArchiMap 등) 및 체류시간 비교 */}
          <ToolUsageChart
            programStats={analytics.programStats}
            selectedProgram={selectedProgram}
            onSelectProgram={(prog) => setSelectedProgram(prog)}
          />
        </div>

        {/* 3. 체류시간 상세 분포 및 플랜별 몰입도 상관관계 */}
        <DurationDistributionChart
          durationBuckets={analytics.durationBuckets}
          users={users}
        />

        {/* 4. Strategic Executive Insights (어떤 그래프와 인사이트를 주는 대시보드인가?) */}
        <ExecutiveInsights insights={STRATEGIC_INSIGHTS} />

        {/* 5. 50개 가상 더미 데이터 상세 테이블 및 필터/내보내기 */}
        <UserTable
          users={users}
          selectedCountry={selectedCountry}
          selectedProgram={selectedProgram}
          onClearFilters={() => {
            setSelectedCountry(null);
            setSelectedProgram(null);
          }}
          onSelectCountry={(code) => setSelectedCountry(code)}
          onSelectProgram={(prog) => setSelectedProgram(prog)}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <span>AI Service Administrator Intelligence Suite</span>
          <span className="mx-2">•</span>
          <span>50 User Cohort Simulation Mode Active</span>
          <span className="mx-2">•</span>
          <span>Real-time Geo & Engagement Telemetry</span>
        </div>
      </footer>
    </div>
  );
}
