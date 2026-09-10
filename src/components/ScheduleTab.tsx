import { useState } from 'react';
import type { ScheduleItem, Child, ParentRole } from '../types';
import {
  Bell,
  BellOff,
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Car,
  Trash2,
} from 'lucide-react';


interface ScheduleTabProps {
  schedules: ScheduleItem[];
  childrenList: Child[];
  selectedChildId: string | 'all';
  onToggleAlert: (scheduleId: string) => void;
  onChangeAlertMinutes: (scheduleId: string, minutes: number) => void;
  onChangePickupRole: (scheduleId: string, role: ParentRole) => void;
  onToggleCompleteToday: (scheduleId: string) => void;
  onDeleteSchedule: (scheduleId: string) => void;
  onOpenAddModal: () => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  schedules,
  childrenList,
  selectedChildId,
  onToggleAlert,
  onChangeAlertMinutes,
  onChangePickupRole,
  onToggleCompleteToday,
  onDeleteSchedule,
  onOpenAddModal,
}) => {
  const [viewMode, setViewMode] = useState<'today' | 'weekly'>('today');
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(new Date().getDay());

  // 현재 요일 (0: 일, 1: 월, ..., 6: 토)
  const todayDay = new Date().getDay();
  const dayLabels = [
    { index: 1, label: '월' },
    { index: 2, label: '화' },
    { index: 3, label: '수' },
    { index: 4, label: '목' },
    { index: 5, label: '금' },
    { index: 6, label: '토' },
    { index: 0, label: '일' },
  ];

  // 자녀 필터링
  const filteredByChild = schedules.filter((s) => {
    if (selectedChildId === 'all') return true;
    return s.childId === selectedChildId;
  });

  // 오늘 스케줄 (오늘 요일에 해당하는 일정)
  const todaySchedules = filteredByChild
    .filter((s) => s.daysOfWeek.includes(todayDay))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // 주간 선택 요일 스케줄
  const weeklySchedules = filteredByChild
    .filter((s) => s.daysOfWeek.includes(selectedDayOfWeek))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const displayList = viewMode === 'today' ? todaySchedules : weeklySchedules;

  // 자녀 정보 헬퍼
  const getChild = (childId: string) => {
    return childrenList.find((c) => c.id === childId);
  };

  // 픽업 롤 배지 렌더러
  const renderPickupBadge = (role: ParentRole, scheduleId: string) => {
    const roles: { key: ParentRole; label: string; icon: string; activeClass: string }[] = [
      { key: 'mother', label: '엄마', icon: '👩', activeClass: 'bg-amber-100 text-amber-800 border-amber-300 ring-1 ring-amber-300' },
      { key: 'father', label: '아빠', icon: '👨', activeClass: 'bg-sky-100 text-sky-800 border-sky-300 ring-1 ring-sky-300' },
      { key: 'both', label: '공동', icon: '💜', activeClass: 'bg-purple-100 text-purple-800 border-purple-300 ring-1 ring-purple-300' },
    ];

    return (
      <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/60">
        {roles.map((r) => {
          const isCurrent = role === r.key;
          return (
            <button
              key={r.key}
              onClick={() => onChangePickupRole(scheduleId, r.key)}
              title={`${r.label} 픽업 담당으로 변경`}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isCurrent
                  ? `${r.activeClass} shadow-xs scale-102`
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/60'
              }`}
            >
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const completedCount = todaySchedules.filter((s) => s.isCompletedToday).length;
  const totalToday = todaySchedules.length;

  return (
    <div className="space-y-4 pb-6">
      {/* 뷰 모드 토글 및 추가 버튼 */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'today'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>오늘 라이딩</span>
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[10px]">
              {todaySchedules.length}
            </span>
          </button>

          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'weekly'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>주간 시간표</span>
          </button>
        </div>

        {/* New Schedule Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs shadow-teal-300 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>일정 등록</span>
        </button>
      </div>

      {/* 오늘 라이딩 진행상황 요약 카드 */}
      {viewMode === 'today' && (
        <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 border border-teal-100 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500 text-white shadow-xs">
                <Car className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-800">오늘의 라이딩 미션</h3>
                <p className="text-[11px] text-slate-500">
                  {totalToday === 0
                    ? '오늘 등록된 라이딩 스케줄이 없습니다.'
                    : `${totalToday}개 일정 중 ${completedCount}개 완료`}
                </p>
              </div>
            </div>
            {totalToday > 0 && (
              <span className="text-xs font-bold text-teal-700 bg-white px-2 py-1 rounded-full border border-teal-200">
                {Math.round((completedCount / totalToday) * 100)}%
              </span>
            )}
          </div>

          {totalToday > 0 && (
            <div className="w-full bg-teal-200/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalToday) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 주간 요일 선택 탭 */}
      {viewMode === 'weekly' && (
        <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-7 gap-1">
            {dayLabels.map((d) => {
              const isSelected = selectedDayOfWeek === d.index;
              const isToday = todayDay === d.index;
              const countOnDay = filteredByChild.filter((s) => s.daysOfWeek.includes(d.index)).length;

              return (
                <button
                  key={d.index}
                  onClick={() => setSelectedDayOfWeek(d.index)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-200'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-[11px] font-bold">
                    {d.label}
                    {isToday && <span className="inline-block ml-0.5 w-1 h-1 rounded-full bg-rose-500" />}
                  </span>
                  <span
                    className={`mt-1 text-[10px] px-1.5 rounded-full font-medium ${
                      isSelected
                        ? 'bg-teal-700/60 text-white'
                        : countOnDay > 0
                        ? 'bg-slate-100 text-slate-600 font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    {countOnDay}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 스케줄 카드 리스트 */}
      <div className="space-y-3">
        {displayList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">해당 요일에 예정된 학원 일정이 없어요</p>
            <p className="text-xs text-slate-400 mt-1">상단의 [+ 일정 등록] 버튼을 눌러 새 스케줄을 추가해 보세요!</p>
          </div>
        ) : (
          displayList.map((item) => {
            const child = getChild(item.childId);
            const isCompleted = item.isCompletedToday;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isCompleted
                    ? 'border-slate-200 bg-slate-50/70 opacity-80'
                    : 'border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-sm'
                }`}
              >
                {/* 카드 상단 헤더 */}
                <div className="p-3.5 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 자녀 태그 */}
                      {child && (
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            child.color === 'sky'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200/80'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                          }`}
                        >
                          <span>{child.avatar}</span>
                          <span>{child.name}</span>
                        </span>
                      )}

                      {/* 과목 태그 */}
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {item.subject}
                      </span>

                      {/* 방학 특강 태그 */}
                      {item.isSpecialVacation && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          <Sparkles className="w-3 h-3" />
                          <span>방학 특강</span>
                        </span>
                      )}
                    </div>

                    {/* 완료 체크 버튼 */}
                    <button
                      onClick={() => onToggleCompleteToday(item.id)}
                      title={isCompleted ? '완료 취소' : '오늘 라이딩 완료 체크'}
                      className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-600'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>완료</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-slate-400" />
                          <span>미완료</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 학원명 & 시간 정보 */}
                  <div className="mt-2">
                    <h4
                      className={`text-sm font-bold text-slate-800 ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {item.academyName}
                    </h4>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        <span>
                          {item.startTime} ~ {item.endTime}
                        </span>
                      </div>

                      {item.location && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[130px]">{item.location}</span>
                        </div>
                      )}
                    </div>

                    {item.notes && (
                      <p className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        📌 {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* 카드 하단 액션 바: 출발 알림 & 픽업 담당자 */}
                <div className="bg-slate-50/80 px-3.5 py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  {/* 알림 설정 */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleAlert(item.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        item.alertEnabled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                      title={item.alertEnabled ? '알림 끄기' : '알림 켜기'}
                    >
                      {item.alertEnabled ? (
                        <Bell className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <BellOff className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{item.alertEnabled ? '알림 ON' : '알림 OFF'}</span>
                    </button>

                    {item.alertEnabled && (
                      <select
                        value={item.alertMinutesBefore}
                        onChange={(e) => onChangeAlertMinutes(item.id, Number(e.target.value))}
                        className="text-[11px] font-medium bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
                      >
                        <option value={15}>15분 전</option>
                        <option value={30}>30분 전</option>
                        <option value={45}>45분 전</option>
                        <option value={60}>1시간 전</option>
                      </select>
                    )}
                  </div>

                  {/* 픽업 담당자 태그 원클릭 변경 */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-medium text-slate-400 mr-0.5">픽업:</span>
                    {renderPickupBadge(item.pickupRole, item.id)}

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => onDeleteSchedule(item.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-colors ml-1 cursor-pointer"
                      title="스케줄 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
