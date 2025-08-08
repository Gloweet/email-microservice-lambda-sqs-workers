import "aws-lambda";

declare namespace NodeJS {
  interface ProcessEnv {
    EMAIL_SERVICE: string;
    RESEND_API_KEY: string;
    FROM_NAME: string;
    FROM_EMAIL: string;
    ALLOWED_SENDERS: string;
    RESEND_SECRET_NAME: string;
  }
}

declare module "aws-lambda" {
  interface S3EventRecord {
    body?: string; // or string, depending on your usage
  }
}
