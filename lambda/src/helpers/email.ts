import { RecipientSchema, RecipientsSchema, SenderSchema } from "../schema";

export const getSenderField = (sender?: SenderSchema) => {
  if (!sender) {
    return `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;
  }
  if (sender.name?.trim()) {
    return `${sender.name} <${sender.email}>`;
  }
  return sender.email;
};

export const getRecipientsField = (
  recipient: RecipientsSchema,
): string | string[] => {
  if (Array.isArray(recipient)) {
    return recipient.map((r) => getRecipientField(r));
  }
  return getRecipientField(recipient);
};

const getRecipientField = (recipient: RecipientSchema) => {
  if (recipient.name?.trim()) {
    return `${recipient.name} <${recipient.email}>`;
  }
  return recipient.email;
};
