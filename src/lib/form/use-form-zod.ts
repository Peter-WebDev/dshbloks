import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { z, ZodError } from "zod";

interface FormErrors {
  [key: string]: string | undefined;
}

export function useZodValidation<T extends z.ZodObject<z.ZodRawShape>>(schema: T) {
  type SchemaData = z.infer<T>;
  const [errors, setErrors] = createStore<FormErrors>({});
  const [values, setValues] = createStore<Record<string, string>>({});

  const getFieldState = (fieldName: keyof SchemaData) => {
    const [hasError, setHasError] = createSignal(false);

    const validateAll = (newValues: Record<string, string>) => {
      try {
        schema.parse(newValues);
        // Validering lyckades
        setErrors({});
        setHasError(false);
      } catch (err) {
        // Validering misslyckades
        if (err instanceof ZodError) {
          const newErrors: FormErrors = {};
          err.issues.forEach((error) => {
            const field = error.path[0] as string;
            if (field) newErrors[field] = error.message;
          });
          setErrors(newErrors);
          setHasError(!!newErrors[fieldName as string]);
        }
      }
    };

    const onChange = (inputValue: string) => {
      setValues({ ...values, [fieldName]: inputValue });
      validateAll({ ...values, [fieldName]: inputValue });
    };

    const onBlur = () => {
      validateAll(values);
    };

    return {
      value: () => values[fieldName as string] ?? "",
      hasError,
      onChange,
      onBlur,
      error: () => errors[fieldName as string],
      reset: () => {
        setValues({ ...values, [fieldName]: "" });
        setHasError(false);
        setErrors(fieldName as string, undefined);
      },
    };
  };

  const validateForm = (formData: FormData): { success: true; data: SchemaData } | { success: false } => {
    try {
      const data = Object.fromEntries(formData.entries());
      const validatedData = schema.parse(data) as SchemaData;
      
      setErrors({}); // Rensa alla errors
      return { success: true, data: validatedData };
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: FormErrors = {};
        err.issues.forEach((error) => {
          const fieldName = error.path[0] as string;
          if (fieldName) {
            newErrors[fieldName] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return { success: false };
    }
  };

  function resetForm() {
    setErrors({});
    setValues({});
  }

  return { errors, validateForm, getFieldState, resetForm };
}