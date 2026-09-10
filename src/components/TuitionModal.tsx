import { useState, type FormEvent } from 'react';
import type { Child, TuitionItem, TuitionStatus } from '../types';
import { X } from 'lucide-react';

interface TuitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenList: Child[];
  onAddTuition: (tuition: Omit<TuitionItem, 'id'>) => void;
}

export const TuitionModal: React.FC<TuitionModalProps> = ({
  isOpen,
  onClose,
  childrenList,
  onAddTuition,
}) => {
  const [childId, setChildId] = useState(childrenList[0]?.id || '');
  const [academyName, setAcademyName] = useState('');
  const [subject, setSubject] = useState('영어');
  const [category, setCategory] = useState<TuitionItem['category']>('어학');
  const [amount, setAmount] = useState<string>('250000');
  const [dueDay, setDueDay] = useState<number>(15);
  const [status, setStatus] = useState<TuitionStatus>('pending');
  const [discountAmount, setDiscountAmount] = useState<string>('0');
  const [paymentMethod, setPaymentMethod] = useState('신용카드');
  const [memo, setMemo] = useState('');

  if (!isOpen) return null;

  const categories: TuitionItem['category'][] = ['교과', '어학', '예체능', '특강/코딩', '기타'];

  const handleSubmit = (e: FormEvent) => {

    e.preventDefault();
    if (!academyName.trim()) {
      alert('학원명을 입력해 주세요.');
      return;
    }
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('올바른 학원비 금액을 입력해 주세요.');
      return;
    }

    onAddTuition({
      childId,
      academyName: academyName.trim(),
      subject: subject.trim(),
      category,
      amount: parsedAmount,
      dueDay: Number(dueDay),
      status,
      discountAmount: Number(discountAmount) > 0 ? Number(discountAmount) : undefined,
      paymentMethod,
      memo: memo.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">새 학원비 등록</h3>
            <p className="text-xs text-slate-400">수업료 및 결제 D-day를 등록하세요</p>
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

          {/* 학원명 & 과목 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">학원명</label>
              <input
                type="text"
                value={academyName}
                onChange={(e) => setAcademyName(e.target.value)}
                placeholder="예: 정철영어학원"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">과목</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="예: 영어"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">과목 분야</label>
            <div className="grid grid-cols-5 gap-1">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 수업료 금액 & 결제 예정일 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">월 수업료 (원)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="5000"
                min="0"
                placeholder="300000"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">매월 결제일 (일)</label>
              <select
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    매월 {day}일
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 결제 수단 & 상태 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">결제 수단</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="신용카드">신용카드</option>
                <option value="계좌이체">계좌이체</option>
                <option value="지역화폐/바우처">지역화폐/바우처</option>
                <option value="현금/직접납부">현금/직접납부</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">결제 상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TuitionStatus)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer font-bold"
              >
                <option value="pending">⏳ 결제 대기</option>
                <option value="completed">✅ 결제 완료</option>
                <option value="discounted">🎁 할인/특강 적용</option>
              </select>
            </div>
          </div>

          {/* 할인 금액 (할인 적용 시) */}
          {status === 'discounted' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">할인/바우처 절감액 (원)</label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                step="1000"
                min="0"
                placeholder="20000"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
          )}

          {/* 메모 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">메모 (선택)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 카드사 5% 캐시백 적용"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md shadow-teal-200 transition-all text-xs cursor-pointer"
            >
              학원비 등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
