import type { SQSEvent, SQSHandler } from "aws-lambda";
import { Resend } from "resend";
import { Schema, schema } from "./schema";
import { ValidationError } from "yup";
import * as AWS from "aws-sdk";
import { sendEmail as sendResendEmail } from "./send/resend";
import { sendEmail as sendAmazonSESEmail } from "./send/amazonSES";
import { SQSBatchResponse } from "aws-lambda";

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

async function getResendApiKey(): Promise<string> {
  const client = new SecretsManagerClient({});
  const command = new GetSecretValueCommand({
    SecretId: process.env.RESEND_SECRET_NAME,
  });
  const response = await client.send(command);
  if (!response.SecretString) {
    throw new Error("Resend API key not found");
  }
  return response.SecretString;
}

export const handler: SQSHandler = async (event: SQSEvent) => {
  const emailService = process.env.EMAIL_SERVICE || "resend";
  const allowedSenderEmails = (
    process.env.ALLOWED_SENDERS || "contact@example.com"
  ).split(",");
  const resend =
    emailService === "resend" ? new Resend(await getResendApiKey()) : undefined;
  const ses = emailService === "amazon-ses" ? new AWS.SES() : undefined;

  const failedRecords: SQSBatchResponse["batchItemFailures"] = [];
  for (const record of event.Records) {
    try {
      if (!record.body) {
        throw new Error("Invalid input");
      }
      const body = JSON.parse(record.body);
      await validateBodyAsync(body);

      // Validate sender email if provided
      if (body.from_email && !allowedSenderEmails.includes(body.from_email)) {
        throw new Error(
          `Sender email ${body.from_email} is not allowed. Allowed emails: ${allowedSenderEmails.join(", ")}`,
        );
      }

      switch (emailService) {
        case "resend":
          await sendResendEmail(body, resend);
          break;
        case "amazon-ses":
          await sendAmazonSESEmail(body, ses);
          break;
        default:
          throw new Error(`Invalid email service: ${emailService}`);
      }
    } catch (err) {
      console.error(err);
      failedRecords.push({
        itemIdentifier: record.messageId,
      });
    }
  }

  if (failedRecords.length > 0) {
    return {
      batchItemFailures: failedRecords,
    };
  }
};

export const validateBodyAsync = async (body: any): Promise<Schema> => {
  try {
    await schema.validate(body, {
      strict: true,
    });
    return body as Schema;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new Error(`Invalid body: ${error.message}`);
    }
    throw error;
  }
};
