import { useState } from "react";

// 基础验证规则
export const validation = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "邮箱不能为空";
    if (!emailRegex.test(value)) return "请输入有效的邮箱地址";
    return null;
  },

  password: (value: string) => {
    if (!value) return "密码不能为空";
    if (value.length < 8) return "密码至少8位";
    if (!/(?=.*[a-z])/.test(value)) return "密码必须包含小写字母";
    if (!/(?=.*[A-Z])/.test(value)) return "密码必须包含大写字母";
    if (!/(?=.*\d)/.test(value)) return "密码必须包含数字";
    if (!/(?=.*[!@#$%^&*])/.test(value)) return "密码必须包含特殊字符";
    return null;
  },

  username: (value: string) => {
    if (!value) return "用户名不能为空";
    if (value.length < 3) return "用户名至少3位";
    if (value.length > 20) return "用户名最多20位";
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return "用户名只能包含字母、数字和下划线";
    return null;
  },

  // 登录时的用户名或邮箱验证（更宽松）
  usernameOrEmail: (value: string) => {
    if (!value) return "用户名或邮箱不能为空";
    if (value.length < 3) return "输入内容至少3位";
    if (value.length > 50) return "输入内容过长";

    // 检查是否是邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return null; // 邮箱格式有效
    }

    // 检查是否是用户名格式
    if (/^[a-zA-Z0-9_]+$/.test(value)) {
      return null; // 用户名格式有效
    }

    return "请输入有效的用户名或邮箱地址";
  },

  verificationCode: (value: string) => {
    if (!value) return "验证码不能为空";
    if (value.length !== 6) return "验证码必须是6位";
    if (!/^\d{6}$/.test(value)) return "验证码必须是数字";
    return null;
  },

  confirmPassword: (value: string, password: string) => {
    if (!value) return "请确认密码";
    if (value !== password) return "两次密码输入不一致";
    return null;
  },
};

// 表单 hook
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<
    Record<keyof T, (value: any, allValues?: T) => string | null>
  >
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // 清除该字段的错误
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const setFieldTouched = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateField = (name: keyof T, value: any = values[name]) => {
    const validator = validationRules[name];
    if (!validator) return null;

    const error = validator(value, values);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    return error;
  };

  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T;
      const validator = validationRules[fieldName];
      if (validator) {
        const error = validator(values[fieldName], values);
        if (error) {
          newErrors[fieldName] = error;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (onSubmit: (values: T) => void | Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();

      // 标记所有字段为已触摸
      const allTouched = Object.keys(values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      if (validateAll()) {
        await onSubmit(values);
      }
    };
  };

  const getFieldProps = (name: keyof T) => ({
    value: String(values[name] || ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(name, e.target.value),
    onBlur: () => {
      setFieldTouched(name);
      validateField(name);
    },
    error: touched[name] ? errors[name] : undefined,
  });

  // 计算表单是否有效
  const isValid = () => {
    // 检查是否所有必填字段都已填写且没有错误
    const hasAllRequiredValues = Object.keys(validationRules).every((key) => {
      const fieldName = key as keyof T;
      const value = values[fieldName];
      return value !== "" && value !== null && value !== undefined;
    });

    // 检查是否没有错误
    const hasNoErrors = Object.values(errors).every((error) => !error);

    return hasAllRequiredValues && hasNoErrors;
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateAll,
    handleSubmit,
    getFieldProps,
    isValid: isValid(),
  };
}
