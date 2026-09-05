import React, { useState, useMemo } from 'react';
import { UserRecord, AIProgram, UserStatus, SubscriptionPlan } from '../types';
import { PROGRAM_CONFIG } from '../data/dummyData';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Radio,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface UserTableProps {
  users: UserRecord[];
  selectedCountry: string | null;
  selectedProgram: AIProgram | null;
  onClearFilters: () => void;
  onSelectCountry: (code: string | null) => void;
  onSelectProgram: (prog: AIProgram | null) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedCountry,
  selectedProgram,
  onClearFilters,
  onSelectCountry,
  onSelectProgram,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [planFilter, setPlanFilter] = useState<'all' | SubscriptionPlan>('all');
  const [sortField, setSortField] = useState<keyof UserRecord>('sessionDurationMinutes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter and Sort logic
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        // Search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchName = user.name.toLowerCase().includes(term);
          const matchEmail = user.email.toLowerCase().includes(term);
          const matchCountry = user.countryName.toLowerCase().includes(term);
          const matchProg = user.currentProgram.toLowerCase().includes(term);
          if (!matchName && !matchEmail && !matchCountry && !matchProg) return false;
        }

        // Country filter
        if (selectedCountry && user.countryCode !== selectedCountry) {
          return false;
        }

        // Program filter
        if (selectedProgram && user.currentProgram !== selectedProgram) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all' && user.currentStatus !== statusFilter) {
          return false;
        }

        // Plan filter
        if (planFilter !== 'all' && user.plan !== planFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          valA = (valA as string).toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, searchTerm, selectedCountry, selectedProgram, statusFilter, planFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Toggle sort
  const handleSort = (field: keyof UserRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'ID',
      '이름',
      '이메일',
      '국가코드',
      '국가명',
      '가입일자',
      '현재상태',
      '사용프로그램',
      '체류시간(분)',
      '누적방문수',
      '구독플랜',
    ];

    const rows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.countryCode,
      u.countryName,
      u.signupDate,
      u.currentStatus,
      u.currentProgram,
      u.sessionDurationMinutes,
      u.totalVisits,
      u.plan,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ai_service_users_50_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            온라인
          </span>
        );
      case 'idle':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            대기
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
            오프라인
          </span>
        );
    }
  };

  const getPlanBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'Enterprise':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Enterprise
          </span>
        );
      case 'Pro':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Pro
          </span>
        );
      case 'Free':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Free
          </span>
        );
    }
  };

  return (
    <div id="users-data-table-card" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              전체 50명 가상 더미 데이터 상세 내역
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
              {filteredUsers.length} / {users.length}명
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            국가, 실시간 상태, 프로그램(LaserFish/ArchiMap 등), 체류시간을 실시간으로 검색 및 필터링할 수 있습니다.
          </p>
        </div>

        {/* Actions: Export CSV */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV 내보내기</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 mb-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="이름, 이메일, 국가 또는 프로그램 검색..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer"
          >
            <option value="all">상태 전체</option>
            <option value="online">온라인 (Live)</option>
            <option value="idle">대기 중 (Idle)</option>
            <option value="offline">오프라인</option>
          </select>
        </div>

        {/* Program Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedProgram || 'all'}
            onChange={(e) => {
              onSelectProgram(e.target.value === 'all' ? null : (e.target.value as AIProgram));
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer"
          >
            <option value="all">프로그램 전체</option>
            <option value="ArchiMap">ArchiMap (아키텍처 설계)</option>
            <option value="LaserFish">LaserFish (실시간 Q&A)</option>
            <option value="VisionSynth">VisionSynth (이미지 생성)</option>
            <option value="CodePulse">CodePulse (코드 분석)</option>
            <option value="NeuroScribe">NeuroScribe (문서 작성)</option>
          </select>
        </div>

        {/* Plan Filter */}
        <div className="md:col-span-2">
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer"
          >
            <option value="all">플랜 전체</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Pro">Pro</option>
            <option value="Free">Free</option>
          </select>
        </div>

        {/* Reset */}
        <div className="md:col-span-1 flex items-center justify-end">
          {(searchTerm || selectedCountry || selectedProgram || statusFilter !== 'all' || planFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPlanFilter('all');
                onClearFilters();
                setCurrentPage(1);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {(selectedCountry || selectedProgram) && (
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="text-slate-500 text-[11px]">적용된 지도/도구 필터:</span>
          {selectedCountry && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              국가: {selectedCountry}
              <button
                onClick={() => onSelectCountry(null)}
                className="hover:text-blue-900 cursor-pointer ml-0.5"
              >
                ✕
              </button>
            </span>
          )}
          {selectedProgram && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
              도구: {selectedProgram}
              <button
                onClick={() => onSelectProgram(null)}
                className="hover:text-indigo-900 cursor-pointer ml-0.5"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-3">사용자</th>
              <th className="py-3 px-3">국가</th>
              <th
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 select-none"
                onClick={() => handleSort('currentStatus')}
              >
                <div className="flex items-center gap-1">
                  <span>실시간 상태</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 select-none"
                onClick={() => handleSort('currentProgram')}
              >
                <div className="flex items-center gap-1">
                  <span>사용 프로그램</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 select-none"
                onClick={() => handleSort('sessionDurationMinutes')}
              >
                <div className="flex items-center gap-1 text-purple-700">
                  <span>체류시간</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 select-none"
                onClick={() => handleSort('signupDate')}
              >
                <div className="flex items-center gap-1">
                  <span>가입일</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">플랜</th>
              <th className="py-3 px-3">최근 활동</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  조건에 일치하는 사용자가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => {
                const progCfg = PROGRAM_CONFIG[user.currentProgram];

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{user.countryFlag}</span>
                        <span className="font-medium text-slate-800">{user.countryName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getStatusBadge(user.currentStatus)}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${progCfg.color}15`,
                          color: progCfg.color,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: progCfg.color }}
                        />
                        {user.currentProgram}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">
                          {user.sessionDurationMinutes}분
                        </span>
                        {user.sessionDurationMinutes >= 80 && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold">
                            헤비
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-slate-600 font-mono">
                      {user.signupDate}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{getPlanBadge(user.plan)}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-slate-500">
                      {user.lastActive}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          전체 {filteredUsers.length}명 중 {(currentPage - 1) * pageSize + 1} -{' '}
          {Math.min(currentPage * pageSize, filteredUsers.length)}명 표시
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-medium text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
