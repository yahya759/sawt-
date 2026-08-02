export type RequestStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export type CategoryType = 'electricity' | 'water' | 'paving' | 'lighting' | 'cleanliness' | 'parks' | 'other';

export interface ComplaintItem {
  id: string; // e.g., "REQ-1042"
  complaint: string;
  neighborhood: string;
  name?: string;
  contact?: string;
  category: CategoryType;
  status: RequestStatus;
  createdAt: string; // ISO date string
  updatedAt: string;
  adminNote?: string;
  assignedTeam?: string;
}

export const NEIGHBORHOODS = [
  'حي النور',
  'حي الأمل',
  'حي السلام',
  'حي الكرامة',
  'حي الوحدة',
  'حي الروضة',
  'حي الزهور',
  'حي الملقا',
  'حي الياسمين',
  'أخرى',
] as const;

export const CATEGORIES: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'electricity', label: 'كهرباء وإنارة', icon: 'Zap' },
  { id: 'water', label: 'مياه وصرف صحي', icon: 'Droplets' },
  { id: 'paving', label: 'سفلتة وطرق', icon: 'Construction' },
  { id: 'lighting', label: 'أعمدة إنارة', icon: 'Lightbulb' },
  { id: 'cleanliness', label: 'نظافة وبيئة', icon: 'Trash2' },
  { id: 'parks', label: 'حدائق ومرافق', icon: 'Trees' },
  { id: 'other', label: 'خدمات أخرى', icon: 'HelpCircle' },
];

export const STATUS_MAP: Record<RequestStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: {
    label: 'قيد المراجعة',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  in_progress: {
    label: 'جاري العمل',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  resolved: {
    label: 'تم الحل',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  rejected: {
    label: 'مرفوض / غير مختص',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
  },
};
