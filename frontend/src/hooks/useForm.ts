import { useState, useCallback, useEffect } from "react";
import { z } from "zod";

// Generic form hook with validation
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: z.ZodSchema<T>,
  options?: {
    onSubmit?: (values: T) => void | Promise<void>;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
  }
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate form
  const validate = useCallback(() => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.issues.forEach((err: any) => {
          if (err.path.length > 0) {
            const fieldName = err.path[0] as keyof T;
            newErrors[fieldName] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  // Update validation status
  useEffect(() => {
    setIsValid(validate());
  }, [validate]);

  // Handle field change
  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }

      // Validate on change if enabled
      if (options?.validateOnChange) {
        validate();
      }
    },
    [errors, validate, options?.validateOnChange]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on blur if enabled
      if (options?.validateOnBlur) {
        validate();
      }
    },
    [validate, options?.validateOnBlur]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as Partial<Record<keyof T, boolean>>);
      setTouched(allTouched);

      // Validate form
      if (!validate()) {
        return;
      }

      setIsSubmitting(true);

      try {
        if (options?.onSubmit) {
          await options.onSubmit(values);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, options]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set form values
  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  // Set field error
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((name: keyof T) => {
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFormValues,
    setFieldError,
    clearFieldError,
    clearErrors,
    validate,
  };
};

// Hook for individual form fields
export const useField = <T extends Record<string, any>>(
  name: string,
  form: ReturnType<typeof useForm<T>>
) => {
  const value = form.values[name as keyof T];
  const error = form.errors[name as keyof T];
  const touched = form.touched[name as keyof T];

  const handleChange = useCallback(
    (newValue: any) => {
      form.handleChange(name, newValue);
    },
    [form, name]
  );

  const handleBlur = useCallback(() => {
    form.handleBlur(name);
  }, [form, name]);

  return {
    value,
    error,
    touched,
    hasError: Boolean(error && touched),
    handleChange,
    handleBlur,
    setError: (error: string) => form.setFieldError(name, error),
    clearError: () => form.clearFieldError(name),
  };
};

// Hook for file uploads
export const useFileUpload = (options?: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (options?.maxSize && file.size > options.maxSize) {
        return `File size must be less than ${Math.round(
          options.maxSize / 1024 / 1024
        )}MB`;
      }

      if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
        return `File type ${file.type} is not allowed`;
      }

      return null;
    },
    [options]
  );

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | File[]) => {
      const fileArray = Array.from(selectedFiles);
      setError(null);

      // Validate files
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      if (options?.multiple) {
        setFiles((prev) => [...prev, ...fileArray]);
      } else {
        setFiles(fileArray);
      }
    },
    [validateFile, options]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  const uploadFiles = useCallback(
    async (uploadFunction: (files: File[]) => Promise<void>) => {
      if (files.length === 0) return;

      setIsUploading(true);
      setError(null);

      try {
        await uploadFunction(files);
        clearFiles();
      } catch (err: any) {
        setError(err?.message || "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [files, clearFiles]
  );

  return {
    files,
    isUploading,
    error,
    handleFileSelect,
    removeFile,
    clearFiles,
    uploadFiles,
  };
};
