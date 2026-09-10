import type { Child } from '../types';
import { RotateCcw, Sparkles } from 'lucide-react';


interface HeaderProps {
  childrenList: Child[];
  selectedChildId: string | 'all';
  onSelectChild: (id: string | 'all') => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
  onResetData,
}) => {
  // 오늘 날짜 포맷
  const today = new Date();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${dayNames[today.getDay()]})`;

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 shadow-xs px-4 pt-3 pb-3">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-sm shadow-teal-200">
            <span className="text-xl">🚗</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-800 tracking-tight">아이라이드</h1>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-200/60">
                Care
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{formattedDate}</p>
          </div>
        </div>

        {/* Reset Mock Data Button */}
        <button
          onClick={onResetData}
          title="초기 Mock Data로 재설정"
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-teal-600 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 hover:border-teal-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>데이터 리셋</span>
        </button>
      </div>

      {/* Children Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
        <button
          onClick={() => onSelectChild('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            selectedChildId === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>전체 자녀</span>
        </button>

        {childrenList.map((child) => {
          const isSelected = selectedChildId === child.id;
          return (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? child.color === 'sky'
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                    : 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <span className="text-sm leading-none">{child.avatar}</span>
              <span>{child.name}</span>
              <span
                className={`text-[10px] font-normal opacity-80 ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}
              >
                ({child.age.split(' ')[0]})
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
