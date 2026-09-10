export type ParentRole = 'mother' | 'father' | 'both';

export interface Child {
  id: string;
  name: string;
  age: string; // 예: "10세 (초3)", "7세 (유치원)"
  color: string; // Tailwind color theme identifier (e.g., 'sky', 'emerald', 'amber', 'rose')
  avatar: string;
}

export interface ScheduleItem {
  id: string;
  childId: string;
  subject: string;
  academyName: string;
  location?: string;
  daysOfWeek: number[]; // 0: 일, 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토
  startTime: string; // "15:30"
  endTime: string; // "17:00"
  isSpecialVacation: boolean; // 방학 특강 / 단기 수업
  alertEnabled: boolean;
  alertMinutesBefore: number; // 15, 30, 45, 60
  pickupRole: ParentRole;
  isCompletedToday: boolean;
  notes?: string;
}

export type TuitionStatus = 'pending' | 'completed' | 'discounted';

export interface TuitionItem {
  id: string;
  childId: string;
  academyName: string;
  subject: string;
  category: '교과' | '어학' | '예체능' | '특강/코딩' | '기타';
  amount: number;
  dueDay: number; // 매월 결제일 (1~31)
  status: TuitionStatus;
  discountAmount?: number;
  paymentMethod?: string;
  memo?: string;
}

export interface FamilyNote {
  id: string;
  sender: '엄마' | '아빠';
  content: string;
  timestamp: string;
  isUrgent?: boolean;
}
