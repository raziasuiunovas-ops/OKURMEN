import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'только что';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч назад`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн назад`;
  
  return formatDate(d);
}

export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return 'N/A';
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusColor(
  status: string
): 'default' | 'success' | 'warning' | 'destructive' {
  const statusMap: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
    ACTIVE: 'success',
    COMPLETED: 'success',
    CONFIRMED: 'success',
    PUBLISHED: 'success',
    PAID: 'success',
    
    PENDING: 'warning',
    PAUSED: 'warning',
    
    INACTIVE: 'destructive',
    CANCELLED: 'destructive',
    REJECTED: 'destructive',
    DROPPED: 'destructive',
    FAILED: 'destructive',
  };

  return statusMap[status] || 'default';
}

export function getPositionLabel(position: string): string {
  const labels: Record<string, string> = {
    FOUNDER: 'Основатель',
    TEACHER: 'Преподаватель',
    MENTOR: 'Ментор',
    MANAGER: 'Менеджер',
    DEVELOPER: 'Разработчик',
    SALES: 'Менеджер по продажам',
    MARKETING: 'Маркетолог',
    ADMIN_STAFF: 'Администратор',
    OTHER: 'Другое',
  };

  return labels[position] || position;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    // Student Status
    ACTIVE: 'Активен',
    INACTIVE: 'Неактивен',
    GRADUATED: 'Выпускник',
    DROPPED: 'Отчислен',
    
    // Enrollment Status
    COMPLETED: 'Завершено',
    PAUSED: 'На паузе',
    CANCELLED: 'Отменено',
    
    // Booking Status
    PENDING: 'Ожидание',
    CONFIRMED: 'Подтверждено',
    
    // Payment Status
    PAID: 'Оплачено',
    FAILED: 'Ошибка',
    REFUNDED: 'Возврат',
  };

  return labels[status] || status;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);

  const firstDayWeek = firstDay.getDay() || 7; // Make Sunday = 7
  const lastDayDate = lastDay.getDate();
  const prevLastDayDate = prevLastDay.getDate();

  const days = [];

  // Previous month days
  for (let i = firstDayWeek - 1; i > 0; i--) {
    days.push({
      date: prevLastDayDate - i + 1,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(year, month - 1, prevLastDayDate - i + 1),
    });
  }

  // Current month days
  const today = new Date();
  for (let i = 1; i <= lastDayDate; i++) {
    const fullDate = new Date(year, month, i);
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday:
        fullDate.toDateString() === today.toDateString(),
      fullDate,
    });
  }

  // Next month days
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(year, month + 1, i),
    });
  }

  return days;
}

export function formatPrice(price: number | string, currency: string = 'KGS'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${numPrice.toLocaleString('ru-RU')} ${currency}`;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^(\+?996)?[0-9]{9}$/;
  return re.test(phone.replace(/\s/g, ''));
}
