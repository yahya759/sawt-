import React from 'react';

interface FooterProps {
  onOpenModal: (type: 'contact' | 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  return (
    <footer className="bg-[#eeeeec] border-t border-[#bcc9c6] mt-auto">
      <div className="flex flex-col md:flex-row-reverse justify-between items-center px-6 py-8 w-full max-w-7xl mx-auto gap-4">
        {/* Logo */}
        <div className="font-bold text-xl sm:text-2xl text-[#00685f]">
          صوت المجتمع
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          <button
            onClick={() => onOpenModal('contact')}
            className="text-sm font-medium text-[#3d4947] hover:text-[#00685f] hover:underline underline-offset-4 transition-all cursor-pointer"
          >
            تواصل معنا
          </button>
          <button
            onClick={() => onOpenModal('terms')}
            className="text-sm font-medium text-[#3d4947] hover:text-[#00685f] hover:underline underline-offset-4 transition-all cursor-pointer"
          >
            الشروط والأحكام
          </button>
          <button
            onClick={() => onOpenModal('privacy')}
            className="text-sm font-medium text-[#3d4947] hover:text-[#00685f] hover:underline underline-offset-4 transition-all cursor-pointer"
          >
            الخصوصية
          </button>
        </div>

        {/* Copyright */}
        <div className="text-sm text-[#576060] text-center md:text-right">
          © 2024 جميع الحقوق محفوظة للمنظمة المجتمعية
        </div>
      </div>
    </footer>
  );
};
