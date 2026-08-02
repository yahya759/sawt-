import React from 'react';
import { X, Mail, Phone, MapPin, Shield, FileText } from 'lucide-react';

interface InfoModalProps {
  type: 'contact' | 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#bcc9c6] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#f9f9f7] px-6 py-4 border-b border-[#bcc9c6] flex items-center justify-between">
          <h3 className="font-bold text-lg text-[#1a1c1b] flex items-center gap-2">
            {type === 'contact' && <Mail className="w-5 h-5 text-[#00685f]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-[#00685f]" />}
            {type === 'privacy' && <Shield className="w-5 h-5 text-[#00685f]" />}
            <span>
              {type === 'contact' && 'تواصل معنا'}
              {type === 'terms' && 'الشروط والأحكام'}
              {type === 'privacy' && 'سياسة الخصوصية'}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#576060] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#3d4947] leading-relaxed">
          {type === 'contact' && (
            <div className="space-y-4">
              <p className="text-[#1a1c1b] font-medium">
                فريق خدمة وسماع صوت المجتمع متواجد دائماً للإجابة على استفساراتكم ومتابعة طلباتكم.
              </p>
              <div className="space-y-3 bg-[#f4f4f2] p-4 rounded-xl border border-[#bcc9c6]/60">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#00685f]" />
                  <div>
                    <span className="text-xs text-[#576060] block">رقم الدعم المجاني</span>
                    <strong className="text-[#1a1c1b] font-mono dir-ltr inline-block">800 123 4567</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#00685f]" />
                  <div>
                    <span className="text-xs text-[#576060] block">البريد الإلكتروني الرسمي</span>
                    <strong className="text-[#1a1c1b]">support@sawt-almujtama.sa</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#00685f]" />
                  <div>
                    <span className="text-xs text-[#576060] block">مقر الإدارة العامة</span>
                    <strong className="text-[#1a1c1b]">مركز التنمية والخدمات المجتمعية</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                1. <strong>الهدف من المنصة:</strong> تهدف منصة &quot;صوت المجتمع&quot; إلى إيصال صوت المواطنين والمقيمين وتحسين الخدمات العامة والخدمية في الأحياء.
              </p>
              <p>
                2. <strong>الالتزام بالمصداقية:</strong> يتعهد المستخدم بتقديم معلومات وشكاوى دقيقة وبناءة تخدم الصالح العام.
              </p>
              <p>
                3. <strong>السرية والخصوصية:</strong> اختيار تقديم الاسم ورقم التواصل اختياري تماماً، ولن يتم مشاركة بياناتك مع أي طرف ثالث غير مختص بالصيانة.
              </p>
              <p>
                4. <strong>أوقات المعالجة:</strong> تتفاوت مدة الاستجابة بحسب نوع الشكوى وطبيعة الصيانة الميدانية المطلوبة.
              </p>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                نحن في &quot;صوت المجتمع&quot; نولي أهمية قصوى لخصوصية بياناتك وملاحظاتك.
              </p>
              <p>
                - <strong>البيانات الاختيارية:</strong> الاسم ورقم التواصل تُطلب فقط لغايات إشعارات التحديث ولن تُستخدم في أي أغراض تسويقية.
              </p>
              <p>
                - <strong>التقديم المجهول:</strong> يمكنك التقديم دون إدخال الاسم أو الرقم وتتبع الشكوى عبر رقم المتابعة الخاص فقط.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#f9f9f7] px-6 py-3 border-t border-[#bcc9c6] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#00685f] text-white text-xs font-semibold rounded-lg hover:bg-[#005049] transition-colors"
          >
            فهمت ذلك
          </button>
        </div>
      </div>
    </div>
  );
};
