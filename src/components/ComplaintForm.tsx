import React, { useState } from 'react';
import { Send, CheckCircle2, ChevronDown, Copy, Check, RefreshCw } from 'lucide-react';
import { ComplaintItem, NEIGHBORHOODS, CategoryType } from '../types';

interface ComplaintFormProps {
  onSubmitComplaint: (newComplaint: Omit<ComplaintItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => ComplaintItem;
  onOpenTrackModal: (trackingId?: string) => void;
}

// رابط n8n webhook - التصنيف الفعلي بيصير AI Agent (Groq) على السيرفر، مش هون
const N8N_WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  'https://xfrrfrw223aa.app.n8n.cloud/webhook/sawt-complaint';

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  onSubmitComplaint,
  onOpenTrackModal,
}) => {
  const [complaintText, setComplaintText] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  // Submitted item state for success screen
  const [submittedItem, setSubmittedItem] = useState<ComplaintItem | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint: complaintText.trim(),
          neighborhood: neighborhood || 'غير محدد',
          name: name.trim() || undefined,
          contact: contact.trim() || undefined,
        }),
      });

      if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);

      const result = await response.json();

      // نحدث الحالة المحلية للـ UI، ونستخدم رقم المتابعة الحقيقي القادم من Supabase
      const created = onSubmitComplaint({
        complaint: complaintText.trim(),
        neighborhood: neighborhood || 'غير محدد',
        category: 'other', // التصنيف الفعلي محفوظ بـ Supabase عبر AI Agent، مش مستخدم بالواجهة هون
        name: name.trim() || undefined,
        contact: contact.trim() || undefined,
      });

      setSubmittedItem({ ...created, id: result.tracking_id || created.id });
    } catch (err) {
      console.error('فشل إرسال الشكوى:', err);
      setSubmitError('تعذر إرسال طلبك، حاول مرة أخرى بعد قليل.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setComplaintText('');
    setNeighborhood('');
    setName('');
    setContact('');
    setSubmittedItem(null);
    setCopiedId(false);
  };

  const handleCopyId = () => {
    if (submittedItem?.id) {
      navigator.clipboard.writeText(submittedItem.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <main className="flex-grow w-full max-w-[720px] mx-auto px-4 sm:px-6 md:px-0 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="mb-8 sm:mb-12 text-center">
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-[30px] leading-tight sm:leading-[42px] mb-3 text-[#1a1c1b]">
          شارك ملاحظتك معنا، صوتك بيوصل
        </h1>
        <p className="text-base sm:text-lg text-[#3d4947] max-w-[520px] mx-auto leading-relaxed">
          نحن هنا للاستماع وحل مشكلاتكم. تفضل بتعبئة النموذج أدناه وسيقوم فريقنا بمتابعة الطلب.
        </p>
      </section>

      {/* Form Container */}
      <div className="bg-white border border-[#bcc9c6] p-6 sm:p-8 rounded-xl shadow-xs transition-all">
        {!submittedItem ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" id="communityForm">
            {/* Complaint Text Area */}
            <div className="flex flex-col gap-2">
              <label 
                htmlFor="complaint" 
                className="font-semibold text-base text-[#1a1c1b] text-right flex items-center justify-between"
              >
                <span>
                  اكتب شكواك أو طلبك بالتفصيل <span className="text-[#ba1a1a]">*</span>
                </span>
                <span className="text-xs font-normal text-[#6d7a77]">
                  {complaintText.length} حرف
                </span>
              </label>
              <textarea
                id="complaint"
                name="complaint"
                required
                rows={5}
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="مثال: في انقطاع كهرباء متكرر بحينا من أسبوعين..."
                className="w-full min-h-[130px] p-4 border border-[#6d7a77] rounded-lg bg-[#f4f4f2] text-base text-[#1a1c1b] placeholder-[#6d7a77] focus:bg-white transition-all leading-relaxed"
              />
            </div>

            {/* Neighborhood Dropdown */}
            <div className="flex flex-col gap-2">
              <label htmlFor="neighborhood" className="font-semibold text-base text-[#1a1c1b] text-right">
                المنطقة أو الحي
              </label>
              <div className="relative">
                <select
                  id="neighborhood"
                  name="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full h-12 px-4 border border-[#6d7a77] rounded-lg bg-[#f4f4f2] text-base text-[#1a1c1b] appearance-none cursor-pointer focus:bg-white transition-all"
                >
                  <option value="" disabled>
                    اختر الحي
                  </option>
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6d7a77] w-5 h-5" />
              </div>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold text-base text-[#1a1c1b] text-right">
                الاسم (اختياري)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الكريم"
                className="w-full h-12 px-4 border border-[#6d7a77] rounded-lg bg-[#f4f4f2] text-base text-[#1a1c1b] focus:bg-white transition-all"
              />
              <p className="text-xs sm:text-sm text-[#3d4947]">تقدر تتركه فاضي لو بدك</p>
            </div>

            {/* Contact Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="contact" className="font-semibold text-base text-[#1a1c1b] text-right">
                رقم التواصل (اختياري)
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                dir={contact.length > 0 ? 'ltr' : 'rtl'}
                placeholder="+966 5X XXX XXXX"
                className={`w-full h-12 px-4 border border-[#6d7a77] rounded-lg bg-[#f4f4f2] text-base text-[#1a1c1b] focus:bg-white transition-all ${
                  contact.length > 0 ? 'text-left' : 'text-right'
                }`}
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <p className="text-sm text-[#ba1a1a] text-right -mt-2">{submitError}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !complaintText.trim()}
              className="w-full h-[52px] mt-2 bg-[#00685f] hover:bg-[#005049] text-white font-semibold text-base sm:text-lg rounded-lg shadow-xs hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 -rotate-90 rtl:rotate-0" />
                  <span>إرسال</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#008378]/15 text-[#00685f] rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 stroke-[2]" />
            </div>

            <h2 className="font-bold text-2xl text-[#1a1c1b] mb-2">
              تم إرسال طلبك، شكراً إلك
            </h2>

            <p className="text-base text-[#3d4947] mb-6 max-w-md leading-relaxed">
              سيقوم فريقنا بمراجعة ملاحظتك والرد عليك في أقرب وقت ممكن.
            </p>

            {/* Tracking Reference Code Box */}
            <div className="bg-[#f4f4f2] border border-[#bcc9c6] rounded-xl p-4 mb-8 w-full max-w-sm flex items-center justify-between">
              <div className="text-right">
                <span className="text-xs text-[#576060] block font-medium">رقم المتابعة الخاص بطلبك</span>
                <span className="font-mono text-xl font-bold text-[#00685f] dir-ltr inline-block tracking-wider">
                  {submittedItem.id}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#00685f] border border-[#bcc9c6] rounded-lg text-xs font-semibold hover:bg-[#00685f]/10 transition-colors"
              >
                {copiedId ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <button
                onClick={() => onOpenTrackModal(submittedItem.id)}
                className="flex-1 h-12 bg-[#00685f] text-white font-semibold text-base rounded-lg hover:bg-[#005049] transition-colors flex items-center justify-center gap-2"
              >
                <span>متابعة حالة الطلب</span>
              </button>

              <button
                onClick={handleReset}
                className="flex-1 h-12 border border-[#00685f] text-[#00685f] font-semibold text-base rounded-lg hover:bg-[#00685f]/10 transition-colors"
              >
                تقديم طلب جديد
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visual Decorative Area */}
      <div className="mt-10 sm:mt-12 rounded-xl overflow-hidden h-48 sm:h-52 relative border border-[#bcc9c6] shadow-xs">
        <div
          className="w-full h-full bg-cover bg-center grayscale-[0.15] opacity-90 transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBl-TKwwyAPCDaOAmfCPjSgdAU314HrpZeXYwpFnF00BJSG6g9I7RDHFvKyXhp_F2EE0fUx8xDEnF7_PeWvGbhHBA07HTapFZjeZV-taFN6Fb4fd6sY2GG8_vjTNPFH8lqX_wP7sW9tapk7GnGo81rBvEMjitGhIaMQQ34avXKyJvVi6b3gQMRYjulgRwnxOTUWKQxv9W2rnM82y6XzxcyvzZojqcaGh6ol2Cl9RmKRz1_J3Vb75ZXr0Q')`,
          }}
          aria-label="رسوم توضيحية للمجتمع والتواصل الفعال"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f9f7] via-transparent to-transparent pointer-events-none" />
      </div>
    </main>
  );
};
