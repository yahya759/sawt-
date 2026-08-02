import React from 'react';
import { Megaphone } from 'lucide-react';

interface HeaderProps {
  onOpenTrackModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTrackModal }) => {
  return (
    <header className="bg-surface border-b border-[#bcc9c6] sticky top-0 z-50">
      <div className="flex flex-row-reverse justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        {/* Title & Icon */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl sm:text-2xl text-[#00685f]">
            صوت المجتمع
          </span>
          <Megaphone className="w-5 h-5 text-[#00685f]" />
        </div>

        {/* Action button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenTrackModal}
            className="text-[#00685f] hover:opacity-80 font-semibold text-base transition-opacity cursor-pointer"
          >
            دخول
          </button>
        </div>
      </div>
    </header>
  );
};


