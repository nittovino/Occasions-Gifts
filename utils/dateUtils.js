export const calculateMinDeliveryDate = (leadTimeDays = 0) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + parseInt(leadTimeDays || 0, 10));
  return date;
};

export const formatDateForDisplay = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isDateBeforeMinDate = (selectedDate, minDate) => {
  if (!selectedDate || !minDate) return false;
  const s = new Date(selectedDate);
  s.setHours(0, 0, 0, 0);
  const m = new Date(minDate);
  m.setHours(0, 0, 0, 0);
  return s < m;
};

export const getLeadTimeDaysWithFallback = (product) => {
  if (!product) return 1;
  return product.leadTimeDays !== undefined ? parseInt(product.leadTimeDays, 10) : 1;
};