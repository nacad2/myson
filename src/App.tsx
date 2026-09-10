import { useState, useEffect } from 'react';
import type { Child, ScheduleItem, TuitionItem, FamilyNote, ParentRole, TuitionStatus } from './types';
import {
  INITIAL_CHILDREN,
  INITIAL_SCHEDULES,
  INITIAL_TUITIONS,
  INITIAL_FAMILY_NOTES,
} from './data/mockData';
import { Header } from './components/Header';
import { Navigation, type TabType } from './components/Navigation';

import { ScheduleTab } from './components/ScheduleTab';
import { FamilySyncTab } from './components/FamilySyncTab';
import { TuitionTab } from './components/TuitionTab';
import { ScheduleModal } from './components/ScheduleModal';
import { TuitionModal } from './components/TuitionModal';
import { Smartphone, Monitor } from 'lucide-react';

const STORAGE_KEYS = {
  CHILDREN: 'kidsride_children_v1',
  SCHEDULES: 'kidsride_schedules_v1',
  TUITIONS: 'kidsride_tuitions_v1',
  NOTES: 'kidsride_family_notes_v1',
};

export function App() {
  // Local Storage 기반 State 초기화
  const [childrenList, setChildrenList] = useState<Child[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHILDREN);
    return saved ? JSON.parse(saved) : INITIAL_CHILDREN;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [tuitions, setTuitions] = useState<TuitionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TUITIONS);
    return saved ? JSON.parse(saved) : INITIAL_TUITIONS;
  });

  const [familyNotes, setFamilyNotes] = useState<FamilyNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_NOTES;
  });

  // UI 상태
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [selectedChildId, setSelectedChildId] = useState<string | 'all'>('all');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isTuitionModalOpen, setIsTuitionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // LocalStorage 저장 동기화
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(childrenList));
  }, [childrenList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TUITIONS, JSON.stringify(tuitions));
  }, [tuitions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(familyNotes));
  }, [familyNotes]);

  // 토스트 알림 헬퍼
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Mock Data 리셋 함수
  const handleResetData = () => {
    if (confirm('초기 Mock Data(자녀 2명, 실감나는 학원 일정 및 학원비 내역)로 되돌릴까요?')) {
      setChildrenList(INITIAL_CHILDREN);
      setSchedules(INITIAL_SCHEDULES);
      setTuitions(INITIAL_TUITIONS);
      setFamilyNotes(INITIAL_FAMILY_NOTES);
      localStorage.clear();
      showToast('초기 데이터로 깔끔하게 복원되었습니다.');
    }
  };

  // 일정 핸들러
  const handleToggleAlert = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === scheduleId) {
          const next = !s.alertEnabled;
          showToast(next ? `🔔 라이딩 알림이 활성화되었습니다.` : `🔕 알림이 꺼졌습니다.`);
          return { ...s, alertEnabled: next };
        }
        return s;
      })
    );
  };

  const handleChangeAlertMinutes = (scheduleId: string, minutes: number) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === scheduleId) {
          showToast(`⏱️ 출발 ${minutes === 60 ? '1시간' : `${minutes}분`} 전 알림으로 변경되었습니다.`);
          return { ...s, alertMinutesBefore: minutes };
        }
        return s;
      })
    );
  };

  const handleChangePickupRole = (scheduleId: string, role: ParentRole) => {
    const roleLabels: Record<ParentRole, string> = {
      mother: '엄마 👩',
      father: '아빠 👨',
      both: '공동 💜',
    };
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === scheduleId) {
          showToast(`🚗 픽업 담당자가 '${roleLabels[role]}'(으)로 변경되었습니다.`);
          return { ...s, pickupRole: role };
        }
        return s;
      })
    );
  };

  const handleToggleCompleteToday = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === scheduleId) {
          const next = !s.isCompletedToday;
          showToast(next ? `🎉 라이딩/출석 완료 체크!` : `라이딩 미완료 상태로 변경`);
          return { ...s, isCompletedToday: next };
        }
        return s;
      })
    );
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('이 학원 일정을 삭제하시겠습니까?')) {
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      showToast('학원 일정이 삭제되었습니다.');
    }
  };

  const handleAddSchedule = (newScheduleData: Omit<ScheduleItem, 'id' | 'isCompletedToday'>) => {
    const newSchedule: ScheduleItem = {
      ...newScheduleData,
      id: `sch-${Date.now()}`,
      isCompletedToday: false,
    };
    setSchedules((prev) => [...prev, newSchedule]);
    showToast(`✨ '${newSchedule.academyName}' 일정이 추가되었습니다.`);
  };

  // 학원비 핸들러
  const handleChangeTuitionStatus = (id: string, status: TuitionStatus) => {
    const statusLabels: Record<TuitionStatus, string> = {
      pending: '결제 대기 ⏳',
      completed: '결제 완료 ✅',
      discounted: '할인/바우처 적용 🎁',
    };
    setTuitions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          showToast(`수납 상태가 '${statusLabels[status]}'(으)로 변경되었습니다.`);
          return { ...t, status };
        }
        return t;
      })
    );
  };

  const handleDeleteTuition = (id: string) => {
    if (confirm('이 학원비 내역을 삭제하시겠습니까?')) {
      setTuitions((prev) => prev.filter((t) => t.id !== id));
      showToast('학원비 내역이 삭제되었습니다.');
    }
  };

  const handleAddTuition = (newTuitionData: Omit<TuitionItem, 'id'>) => {
    const newTuition: TuitionItem = {
      ...newTuitionData,
      id: `tui-${Date.now()}`,
    };
    setTuitions((prev) => [...prev, newTuition]);
    showToast(`💰 '${newTuition.academyName}' 학원비가 등록되었습니다.`);
  };

  // 가족 메모 핸들러
  const handleAddFamilyNote = (sender: '엄마' | '아빠', content: string, isUrgent: boolean) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours % 12 || 12;
    const timeStr = `${period} ${displayHours}:${minutes}`;

    const newNoteItem: FamilyNote = {
      id: `note-${Date.now()}`,
      sender,
      content,
      timestamp: timeStr,
      isUrgent,
    };
    setFamilyNotes((prev) => [newNoteItem, ...prev]);
    showToast(`💌 ${sender}의 새 라이딩 쪽지가 등록되었습니다.`);
  };

  // 하단 탭 배지 카운트 계산
  const todayDay = new Date().getDay();
  const pendingTodayRides = schedules.filter(
    (s) => s.daysOfWeek.includes(todayDay) && !s.isCompletedToday
  ).length;
  const pendingTuitionsCount = tuitions.filter((t) => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start sm:py-6">
      {/* 화면 상단 디바이스 프레임 토글 (데스크톱 전용) */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 shadow-xs">
        <span className="font-semibold text-teal-700">디스플레이 모드:</span>
        <button
          onClick={() => setIsPhoneFrame(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
            isPhoneFrame ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>모바일 프레임</span>
        </button>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
            !isPhoneFrame ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>전체 너비</span>
        </button>
      </div>

      {/* 스마트폰 목업 래퍼 컨테이너 */}
      <div
        className={`w-full bg-slate-50 relative flex flex-col transition-all duration-300 ${
          isPhoneFrame
            ? 'sm:max-w-[420px] sm:h-[860px] sm:rounded-[44px] sm:border-[9px] sm:border-slate-800 sm:shadow-2xl overflow-hidden'
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* 모바일 폰 상단 스피커 & 노치 (프레임 활성화 시) */}
        {isPhoneFrame && (
          <div className="hidden sm:flex justify-center pt-2.5 pb-1 bg-white border-b border-slate-100 shrink-0">
            <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 ml-auto mr-1.5" />
            </div>
          </div>
        )}

        {/* 상단 앱바 & 자녀 필터 */}
        <Header
          childrenList={childrenList}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
          onResetData={handleResetData}
        />

        {/* 메인 탭 콘텐츠 영역 */}
        <main className="flex-1 px-4 pt-3.5 pb-4 overflow-y-auto no-scrollbar">

          {activeTab === 'schedule' && (
            <ScheduleTab
              schedules={schedules}
              childrenList={childrenList}
              selectedChildId={selectedChildId}
              onToggleAlert={handleToggleAlert}
              onChangeAlertMinutes={handleChangeAlertMinutes}
              onChangePickupRole={handleChangePickupRole}
              onToggleCompleteToday={handleToggleCompleteToday}
              onDeleteSchedule={handleDeleteSchedule}
              onOpenAddModal={() => setIsScheduleModalOpen(true)}
            />
          )}

          {activeTab === 'family' && (
            <FamilySyncTab
              schedules={schedules}
              childrenList={childrenList}
              familyNotes={familyNotes}
              onAddFamilyNote={handleAddFamilyNote}
              onChangePickupRole={handleChangePickupRole}
              onToggleCompleteToday={handleToggleCompleteToday}
            />
          )}

          {activeTab === 'tuition' && (
            <TuitionTab
              tuitions={tuitions}
              childrenList={childrenList}
              selectedChildId={selectedChildId}
              onChangeTuitionStatus={handleChangeTuitionStatus}
              onDeleteTuition={handleDeleteTuition}
              onOpenAddModal={() => setIsTuitionModalOpen(true)}
            />
          )}
        </main>

        {/* 토스트 알림 메시지 */}
        {toastMessage && (
          <div className="fixed bottom-18 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 하단 내비게이션 바 */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingRidesCount={pendingTodayRides}
          pendingTuitionCount={pendingTuitionsCount}
        />

        {/* 스케줄 추가 모달 */}
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          childrenList={childrenList}
          onAddSchedule={handleAddSchedule}
        />

        {/* 학원비 추가 모달 */}
        <TuitionModal
          isOpen={isTuitionModalOpen}
          onClose={() => setIsTuitionModalOpen(false)}
          childrenList={childrenList}
          onAddTuition={handleAddTuition}
        />
      </div>
    </div>
  );
}

export default App;
