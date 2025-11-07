import { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";

export const handleFormErrorsMco = (
  error: any,
  form: FormInstance<any>,
  message: MessageInstance
) => {
  const apiData = error?.response?.data;
  const apiErrors = apiData?.error || {};

  const fieldErrors: { name: (string | number)[]; errors: string[] }[] = [];
  let uniquePhoneError = "";

  Object.entries(apiErrors).forEach(([field, detail]: [string, any]) => {
    if (Array.isArray(detail)) {
      if (typeof detail[0] === "string") {
        // Example: contacts: ["Phone numbers must be unique for this MCO."]
        if (
          field === "contacts" &&
          detail.includes("Phone numbers must be unique for this MCO.")
        ) {
          uniquePhoneError = "Phone numbers must be unique for this MCO.";
        } else {
          fieldErrors.push({
            name: [field],
            errors: detail as string[],
          });
        }
      } else {
        // Example: contacts: [{ phone: [...] }, { phone: [...]}]
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
      }
    } else if (typeof detail === "string") {
      fieldErrors.push({
        name: [field],
        errors: [detail],
      });
    }
  });

  if (fieldErrors.length > 0) {
    form.setFields(fieldErrors);
  }

  if (uniquePhoneError) {
    message.error({ content: uniquePhoneError });
  } else if (apiData?.message) {
    message.error({ content: apiData.message });
  }
};
