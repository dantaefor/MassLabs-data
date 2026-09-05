export type AIProgram = 'LaserFish' | 'ArchiMap' | 'NeuroScribe' | 'VisionSynth' | 'CodePulse';

export type UserStatus = 'online' | 'idle' | 'offline';

export type SubscriptionPlan = 'Free' | 'Pro' | 'Enterprise';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  coordinates: [number, number]; // [longitude, latitude]
  signupDate: string; // YYYY-MM-DD
  signupMonth: string; // YYYY-MM
  currentStatus: UserStatus;
  currentProgram: AIProgram;
  sessionDurationMinutes: number; // 오늘 또는 최근 세션 체류시간 (분)
  totalVisits: number;
  plan: SubscriptionPlan;
  lastActive: string; // 상대 시간 또는 시각
}

export interface CountryStat {
  code: string;
  name: string;
  flag: string;
  coordinates: [number, number];
  totalUsers: number;
  onlineUsers: number;
  avgDuration: number;
  topProgram: AIProgram;
}

export interface MonthlyStat {
  month: string; // e.g. "2025.10", "2026.04"
  monthLabel: string;
  cumulativeUsers: number;
  newSignups: number;
  growthRate: number; // percentage
}

export interface ProgramStat {
  name: AIProgram;
  displayName: string;
  description: string;
  color: string;
  iconBg: string;
  onlineCount: number;
  totalCount: number;
  avgDurationMinutes: number;
  percentage: number;
}

export interface DurationBucket {
  range: string;
  count: number;
  percentage: number;
  label: string;
}

export interface InsightItem {
  id: string;
  category: 'growth' | 'engagement' | 'retention' | 'global' | 'program';
  title: string;
  metric: string;
  description: string;
  recommendation: string;
  severity: 'positive' | 'neutral' | 'urgent';
}
