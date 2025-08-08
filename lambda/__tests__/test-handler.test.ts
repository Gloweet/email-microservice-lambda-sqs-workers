import type {
  SQSEvent,
  SQSMessageAttributes,
  SQSRecordAttributes,
} from "aws-lambda";
import { handler } from "../src";
import type { Schema } from "../src/schema";
import { v4 as uuidv4 } from "uuid";

describe("Unit test for app handler", function () {
  it("sends text email", async () => {
    const emails: Schema[] = [
      {
        to: { email: "YOUR_EMAIL@gmail.com" },
        subject: "Test Email",
        text: "This is a test email.",
      },
    ];

    const events = getSQSEvents(emails);

    const result = await handler(events, {} as any, () => {});

    // Add assertions here to verify the email was sent correctly
  });
});

const getSQSEvents = (emails: Schema[]): SQSEvent => {
  const attributes: SQSRecordAttributes = {
    ApproximateReceiveCount: "0",
    SentTimestamp: "1630456800000",
    SenderId: "",
    ApproximateFirstReceiveTimestamp: "1630456800000",
  };
  const messageAttributes: SQSMessageAttributes = {
    dummy: {
      dataType: "String",
      stringValue: "dummy",
    },
  };
  const event: SQSEvent = {
    Records: emails.map((email) => ({
      messageId: uuidv4(),
      receiptHandle: "",
      attributes,
      messageAttributes,
      md5OfBody: "",
      md5OfMessageAttributes: "",
      eventSource: "",
      eventSourceARN: "",
      awsRegion: "eu-west-3",
      body: JSON.stringify(email),
    })),
  };
  return event;
};
