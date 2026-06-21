import { useState, useCallback } from 'react';

export const useFormValidation = (initialState) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name, value) => {
    let error = null;

    switch (name) {
      case 'name':
        if (!value) error = "Product name is required";
        else if (value.length < 3) error = "Product name must be at least 3 characters";
        else if (value.length > 100) error = "Product name must be less than 100 characters";
        break;
      
      case 'category':
        if (!value) error = "Category is required";
        break;
      
      case 'price':
        if (!value) error = "Price is required";
        else {
          const num = parseFloat(value);
          if (isNaN(num)) error = "Price must be a number";
          else if (num < 0.01) error = "Price must be at least €0.01";
          else if (num > 9999.99) error = "Price cannot exceed €9999.99";
        }
        break;
      
      case 'description':
        if (!value) error = "Description is required";
        else if (value.length < 20) error = "Description must be at least 20 characters";
        else if (value.length > 500) error = "Description must be less than 500 characters";
        break;
      
      case 'deliveryType':
        if (!value) error = "Delivery type is required";
        break;
      
      case 'image':
        if (!value) error = "Product image is required";
        break;
      
      case 'tags':
        if (Array.isArray(value) && value.length > 5) error = "Maximum 5 tags allowed";
        break;

      default:
        break;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) newErrors[name] = error;
      else delete newErrors[name];
      return newErrors;
    });

    return error;
  }, []);

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    let formIsValid = true;

    // Validate all fields
    ['name', 'category', 'price', 'description', 'deliveryType', 'image'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        formIsValid = false;
      }
    });

    if (formData.tags && formData.tags.length > 5) {
      newErrors.tags = "Maximum 5 tags allowed";
      formIsValid = false;
    }

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [validateField]);

  return {
    errors,
    isValid,
    validateField,
    validateForm
  };
};