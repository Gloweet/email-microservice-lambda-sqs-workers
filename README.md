# Notification microservice based on AWS Lambda

This project is a notification microservice based on AWS Lambda.
- Can be used from any Node.js and V8 Isolate backend using `@aws-sdk/client-sqs` (see an example in [Cloudflare Workers](./worker/src/index.ts)).
- Supports multiple email APIs: **Resend** and **Amazon SES**.
- If using **Cloudflare Workers**, you can use the `worker-email-microservice` based on `@aws-sdk/client-sqs`.
  Any other worker can make an HTTP call to `worker-email-microservice`'s binding to send an email:
  ```typescript
  const res = await context.cloudflare.env.NOTIFICATION.fetch(
      new Request(`https://dummy/send-email`, {
        method: "POST",
        body: JSON.stringify({
          to: {
            name: `${firstName} ${lastName}`,
            email: email,
          },
          subject: `${subject}`,
          txt,
          html,
        }),
        headers: { "Content-Type": "application/json" },
      })
    );

    if (!res.ok) {
      const errorData = await res.json();
      return Response.json(
        {
          success: false,
          error: errorData.message || "Failed to send email",
        },
        {
          status: res.status,
        }
      );
    }
  ```

Enjoy using this project! I hope you'll find it useful.

# Open to contributions
- Please submit a pull request with your changes.

Feel free to add new features or fix bugs, e.g:
- New email API: Brevo (SendInBlue), Maielrtrap, Mailgun, SendGrid.
- Add an example remix.run application with a contact form and the security measures implemented.

That would be greatly appreciated!

# License
- MIT License

# Contributing
- Please submit a pull request with your changes.

# Contributors
- [PheonBest](https://github.com/PheonBest)
