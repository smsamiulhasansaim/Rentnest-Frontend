'use client';

import { useToast as useToastContext } from '@/providers/ToastProvider';

export const useToast = () => {
  return useToastContext();
};

export default useToast;