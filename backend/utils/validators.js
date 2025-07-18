const validator = require('validator');

exports.validateRegisterInput = (data) => {
  const errors = {};
  
  // Name validation
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  // Email validation
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  
  // Password validation
  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  // Role validation
  if (data.role && !['user', 'admin'].includes(data.role)) {
    errors.role = 'Invalid role specified';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

exports.validateLoginInput = (data) => {
  const errors = {};
  
  // Email validation
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  
  // Password validation
  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password is required';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};