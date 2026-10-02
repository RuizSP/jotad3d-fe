import {
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import * as Yup from "yup";

interface UseFormProps<T extends Yup.AnyObject> {
  initialValues: T;
  schema?: Yup.AnyObjectSchema;
}

interface UseFormReturn<T extends Yup.AnyObject> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  changeValue: <K extends keyof T>(field: K, value: T[K]) => void;
  validation: () => Promise<boolean>;
  validationErrors: (field: keyof T) => {
    error: boolean;
    helperText: string;
  };
  clearErrors: () => void;
}

export function useForm<T extends Yup.AnyObject>({
  initialValues,
  schema,
}: UseFormProps<T>): UseFormReturn<T> {
  const [data, setData] = useState<T>(initialValues);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const changeValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    },
    [],
  );

  const validation = useCallback(async () => {
    if (!schema) return true;

    try {
      await schema.validate(data, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  }, [data, schema]);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const getValidationError = useCallback(
    (field: keyof T) => {
      const error = validationErrors[field as string];
      return {
        error: !!error,
        helperText: error,
      };
    },
    [validationErrors],
  );

  return {
    data,
    setData,
    changeValue,
    validation,
    validationErrors: getValidationError,
    clearErrors,
  };
}
