import { SES } from "aws-sdk";
import { getRecipientsField, getSenderField } from "../helpers/email";
import { Schema } from "../schema";
import { AddressList } from "aws-sdk/clients/ses";

export async function sendEmail(body: Schema, ses?: AWS.SES) {
  if (!ses) {
    throw new Error("SES client is not provided");
  }

  const recipients = getRecipientsField(body.to);
  const toAddresses = Array.isArray(recipients) ? recipients : [recipients];

  const params: SES.SendEmailRequest = {
    Source: getSenderField(body.from),
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Subject: {
        Data: body.subject,
      },
      Body: {
        ...(body.html && {
          Html: {
            Data: body.html,
          },
        }),
        ...(body.text && {
          Text: {
            Data: body.text,
          },
        }),
      },
    },
  };

  await ses.sendEmail(params).promise();
}
