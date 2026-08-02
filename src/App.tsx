import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ComplaintForm } from './components/ComplaintForm';
import { TrackStatusModal } from './components/TrackStatusModal';
import { Footer } from './components/Footer';
import { InfoModals } from './components/InfoModals';
import { ComplaintItem } from './types';
import { INITIAL_COMPLAINTS } from './data/mockData';

const LOCAL_STORAGE_KEY = 'sawt_almujtama_complaints_v1';

export default function App() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved complaints', e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackInitialId, setTrackInitialId] = useState('');
  const [infoModalType, setInfoModalType] = useState<'contact' | 'terms' | 'privacy' | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to persist complaints', e);
    }
  }, [complaints]);

  // Add new complaint
  const handleAddComplaint = (
    data: Omit<ComplaintItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): ComplaintItem => {
    const nextNum = 1050 + complaints.length;
    const newId = `REQ-${nextNum}`;
    const now = new Date().toISOString();

    const newComplaint: ComplaintItem = {
      ...data,
      id: newId,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const handleOpenTrackModal = (trackingId: string = '') => {
    setTrackInitialId(trackingId);
    setIsTrackModalOpen(true);
  };

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] min-h-screen flex flex-col font-['Cairo',sans-serif]">
      {/* Header */}
      <Header onOpenTrackModal={() => handleOpenTrackModal('')} />

      {/* Main Single Page Form */}
      <ComplaintForm
        onSubmitComplaint={handleAddComplaint}
        onOpenTrackModal={handleOpenTrackModal}
      />

      {/* Modals */}
      <TrackStatusModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        complaints={complaints}
        initialTrackingId={trackInitialId}
      />

      <InfoModals
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Footer */}
      <Footer onOpenModal={(type) => setInfoModalType(type)} />
    </div>
  );
}


