import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, Wrench, AlertCircle, Calendar, MapPin, Phone, User, FileText } from 'lucide-react';
import { ComplaintItem, STATUS_MAP } from '../types';

interface TrackStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: ComplaintItem[];
  initialTrackingId?: string;
}

export const TrackStatusModal: React.FC<TrackStatusModalProps> = ({
  isOpen,
  onClose,
  complaints,
  initialTrackingId = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTrackingId);
  const [foundItem, setFoundItem] = useState<ComplaintItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialTrackingId) {
      setSearchQuery(initialTrackingId);
      const match = complaints.find(
        (c) => c.id.toLowerCase() === initialTrackingId.toLowerCase()
      );
      setFoundItem(match || null);
      setHasSearched(true);
    }
  }, [initialTrackingId, complaints]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const match = complaints.find(
      (c) =>
        c.id.toLowerCase() === query ||
        (c.contact && c.contact.includes(query))
    );
    setFoundItem(match || null);
    setHasSearched(true);
  };

  const getStepStatus = (status: ComplaintItem['status'], stepIndex: number) => {
    // Steps: 0 = Received, 1 = Under Review, 2 = Work In Progress, 3 = Resolved
    const statusOrder: Record<ComplaintItem['status'], number> = {
      pending: 1,
      in_progress: 2,
      resolved: 3,
      rejected: 0,
    };

    const currentLevel = statusOrder[status];
    if (status === 'rejected') return 'rejected';
    if (stepIndex <= currentLevel) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#bcc9c6] rounded-2xl w-full max-w-xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#f9f9f7] px-6 py-4 border-b border-[#bcc9c6] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00685f]">
            <Search className="w-5 h-5" />
            <h3 className="font-bold text-lg text-[#1a1c1b]">متابعة حالة الطلب أو الشكوى</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#576060] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="أدخل رقم المتابعة (مثال: REQ-1048) أو رقم الهاتف..."
                className="w-full h-12 pl-10 pr-4 border border-[#6d7a77] rounded-lg bg-[#f4f4f2] text-sm text-[#1a1c1b] focus:bg-white transition-all font-mono"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a77]" />
            </div>
            <button
              type="submit"
              className="h-12 px-5 bg-[#00685f] hover:bg-[#005049] text-white font-semibold text-sm rounded-lg transition-colors"
            >
              بحث
            </button>
          </form>

          {/* Quick Suggestions from Seed */}
          {!hasSearched && (
            <div className="bg-[#f4f4f2] p-3.5 rounded-lg border border-[#bcc9c6]/60">
              <p className="text-xs font-semibold text-[#576060] mb-2">أرقام بلاغات تجريبية سريعة للمعاينة:</p>
              <div className="flex flex-wrap gap-2">
                {complaints.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSearchQuery(item.id);
                      setFoundItem(item);
                      setHasSearched(true);
                    }}
                    className="px-2.5 py-1 text-xs font-mono bg-white border border-[#00685f]/30 text-[#00685f] rounded-md hover:bg-[#00685f]/10 transition-colors"
                  >
                    {item.id} ({STATUS_MAP[item.status].label})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result Section */}
          {hasSearched && (
            <div>
              {foundItem ? (
                <div className="border border-[#bcc9c6] rounded-xl p-5 bg-[#f9f9f7] space-y-5">
                  {/* Status & Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bcc9c6]/60 pb-4">
                    <div>
                      <span className="text-xs text-[#576060] font-medium block">رقم البلاغ</span>
                      <span className="font-mono text-lg font-bold text-[#00685f]">
                        {foundItem.id}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        STATUS_MAP[foundItem.status].bg
                      } ${STATUS_MAP[foundItem.status].text} ${STATUS_MAP[foundItem.status].border}`}
                    >
                      {STATUS_MAP[foundItem.status].label}
                    </div>
                  </div>

                  {/* Complaint Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-[#00685f] mt-1 shrink-0" />
                      <div>
                        <span className="text-xs text-[#576060] font-semibold block">تفاصيل البلاغ</span>
                        <p className="text-sm text-[#1a1c1b] leading-relaxed font-medium">
                          {foundItem.complaint}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                      <div className="flex items-center gap-1.5 text-[#3d4947]">
                        <MapPin className="w-3.5 h-3.5 text-[#00685f]" />
                        <span>الحي: <strong className="text-[#1a1c1b]">{foundItem.neighborhood}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#3d4947]">
                        <Calendar className="w-3.5 h-3.5 text-[#00685f]" />
                        <span>التاريخ: <strong className="text-[#1a1c1b]">{new Date(foundItem.createdAt).toLocaleDateString('ar-SA')}</strong></span>
                      </div>
                      {foundItem.name && (
                        <div className="flex items-center gap-1.5 text-[#3d4947]">
                          <User className="w-3.5 h-3.5 text-[#00685f]" />
                          <span>المرسل: <strong className="text-[#1a1c1b]">{foundItem.name}</strong></span>
                        </div>
                      )}
                      {foundItem.contact && (
                        <div className="flex items-center gap-1.5 text-[#3d4947]">
                          <Phone className="w-3.5 h-3.5 text-[#00685f]" />
                          <span>التواصل: <strong className="text-[#1a1c1b] dir-ltr inline-block">{foundItem.contact}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Progress Bar */}
                  {foundItem.status !== 'rejected' && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-[#1a1c1b] block mb-3">مسار المعالجة والتنفيذ:</span>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${
                          getStepStatus(foundItem.status, 1) === 'completed'
                            ? 'bg-[#00685f]/10 border-[#00685f] text-[#00685f] font-bold'
                            : 'bg-white border-[#bcc9c6] text-[#6d7a77]'
                        }`}>
                          <Clock className="w-4 h-4" />
                          <span>1. تم الاستلام</span>
                        </div>

                        <div className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${
                          getStepStatus(foundItem.status, 2) === 'completed'
                            ? 'bg-[#00685f]/10 border-[#00685f] text-[#00685f] font-bold'
                            : 'bg-white border-[#bcc9c6] text-[#6d7a77]'
                        }`}>
                          <Wrench className="w-4 h-4" />
                          <span>2. جاري المتابعة</span>
                        </div>

                        <div className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${
                          getStepStatus(foundItem.status, 3) === 'completed'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                            : 'bg-white border-[#bcc9c6] text-[#6d7a77]'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>3. مكتمل والحل</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Note / Team assigned */}
                  {(foundItem.adminNote || foundItem.assignedTeam) && (
                    <div className="bg-white border border-[#00685f]/30 p-3.5 rounded-lg space-y-1.5">
                      {foundItem.assignedTeam && (
                        <div className="text-xs text-[#00685f] font-bold">
                          الجهة المتابعة: {foundItem.assignedTeam}
                        </div>
                      )}
                      {foundItem.adminNote && (
                        <div className="text-xs text-[#3d4947] leading-relaxed">
                          <strong>تحديث الإدارة:</strong> {foundItem.adminNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-[#bcc9c6] rounded-xl bg-[#f4f4f2]/50">
                  <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-2" />
                  <p className="font-bold text-base text-[#1a1c1b] mb-1">لم يتم العثور على طلب بهذا الرقم</p>
                  <p className="text-xs text-[#576060]">تأكد من كتابة رقم المتابعة بشكل صحيح (مثال: REQ-1048)</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#f9f9f7] px-6 py-3 border-t border-[#bcc9c6] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#6d7a77] text-white text-sm font-semibold rounded-lg hover:bg-[#576060] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
