import { FormInstance } from "antd/es/form";
import type { MessageInstance } from "antd/es/message/interface";

/**
 * Recursively flattens nested error object into AntD form error format
 */
function flattenErrors(
  errorObj: any,
  parentPath: string[] = []
): { name: (string | number)[]; errors: string[] }[] {
  const result: { name: (string | number)[]; errors: string[] }[] = [];

  Object.entries(errorObj).forEach(([key, value]) => {
    const currentPath = [...parentPath, key];

    if (Array.isArray(value)) {
      result.push({
        name: currentPath,
        errors: value.map(String),
      });
    } else if (typeof value === "object" && value !== null) {
      result.push(...flattenErrors(value, currentPath));
    }
  });

  return result;
}

export function handleFormErrors(
  error: any,
  form: FormInstance<any>,
  message: MessageInstance
) {
  const fieldErrors = error?.response?.data?.error;
  const errorMessage = error?.response?.data?.message || "An error occurred";

  if (fieldErrors && typeof fieldErrors === "object") {
    if (fieldErrors.detail) {
      // ✅ Handle `detail` explicitly
      message.error({ content: fieldErrors.detail });
      return;
    }

    if (fieldErrors.account) {
      // ✅ Handle `account` explicitly
      message.error({ content: fieldErrors.account.email.null });
      return;
    }

    // ✅ Handle non_field_errors first (and skip errorMessage if they exist)
    if (
      Array.isArray(fieldErrors.non_field_errors) &&
      fieldErrors.non_field_errors.length > 0
    ) {
      fieldErrors.non_field_errors.forEach((err: string) =>
        message.error({ content: err })
      );
    } else {
      // ✅ Only show errorMessage if non_field_errors are not present
      message.error({ content: errorMessage });
    }

    // Set form field errors
    const formattedErrors = flattenErrors(fieldErrors);
    form.setFields(formattedErrors);
  } else {
    // If no fieldErrors object, still show the generic message
    message.error({ content: errorMessage });
  }
}
