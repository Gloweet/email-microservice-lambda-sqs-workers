import { Logger } from "workers-loki-logger";
import {
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";

type Bindings = {
  AWS_SQS_ACCESS_KEY_ID: string;
  AWS_SQS_SECRET_ACCESS_KEY: string;
  AWS_SQS_REGION: string;
  AWS_SQS_QUEUE_URL: string;
  LOKI_SECRET: string;
  LOKI_URL: string;
  ENVIRONMENT: string;
};

function getLogger(context: ExecutionContext, env: Bindings) {
  return new Logger({
    cloudflareContext: context,
    lokiSecret: env.LOKI_SECRET,
    lokiUrl: env.LOKI_URL || "https://logs-prod-eu-west-0.grafana.net",
    stream: {
      worker: "newsletter-worker",
      environment: env.ENVIRONMENT,
    },
  });
}

async function handleSendEmail(
  req: Request,
  env: Bindings,
  ctx: ExecutionContext,
  logger: Logger,
): Promise<Response> {
  const sqsClient = new SQSClient({
    region: env.AWS_SQS_REGION,
    credentials: {
      accessKeyId: env.AWS_SQS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SQS_SECRET_ACCESS_KEY,
    },
  });

  const parsedBody = await req.json();

  const command = new SendMessageCommand({
    QueueUrl: env.AWS_SQS_QUEUE_URL,
    MessageBody: JSON.stringify(parsedBody),
  });

  console.log(`Sending email to SQS: ${JSON.stringify(command)}`);

  const result = await sqsClient.send(command);
  return result.$metadata.httpStatusCode === 200
    ? new Response("Email queued in SQS")
    : Response.json({
        status: 500,
        message: "Failed to queue email in SQS",
        requestId: result.$metadata.requestId,
      });
}


export default {
  async fetch(
    req: Request,
    env: Bindings,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const logger = getLogger(ctx, env);
    logger.mdcSet("requestUrl", req.url);

    try {
      const url = new URL(req.url);

      // Send email directly on POST request
      if (req.method === "POST" && url.pathname === "/send-email") {
        return handleSendEmail(req, env, ctx, logger);
      }

      logger.error(
        "Route not found",
        new Error(`Route ${req.method} ${url.pathname} not found`),
      );
      return new Response("Not found", { status: 404 });
    } catch (error) {
      logger.error("Caught error", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      await logger.flush();
    }
  }
}
