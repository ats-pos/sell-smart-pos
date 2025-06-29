
export const formatCurrency = (amount: number, currency = "INR"): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatDate = (date: string | Date, format = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // const options: Intl.DateTimeFormatOptions = {
  //   short: { 
  //     year: 'numeric', 
  //     month: 'short', 
  //     dateStyle: 'numeric' 
  //   },
  //   long: { 
  //     year: 'numeric', 
  //     month: 'long', 
  //     dateStyle: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   },
  //   time: {
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   }
  // }[format] || { year: 'numeric', month: 'short', dateStyle: 'numeric' };
  const options = {};
  
  return new Intl.DateTimeFormat('en-IN', options).format(dateObj);
};

export const formatPhone = (phone: string): string => {
  if (phone.length === 10) {
    return `${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
};

export const formatBillNumber = (number: number): string => {
  return `INV-2024-${String(number).padStart(3, '0')}`;
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInHours = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  
  return formatDate(targetDate);
};
