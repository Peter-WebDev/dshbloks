import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { z, ZodError } from "zod";

interface FormErrors {
  [key: string]: string | undefined;
}

export function useZodValidation<T extends z.ZodObject<z.ZodRawShape>>(schema: T) {
  type SchemaData = z.infer<T>;
  const [errors, setErrors] = createStore<FormErrors>({});

  // Helper för att skapa field state med validation
  const getFieldState = (fieldName: keyof SchemaData) => {
    const [value, setValue] = createSignal("");
    const [hasError, setHasError] = createSignal(false);

    const validateField = (inputValue: string) => {
      try {
        const pickShape = { [fieldName]: true } as Record<keyof SchemaData, true>;
        const fieldSchema = schema.pick(pickShape);
        fieldSchema.parse({ [fieldName]: inputValue });
        
        // Validering lyckades
        setHasError(false);
        setErrors(fieldName as string, undefined);
      } catch (err) {
        // Validering misslyckades
        if (err instanceof ZodError) {
          setHasError(true);
          setErrors(fieldName as string, err.issues[0]?.message || "Validation error");
        }
      }
    };

    const onChange = (inputValue: string) => {
      setValue(inputValue);
      validateField(inputValue);
    };

    const onBlur = () => {
      validateField(value());
    };

    return {
      value,
      hasError,
      onChange,
      onBlur,
      error: () => errors[fieldName as string]
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

  return { errors, validateForm, getFieldState };
}