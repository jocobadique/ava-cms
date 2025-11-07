import { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";

export const handleFormErrorsMcoEntry = (
  error: any,
  form: FormInstance<any>,
  message: MessageInstance
) => {
  const apiData = error?.response?.data;
  const apiErrors = apiData?.error || {};

  const fieldErrors: { name: (string | number)[]; errors: string[] }[] = [];
  let uniquePhoneError = "";
  let nonFieldErrorMessage = "";

  Object.entries(apiErrors).forEach(([field, detail]: [string, any]) => {
    if (field === "non_field_errors" && Array.isArray(detail)) {
      // ✅ Handle top-level non_field_errors
      nonFieldErrorMessage = detail.join(" ");
    } else if (Array.isArray(detail)) {
      // Example: contacts -> [{ phone: ["Enter a valid phone number."] }]
      detail.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.entries(item).forEach(([subField, messages]) => {
            fieldErrors.push({
              name: [field, index, subField],
              errors: messages as string[],
            });
          });
        }
      });
    } else if (typeof detail === "object" && detail !== null) {
      // Example: code -> { non_field_errors: [...] }
      if (detail.non_field_errors) {
        if (
          field === "contacts" &&
          detail.non_field_errors.includes(
            "Phone numbers must be unique for this MCO."
          )
        ) {
          uniquePhoneError = "Phone numbers must be unique for this MCO.";
        } else {
          fieldErrors.push({
            name: [field],
            errors: detail.non_field_errors as string[],
          });
        }
      }
    }
  });

  if (fieldErrors.length > 0) {
    form.setFields(fieldErrors);
  }

  if (uniquePhoneError) {
    message.error({ content: uniquePhoneError });
  } else if (nonFieldErrorMessage) {
    message.error({ content: nonFieldErrorMessage });
  } else if (apiData?.message) {
    message.error({ content: apiData.message });
  }
};
