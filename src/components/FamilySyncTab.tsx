import { useState, type FormEvent } from 'react';
import type { ScheduleItem, Child, ParentRole, FamilyNote } from '../types';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  HeartHandshake,
  AlertCircle,
} from 'lucide-react';


interface FamilySyncTabProps {
  schedules: ScheduleItem[];
  childrenList: Child[];
  familyNotes: FamilyNote[];
  onAddFamilyNote: (sender: '엄마' | '아빠', content: string, isUrgent: boolean) => void;
  onChangePickupRole: (scheduleId: string, role: ParentRole) => void;
  onToggleCompleteToday: (scheduleId: string) => void;
}

export const FamilySyncTab: React.FC<FamilySyncTabProps> = ({
  schedules,
  childrenList,
  familyNotes,
  onAddFamilyNote,
  onChangePickupRole,
  onToggleCompleteToday,
}) => {
  const [newNote, setNewNote] = useState('');
  const [currentSender, setCurrentSender] = useState<'엄마' | '아빠'>('엄마');
  const [isUrgentNote, setIsUrgentNote] = useState(false);

  const todayDay = new Date().getDay();
  // 오늘의 일정
  const todaySchedules = schedules
    .filter((s) => s.daysOfWeek.includes(todayDay))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const motherRides = todaySchedules.filter((s) => s.pickupRole === 'mother');
  const fatherRides = todaySchedules.filter((s) => s.pickupRole === 'father');
  const bothRides = todaySchedules.filter((s) => s.pickupRole === 'both');

  const totalRides = todaySchedules.length;
  const completedRides = todaySchedules.filter((s) => s.isCompletedToday).length;

  const handleSendNote = (e: FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddFamilyNote(currentSender, newNote.trim(), isUrgentNote);
    setNewNote('');
    setIsUrgentNote(false);
  };

  const getChild = (childId: string) => childrenList.find((c) => c.id === childId);

  return (
    <div className="space-y-4 pb-6">
      {/* 상단: 오늘 픽업 분담 요약 통계 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">오늘의 라이딩 팀플레이</h3>
              <p className="text-[11px] text-slate-400">부모 간 역할 분담 및 실시간 현황</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            총 {totalRides}회 중 {completedRides}회 완료
          </span>
        </div>

        {/* 3단 분담 현황 카드 */}
        <div className="grid grid-cols-3 gap-2">
          {/* 엄마 카드 */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-center transition-all hover:bg-amber-50">
            <div className="flex items-center justify-center gap-1 text-amber-900 font-bold text-xs mb-1">
              <span>👩</span>
              <span>엄마 전담</span>
            </div>
            <div className="text-xl font-extrabold text-amber-700">{motherRides.length}건</div>
            <div className="text-[10px] text-amber-600/80 mt-0.5">
              {motherRides.filter((s) => s.isCompletedToday).length}건 완료
            </div>
          </div>

          {/* 아빠 카드 */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3 text-center transition-all hover:bg-sky-50">
            <div className="flex items-center justify-center gap-1 text-sky-900 font-bold text-xs mb-1">
              <span>👨</span>
              <span>아빠 전담</span>
            </div>
            <div className="text-xl font-extrabold text-sky-700">{fatherRides.length}건</div>
            <div className="text-[10px] text-sky-600/80 mt-0.5">
              {fatherRides.filter((s) => s.isCompletedToday).length}건 완료
            </div>
          </div>

          {/* 공동 카드 */}
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3 text-center transition-all hover:bg-purple-50">
            <div className="flex items-center justify-center gap-1 text-purple-900 font-bold text-xs mb-1">
              <span>💜</span>
              <span>공동/협의</span>
            </div>
            <div className="text-xl font-extrabold text-purple-700">{bothRides.length}건</div>
            <div className="text-[10px] text-purple-600/80 mt-0.5">
              {bothRides.filter((s) => s.isCompletedToday).length}건 완료
            </div>
          </div>
        </div>
      </div>

      {/* 픽업 담당별 일정 상세 분류 */}
      <div className="space-y-3">
        {/* 엄마 담당 리스트 */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h4 className="text-xs font-bold text-slate-800">엄마 담당 스케줄 ({motherRides.length})</h4>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
              주요 픽업: 영어·발레 등
            </span>
          </div>

          {motherRides.length === 0 ? (
            <p className="text-xs text-slate-400 py-2 text-center bg-slate-50 rounded-xl">오늘 엄마 배정 라이딩이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {motherRides.map((ride) => {
                const child = getChild(ride.childId);
                return (
                  <div
                    key={ride.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      ride.isCompletedToday
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-amber-50/30 border-amber-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{child?.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{child?.name}</span>
                          <span className="text-xs font-semibold text-slate-700">{ride.academyName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{ride.startTime} ~ {ride.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ride.pickupRole}
                        onChange={(e) => onChangePickupRole(ride.id, e.target.value as ParentRole)}
                        className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer"
                      >
                        <option value="mother">엄마</option>
                        <option value="father">아빠로 변경</option>
                        <option value="both">공동으로 변경</option>
                      </select>

                      <button
                        onClick={() => onToggleCompleteToday(ride.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          ride.isCompletedToday
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-slate-400 hover:text-teal-600 hover:bg-slate-100'
                        }`}
                        title="완료 여부 토글"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 아빠 담당 리스트 */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <h4 className="text-xs font-bold text-slate-800">아빠 담당 스케줄 ({fatherRides.length})</h4>
            </div>
            <span className="text-[11px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md">
              주요 픽업: 수학·미술·주말코딩 등
            </span>
          </div>

          {fatherRides.length === 0 ? (
            <p className="text-xs text-slate-400 py-2 text-center bg-slate-50 rounded-xl">오늘 아빠 배정 라이딩이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {fatherRides.map((ride) => {
                const child = getChild(ride.childId);
                return (
                  <div
                    key={ride.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      ride.isCompletedToday
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-sky-50/30 border-sky-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{child?.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{child?.name}</span>
                          <span className="text-xs font-semibold text-slate-700">{ride.academyName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-sky-500" />
                          <span>{ride.startTime} ~ {ride.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ride.pickupRole}
                        onChange={(e) => onChangePickupRole(ride.id, e.target.value as ParentRole)}
                        className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer"
                      >
                        <option value="father">아빠</option>
                        <option value="mother">엄마로 변경</option>
                        <option value="both">공동으로 변경</option>
                      </select>

                      <button
                        onClick={() => onToggleCompleteToday(ride.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          ride.isCompletedToday
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-slate-400 hover:text-teal-600 hover:bg-slate-100'
                        }`}
                        title="완료 여부 토글"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 공동 담당 리스트 */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <h4 className="text-xs font-bold text-slate-800">공동 협의 스케줄 ({bothRides.length})</h4>
            </div>
            <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md">
              퇴근 상황에 맞춰 먼저 가는 사람 픽업!
            </span>
          </div>

          {bothRides.length === 0 ? (
            <p className="text-xs text-slate-400 py-2 text-center bg-slate-50 rounded-xl">공동 담당 일정이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {bothRides.map((ride) => {
                const child = getChild(ride.childId);
                return (
                  <div
                    key={ride.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      ride.isCompletedToday
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-purple-50/30 border-purple-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{child?.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{child?.name}</span>
                          <span className="text-xs font-semibold text-slate-700">{ride.academyName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-purple-500" />
                          <span>{ride.startTime} ~ {ride.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ride.pickupRole}
                        onChange={(e) => onChangePickupRole(ride.id, e.target.value as ParentRole)}
                        className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer"
                      >
                        <option value="both">공동</option>
                        <option value="mother">엄마 전담으로 변경</option>
                        <option value="father">아빠 전담으로 변경</option>
                      </select>

                      <button
                        onClick={() => onToggleCompleteToday(ride.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          ride.isCompletedToday
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-slate-400 hover:text-teal-600 hover:bg-slate-100'
                        }`}
                        title="완료 여부 토글"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 부모 간 실시간 라이딩 쪽지/메모 피드 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800">라이딩 메모 & 긴급 전달</h3>
              <p className="text-[11px] text-slate-400">야근, 교통 상황, 준비물 실시간 공유</p>
            </div>
          </div>
        </div>

        {/* 쪽지 피드 리스트 */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 no-scrollbar mb-3">
          {familyNotes.map((note) => {
            const isMother = note.sender === '엄마';
            return (
              <div
                key={note.id}
                className={`p-3 rounded-2xl border ${
                  note.isUrgent
                    ? 'bg-rose-50/60 border-rose-200'
                    : isMother
                    ? 'bg-amber-50/50 border-amber-100'
                    : 'bg-sky-50/50 border-sky-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{isMother ? '👩' : '👨'}</span>
                    <span className={`text-xs font-bold ${isMother ? 'text-amber-800' : 'text-sky-800'}`}>
                      {note.sender}
                    </span>
                    {note.isUrgent && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        긴급
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{note.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">{note.content}</p>
              </div>
            );
          })}
        </div>

        {/* 쪽지 작성 폼 */}
        <form onSubmit={handleSendNote} className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            {/* 발신자 선택 토글 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setCurrentSender('엄마')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                  currentSender === '엄마'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                👩 엄마로 작성
              </button>
              <button
                type="button"
                onClick={() => setCurrentSender('아빠')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                  currentSender === '아빠'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                👨 아빠로 작성
              </button>
            </div>

            {/* 긴급 플래그 토글 */}
            <label className="flex items-center gap-1 text-[11px] font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgentNote}
                onChange={(e) => setIsUrgentNote(e.target.checked)}
                className="w-3.5 h-3.5 text-rose-500 rounded border-slate-300 focus:ring-rose-400"
              />
              <span className={isUrgentNote ? 'text-rose-600 font-bold' : ''}>🚨 중요/긴급</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="예: 오늘 10분 늦어져요! 먼저 출발해 줘요~"
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>전송</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
