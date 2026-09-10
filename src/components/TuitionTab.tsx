import { useState } from 'react';
import type { TuitionItem, Child, TuitionStatus } from '../types';
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PieChart,
  TrendingDown,
  Trash2,
} from 'lucide-react';


interface TuitionTabProps {
  tuitions: TuitionItem[];
  childrenList: Child[];
  selectedChildId: string | 'all';
  onChangeTuitionStatus: (id: string, status: TuitionStatus) => void;
  onDeleteTuition: (id: string) => void;
  onOpenAddModal: () => void;
}

export const TuitionTab: React.FC<TuitionTabProps> = ({
  tuitions,
  childrenList,
  selectedChildId,
  onChangeTuitionStatus,
  onDeleteTuition,
  onOpenAddModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | TuitionStatus>('all');

  // 오늘 일자 (D-day 계산용)
  const todayDate = new Date().getDate(); // 1 ~ 31

  // 자녀 필터링
  const filteredByChild = tuitions.filter((t) => {
    if (selectedChildId === 'all') return true;
    return t.childId === selectedChildId;
  });

  // 상태 필터링
  const displayTuitions = filteredByChild.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  // 통계 계산
  const totalAmount = filteredByChild.reduce((sum, item) => sum + item.amount, 0);
  const completedAmount = filteredByChild
    .filter((item) => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = filteredByChild
    .filter((item) => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);
  const discountedSavings = filteredByChild
    .filter((item) => item.status === 'discounted')
    .reduce((sum, item) => sum + (item.discountAmount || 0), 0);

  // D-day 헬퍼
  const getDDayInfo = (dueDay: number) => {
    const diff = dueDay - todayDate;
    if (diff === 0) return { text: '오늘 결제일!', isUrgent: true, badgeClass: 'bg-rose-500 text-white animate-pulse' };
    if (diff > 0 && diff <= 3) return { text: `D-${diff} 결제 임박`, isUrgent: true, badgeClass: 'bg-amber-500 text-white' };
    if (diff > 3) return { text: `D-${diff}`, isUrgent: false, badgeClass: 'bg-slate-100 text-slate-600' };
    return { text: `매월 ${dueDay}일`, isUrgent: false, badgeClass: 'bg-slate-100 text-slate-500' };
  };

  // 임박한 결제 목록 (D-3 이내 또는 오늘 결제 대기 중인 항목)
  const urgentItems = filteredByChild.filter((item) => {
    if (item.status !== 'pending') return false;
    const diff = item.dueDay - todayDate;
    return diff >= 0 && diff <= 3;
  });

  // 자녀별 통계 계산
  const childStats = childrenList.map((c) => {
    const sum = tuitions
      .filter((t) => t.childId === c.id)
      .reduce((acc, cur) => acc + cur.amount, 0);
    const overall = tuitions.reduce((acc, cur) => acc + cur.amount, 0);
    const percent = overall > 0 ? Math.round((sum / overall) * 100) : 0;
    return { child: c, sum, percent };
  });

  // 과목 카테고리별 통계 계산
  const categories: TuitionItem['category'][] = ['교과', '어학', '예체능', '특강/코딩'];
  const categoryColors: Record<string, string> = {
    교과: 'bg-blue-500',
    어학: 'bg-teal-500',
    예체능: 'bg-amber-500',
    '특강/코딩': 'bg-purple-500',
    기타: 'bg-slate-400',
  };

  const categoryStats = categories.map((cat) => {
    const sum = filteredByChild
      .filter((t) => t.category === cat)
      .reduce((acc, cur) => acc + cur.amount, 0);
    const percent = totalAmount > 0 ? Math.round((sum / totalAmount) * 100) : 0;
    return { category: cat, sum, percent, color: categoryColors[cat] };
  }).filter(c => c.sum > 0);

  const getChild = (childId: string) => childrenList.find((c) => c.id === childId);

  return (
    <div className="space-y-4 pb-6">
      {/* 상단 액션 및 요약 카드 */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-bold text-slate-800">이번 달 학원비 현황</h2>
          <p className="text-[11px] text-slate-400">자녀별 수업료 및 결제 D-Day 알림</p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs shadow-teal-300 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>학원비 등록</span>
        </button>
      </div>

      {/* 임박 알림 배너 */}
      {urgentItems.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-xs">
              <AlertTriangle className="w-4 h-4 text-white" />
            </span>
            <div>
              <h4 className="text-xs font-bold">결제 마감 임박 알림 ({urgentItems.length}건)</h4>
              <p className="text-[11px] text-rose-100">
                {urgentItems.map((u) => `${u.academyName}(${u.amount.toLocaleString()}원)`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 종합 금액 요약 메인 카드 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-medium text-slate-500">이번 달 총 학원비 합계</span>
            <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {totalAmount.toLocaleString()}
              <span className="text-sm font-normal text-slate-500 ml-1">원</span>
            </div>
          </div>
          {discountedSavings > 0 && (
            <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl border border-emerald-200 text-right">
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <TrendingDown className="w-3 h-3" />
                <span>할인 절감액</span>
              </div>
              <span className="text-xs font-black">-{discountedSavings.toLocaleString()}원</span>
            </div>
          )}
        </div>

        {/* 2단 상태별 분할 카드 */}
        <div className="grid grid-cols-2 gap-2.5 pt-3">
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 mb-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>결제 완료</span>
            </div>
            <div className="text-sm font-black text-emerald-700">
              {completedAmount.toLocaleString()}원
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5">
              {totalAmount > 0 ? Math.round((completedAmount / totalAmount) * 100) : 0}% 결제됨
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 mb-0.5">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>결제 대기</span>
            </div>
            <div className="text-sm font-black text-amber-700">
              {pendingAmount.toLocaleString()}원
            </div>
            <div className="text-[10px] text-amber-600 mt-0.5">
              {filteredByChild.filter((t) => t.status === 'pending').length}건 남음
            </div>
          </div>
        </div>
      </div>

      {/* 지출 비중 시각화 통계 컴포넌트 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-800">지출 비중 분석</h3>
          </div>
          <span className="text-[11px] text-slate-400">카테고리 & 자녀별 비중</span>
        </div>

        {/* 과목 카테고리별 누적 컬러 바 차트 */}
        {categoryStats.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
              <span>과목 분야별 비중</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              {categoryStats.map((cat, idx) => (
                <div
                  key={idx}
                  className={`${cat.color} transition-all duration-500`}
                  style={{ width: `${cat.percent}%` }}
                  title={`${cat.category}: ${cat.sum.toLocaleString()}원 (${cat.percent}%)`}
                />
              ))}
            </div>

            {/* 범례 표시 */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <span className="text-slate-600 font-medium">{cat.category}</span>
                  <span className="text-slate-800 font-bold">{cat.percent}%</span>
                  <span className="text-slate-400 text-[10px]">({(cat.sum / 10000).toFixed(0)}만)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 자녀별 비중 분할 바 */}
        {selectedChildId === 'all' && childrenList.length > 1 && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span>자녀별 지출 비율</span>
            </div>
            <div className="space-y-1.5">
              {childStats.map((item) => (
                <div key={item.child.id}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <span>{item.child.avatar}</span>
                      <span>{item.child.name}</span>
                    </span>
                    <span className="font-bold text-slate-800">
                      {item.sum.toLocaleString()}원 ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        item.child.color === 'sky' ? 'bg-sky-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 상태별 필터 칩 */}
      <div className="flex items-center gap-1.5 px-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          전체 ({filteredByChild.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          결제 대기 ({filteredByChild.filter((t) => t.status === 'pending').length})
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          결제 완료 ({filteredByChild.filter((t) => t.status === 'completed').length})
        </button>
        <button
          onClick={() => setStatusFilter('discounted')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'discounted'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          할인/특강 ({filteredByChild.filter((t) => t.status === 'discounted').length})
        </button>
      </div>

      {/* 학원비 세부 카드 목록 */}
      <div className="space-y-2.5">
        {displayTuitions.map((item) => {
          const child = getChild(item.childId);
          const dday = getDDayInfo(item.dueDay);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-teal-300 shadow-xs transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {child && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          child.color === 'sky'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {child.avatar} {child.name}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dday.badgeClass}`}>
                      {dday.text}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800">{item.academyName}</h4>
                </div>

                {/* 금액 표시 */}
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">
                    {item.amount.toLocaleString()}원
                  </div>
                  {item.discountAmount && (
                    <div className="text-[10px] font-medium text-emerald-600">
                      -{item.discountAmount.toLocaleString()}원 절감
                    </div>
                  )}
                </div>
              </div>

              {/* 하단: 결제 수단 및 원클릭 상태 변경 토글 */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] text-slate-400">
                  <span>{item.paymentMethod || '수납'}</span>
                  {item.memo && <span className="ml-1 text-slate-500">· {item.memo}</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* 상태 토글 버튼 그룹 */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => onChangeTuitionStatus(item.id, 'pending')}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        item.status === 'pending'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="결제 대기로 변경"
                    >
                      대기
                    </button>
                    <button
                      onClick={() => onChangeTuitionStatus(item.id, 'completed')}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        item.status === 'completed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="결제 완료로 변경"
                    >
                      완료
                    </button>
                    <button
                      onClick={() => onChangeTuitionStatus(item.id, 'discounted')}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        item.status === 'discounted'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="할인/바우처 적용으로 변경"
                    >
                      할인
                    </button>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => onDeleteTuition(item.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                    title="학원비 내역 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
