import { UserRecord, CountryStat, ProgramStat, DurationBucket, AIProgram, MonthlyStat } from '../types';
import { PROGRAM_CONFIG } from '../data/dummyData';

export function calculateAnalytics(users: UserRecord[], monthlyData: MonthlyStat[]) {
  const totalUsers = users.length;
  const onlineUsers = users.filter((u) => u.currentStatus === 'online');
  const idleUsers = users.filter((u) => u.currentStatus === 'idle');
  const offlineUsers = users.filter((u) => u.currentStatus === 'offline');

  const onlineCount = onlineUsers.length;
  const idleCount = idleUsers.length;
  const offlineCount = offlineUsers.length;

  // Average session duration
  const totalDuration = users.reduce((acc, u) => acc + u.sessionDurationMinutes, 0);
  const avgDurationOverall = totalUsers > 0 ? Math.round((totalDuration / totalUsers) * 10) / 10 : 0;

  // Active users average duration
  const activeDuration = onlineUsers.reduce((acc, u) => acc + u.sessionDurationMinutes, 0);
  const avgDurationActive = onlineCount > 0 ? Math.round((activeDuration / onlineCount) * 10) / 10 : 0;

  // Monthly stats
  const currentMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const newSignupsThisMonth = currentMonth?.newSignups ?? 0;
  const newSignupsMoM = prevMonth
    ? Math.round(((newSignupsThisMonth - prevMonth.newSignups) / prevMonth.newSignups) * 100)
    : 0;

  // Country aggregations
  const countryMap = new Map<string, CountryStat>();
  users.forEach((u) => {
    const existing = countryMap.get(u.countryCode);
    if (!existing) {
      countryMap.set(u.countryCode, {
        code: u.countryCode,
        name: u.countryName,
        flag: u.countryFlag,
        coordinates: u.coordinates,
        totalUsers: 1,
        onlineUsers: u.currentStatus === 'online' ? 1 : 0,
        avgDuration: u.sessionDurationMinutes,
        topProgram: u.currentProgram,
      });
    } else {
      existing.totalUsers += 1;
      if (u.currentStatus === 'online') {
        existing.onlineUsers += 1;
      }
      existing.avgDuration = Math.round(
        (existing.avgDuration * (existing.totalUsers - 1) + u.sessionDurationMinutes) / existing.totalUsers
      );
    }
  });

  const countryStats = Array.from(countryMap.values()).sort((a, b) => b.totalUsers - a.totalUsers);

  // Program aggregations
  const programMap = new Map<AIProgram, { online: number; total: number; durationSum: number }>();
  const programs: AIProgram[] = ['LaserFish', 'ArchiMap', 'NeuroScribe', 'VisionSynth', 'CodePulse'];
  
  programs.forEach((p) => {
    programMap.set(p, { online: 0, total: 0, durationSum: 0 });
  });

  users.forEach((u) => {
    const p = programMap.get(u.currentProgram);
    if (p) {
      p.total += 1;
      p.durationSum += u.sessionDurationMinutes;
      if (u.currentStatus === 'online') {
        p.online += 1;
      }
    }
  });

  const programStats: ProgramStat[] = programs.map((prog) => {
    const data = programMap.get(prog) || { online: 0, total: 0, durationSum: 0 };
    const avg = data.total > 0 ? Math.round((data.durationSum / data.total) * 10) / 10 : 0;
    const cfg = PROGRAM_CONFIG[prog];

    return {
      name: prog,
      displayName: prog,
      description: cfg.description,
      color: cfg.color,
      iconBg: cfg.iconBg,
      onlineCount: data.online,
      totalCount: data.total,
      avgDurationMinutes: avg,
      percentage: totalUsers > 0 ? Math.round((data.total / totalUsers) * 100) : 0,
    };
  }).sort((a, b) => b.totalCount - a.totalCount);

  // Top program
  const topProgram = programStats[0];

  // Duration Buckets
  const buckets: { [key: string]: number } = {
    '0~30분': 0,
    '31~60분': 0,
    '61~90분': 0,
    '91분 이상': 0,
  };

  users.forEach((u) => {
    const d = u.sessionDurationMinutes;
    if (d <= 30) buckets['0~30분']++;
    else if (d <= 60) buckets['31~60분']++;
    else if (d <= 90) buckets['61~90분']++;
    else buckets['91분 이상']++;
  });

  const durationBuckets: DurationBucket[] = [
    { range: '0~30분', count: buckets['0~30분'], percentage: Math.round((buckets['0~30분'] / totalUsers) * 100), label: '가벼운 쿼리/검색' },
    { range: '31~60분', count: buckets['31~60분'], percentage: Math.round((buckets['31~60분'] / totalUsers) * 100), label: '일반 업무 활용' },
    { range: '61~90분', count: buckets['61~90분'], percentage: Math.round((buckets['61~90분'] / totalUsers) * 100), label: '심층 분석 & 설계' },
    { range: '91분 이상', count: buckets['91분 이상'], percentage: Math.round((buckets['91분 이상'] / totalUsers) * 100), label: '헤비 파워 워크플로우' },
  ];

  // Subscription plan counts
  const plans = {
    Free: users.filter((u) => u.plan === 'Free').length,
    Pro: users.filter((u) => u.plan === 'Pro').length,
    Enterprise: users.filter((u) => u.plan === 'Enterprise').length,
  };

  return {
    totalUsers,
    onlineCount,
    idleCount,
    offlineCount,
    avgDurationOverall,
    avgDurationActive,
    newSignupsThisMonth,
    newSignupsMoM,
    countryStats,
    programStats,
    topProgram,
    durationBuckets,
    plans,
  };
}
