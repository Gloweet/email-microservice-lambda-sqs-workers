import * as yup from "yup";

const recipientSchema = yup.object({
  name: yup.string().nullable().optional(),
  email: yup.string().email().required(),
});

const recipientsSchema = yup.lazy((value) => {
  if (Array.isArray(value)) {
    return yup.array().of(recipientSchema).required();
  }
  return recipientSchema.required();
});

const senderSchema = yup
  .object({
    name: yup.string().nullable().optional(),
    email: yup.string().email().required(),
  })
  .transform((value, originalValue) => {
    if (
      originalValue === undefined ||
      originalValue === null ||
      (typeof originalValue === "object" &&
        originalValue !== null &&
        Object.keys(originalValue).length === 0)
    ) {
      return undefined;
    }
    return value;
  })
  .optional();

export const schema = yup
  .object({
    to: recipientsSchema,
    from: senderSchema,
    subject: yup.string().required(),
    html: yup.string(),
    text: yup.string(),
  })
  .test(
    "html-or-text-required",
    "Either html or text must be provided",
    function (value) {
      return !!(value?.html || value?.text);
    },
  );

export type RecipientsSchema = yup.InferType<typeof recipientsSchema>;
export type RecipientSchema = yup.InferType<typeof recipientSchema>;
export type SenderSchema = yup.InferType<typeof senderSchema>;
export type Schema = yup.InferType<typeof schema>;
