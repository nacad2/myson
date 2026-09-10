import { useState, type FormEvent } from 'react';
import type { Child, ParentRole, ScheduleItem } from '../types';
import { X, MapPin, Sparkles, Bell } from 'lucide-react';


interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenList: Child[];
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id' | 'isCompletedToday'>) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  childrenList,
  onAddSchedule,
}) => {
  const [childId, setChildId] = useState(childrenList[0]?.id || '');
  const [subject, setSubject] = useState('수학');
  const [academyName, setAcademyName] = useState('');
  const [location, setLocation] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 3]); // 월, 수 기본
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:30');
  const [isSpecialVacation, setIsSpecialVacation] = useState(false);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertMinutesBefore, setAlertMinutesBefore] = useState(30);
  const [pickupRole, setPickupRole] = useState<ParentRole>('mother');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const daysList = [
    { index: 1, label: '월' },
    { index: 2, label: '화' },
    { index: 3, label: '수' },
    { index: 4, label: '목' },
    { index: 5, label: '금' },
    { index: 6, label: '토' },
    { index: 0, label: '일' },
  ];

  const toggleDay = (dayIndex: number) => {
    if (daysOfWeek.includes(dayIndex)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== dayIndex));
    } else {
      setDaysOfWeek([...daysOfWeek, dayIndex].sort());
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!academyName.trim()) {
      alert('학원명을 입력해 주세요.');
      return;
    }
    if (daysOfWeek.length === 0) {
      alert('수업 요일을 최소 하루 이상 선택해 주세요.');
      return;
    }

    onAddSchedule({
      childId,
      subject,
      academyName: academyName.trim(),
      location: location.trim() || undefined,
      daysOfWeek,
      startTime,
      endTime,
      isSpecialVacation,
      alertEnabled,
      alertMinutesBefore,
      pickupRole,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">새 학원 일정 등록</h3>
            <p className="text-xs text-slate-400">라이딩 일정 및 알림 시간을 설정하세요</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* 자녀 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">자녀 선택</label>
            <div className="grid grid-cols-2 gap-2">
              {childrenList.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setChildId(c.id)}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    childId === c.id
                      ? c.color === 'sky'
                        ? 'bg-sky-50 text-sky-800 border-sky-300 ring-2 ring-sky-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <span className="text-base">{c.avatar}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 과목 및 특강 여부 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">과목</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="예: 영어, 수학, 피아노"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">수업 유형</label>
              <button
                type="button"
                onClick={() => setIsSpecialVacation(!isSpecialVacation)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isSpecialVacation
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSpecialVacation ? '방학특강/단기' : '정규 학기'}</span>
              </button>
            </div>
          </div>

          {/* 학원명 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">학원명</label>
            <input
              type="text"
              value={academyName}
              onChange={(e) => setAcademyName(e.target.value)}
              placeholder="예: 정상어학원 드림센터"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
              required
            />
          </div>

          {/* 장소 / 강의실 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">위치 및 강의실 (선택)</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 현대상가 3층 301호"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>
          </div>

          {/* 반복 요일 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">반복 요일</label>
            <div className="grid grid-cols-7 gap-1">
              {daysList.map((d) => {
                const active = daysOfWeek.includes(d.index);
                return (
                  <button
                    type="button"
                    key={d.index}
                    onClick={() => toggleDay(d.index)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 시작 시간 / 종료 시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">시작 시간</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">종료 시간</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                required
              />
            </div>
          </div>

          {/* 출발 준비 알림 설정 */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Bell className="w-3.5 h-3.5 text-teal-600" />
                <span>출발 준비 라이딩 알림</span>
              </div>
              <input
                type="checkbox"
                checked={alertEnabled}
                onChange={(e) => setAlertEnabled(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-400"
              />
            </div>
            {alertEnabled && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500">알림 시점:</span>
                <div className="grid grid-cols-4 gap-1 flex-1">
                  {[15, 30, 45, 60].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setAlertMinutesBefore(m)}
                      className={`py-1 text-[11px] rounded-lg font-bold border transition-all cursor-pointer ${
                        alertMinutesBefore === m
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {m === 60 ? '1시간전' : `${m}분전`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 픽업 담당자 초기 설정 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">기본 픽업 담당자</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'mother' as ParentRole, label: '엄마 👩', color: 'hover:border-amber-400' },
                { role: 'father' as ParentRole, label: '아빠 👨', color: 'hover:border-sky-400' },
                { role: 'both' as ParentRole, label: '공동 💜', color: 'hover:border-purple-400' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.role}
                  onClick={() => setPickupRole(r.role)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    pickupRole === r.role
                      ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                      : `bg-slate-50 text-slate-600 border-slate-200 ${r.color}`
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* 메모/준비물 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">준비물 및 비고 (선택)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 수영복 및 수모 챙기기"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md shadow-teal-200 transition-all text-xs cursor-pointer"
            >
              일정 등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
