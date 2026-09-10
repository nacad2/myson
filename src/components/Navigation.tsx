import { CalendarClock, Users, Receipt } from 'lucide-react';


export type TabType = 'schedule' | 'family' | 'tuition';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingRidesCount: number;
  pendingTuitionCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingRidesCount,
  pendingTuitionCount,
}) => {
  const tabs = [
    {
      id: 'schedule' as TabType,
      label: '일정·라이딩',
      icon: CalendarClock,
      badge: pendingRidesCount > 0 ? pendingRidesCount : null,
      badgeColor: 'bg-teal-500',
    },
    {
      id: 'family' as TabType,
      label: '가족 역할분담',
      icon: Users,
      badge: null,
      badgeColor: 'bg-indigo-500',
    },
    {
      id: 'tuition' as TabType,
      label: '학원비 가계부',
      icon: Receipt,
      badge: pendingTuitionCount > 0 ? pendingTuitionCount : null,
      badgeColor: 'bg-amber-500',
    },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 z-30 shadow-lg mt-auto">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-teal-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4px]' : 'stroke-2'}`} />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-xs ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-teal-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
