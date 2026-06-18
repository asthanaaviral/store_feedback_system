export const validators = {
  name: (value) => {
    if (!value || value.trim().length < 20) return 'Name must be at least 20 characters.';
    if (value.trim().length > 60) return 'Name must not exceed 60 characters.';
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value.trim())) return 'Please enter a valid email address.';
    return null;
  },

  address: (value) => {
    if (!value || value.trim().length === 0) return 'Address is required.';
    if (value.trim().length > 400) return 'Address must not exceed 400 characters.';
    return null;
  },

  password: (value) => {
    if (!value || value.length < 8) return 'Password must be at least 8 characters.';
    if (value.length > 16) return 'Password must not exceed 16 characters.';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must contain at least one special character.';
    return null;
  },

  rating: (value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 5) return 'Rating must be between 1 and 5.';
    return null;
  },
};


export const validateForm = (data, fields) => {
  const errors = {};
  fields.forEach((field) => {
    const error = validators[field]?.(data[field]);
    if (error) errors[field] = error;
  });
  return { isValid: Object.keys(errors).length === 0, errors };
};
