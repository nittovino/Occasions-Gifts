export const validateEmail = (email) => {
  // Enhanced regex to support hyphens in domain names and standard email formats
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  // Basic basic validation, can be enhanced
  return phone && phone.length >= 8;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};