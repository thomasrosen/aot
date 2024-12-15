import { createTransport, Transporter } from "nodemailer";
import { sendObjectHistoryVerificationEmail } from "./sendObjectHistoryVerificationEmail";
// import SMTPTransport from "nodemailer/lib/smtp-transport";

interface Theme {
  brandColor?: string;
  buttonText?: string;
}

interface SendVerificationRequestParams {
  identifier: string;
  url: string;
  provider: any;
  // provider: {
  //   server?: SMTPTransport | SMTPTransport.Options | string;
  //   from?: string;
  // };
  theme: Theme;
  request: Request;
}

export async function sendVerificationRequest(
  params: SendVerificationRequestParams
): Promise<void> {
  const cloned_request = params.request.clone(); // clone to use the orginal again
  const bodyData = await cloned_request.json();
  if (bodyData?.is_object_history_verify_request === "true") {
    // send different emails for object history verification
    return await sendObjectHistoryVerificationEmail(params);
  }

  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  try {
    // NOTE: You are not required to use `nodemailer`, use whatever you want.
    const transport: Transporter = createTransport(provider.server);

    const result = await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Sign in to Inventory`,
      text: text({ url, host }),
      html: html({ url, host, theme }),
    });
    const failed = result.rejected.concat(result.pending).filter(Boolean);

    if (failed.length) {
      throw new Error(
        `ERROR_SOnEdiZO Email(s) (${failed.join(", ")}) could not be sent`
      );
    }
  } catch (error) {
    console.error("ERROR_PLjlgJnq email send error:", error);
  }
}

function html({ url }: { url: string; host: string; theme: Theme }): string {
  return `<html>
  <head>
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 240 10% 3.9%;
      --primary: 240 5.9% 10%;
      --primary-foreground: 0 0% 98%;
      --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%;
      --accent: 240 4.8% 95.9%;
      --accent-foreground: 240 5.9% 10%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 5.9% 90%;
      --input: 240 5.9% 90%;
      --ring: 240 5.9% 10%;
      --radius: 1rem;
    }
  
    @media (prefers-color-scheme: dark) {
      :root {
        --background: 240 10% 3.9%;
        --foreground: 0 0% 98%;
        --card: 240 10% 3.9%;
        --card-foreground: 0 0% 98%;
        --popover: 240 10% 3.9%;
        --popover-foreground: 0 0% 98%;
        --primary: 0 0% 98%;
        --primary-foreground: 240 5.9% 10%;
        --secondary: 240 3.7% 15.9%;
        --secondary-foreground: 0 0% 98%;
        --muted: 240 3.7% 15.9%;
        --muted-foreground: 240 5% 64.9%;
        --accent: 240 3.7% 15.9%;
        --accent-foreground: 0 0% 98%;
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 0 0% 98%;
        --border: 240 3.7% 15.9%;
        --input: 240 3.7% 15.9%;
        --ring: 240 4.9% 83.9%;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    a:hover {
      opacity: 0.8;
    }
  </style>
  </head>
    <body style="background-color: hsl(var(--background)); font-family: Ubuntu, Arial, Helvetica, sans-serif; margin: 0; padding: 40px 10px;">
      <main style="border: 1px solid hsl(var(--border)); width: 500px; max-width: 100%; margin: 0 auto; padding: 20px; border-radius: 1rem; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);">
        <!-- Title Section -->
        <div style="margin-bottom: 20px;">
          <h1 style="color: hsl(var(--foreground)); font-size: 32px; font-weight: bold; margin: 0; text-align: left;">
            Inventory
          </h1>
        </div>

        <!-- Greeting Section -->
        <h2 style="color: hsl(var(--foreground)); font-size: 22px; margin-bottom: 5px; text-align: left;">
          Hi there! Welcome back to <strong>Inventory</strong> ☺️
        </h2>

        <!-- Message Section -->
        <p style="color: hsl(var(--muted-foreground)); font-size: 14px; line-height: 1.5; margin-bottom: 20px; text-align: left;">
          Click the button below to securely sign in.
        </p>

        <!-- Call-to-Action Section -->
        <a href="${url}" target="_blank" style="
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          font-size: 18px;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          display: inline-block;
          font-weight: 600;
          margin-bottom: 20px;
        ">
          Sign in
        </a>
        <p style="color: hsl(var(--muted-foreground)); font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
          Or copy and paste this link into your browser:
          <a href="${url}" target="_blank" style="display: block; color: hsl(var(--primary)); text-decoration: none;">${url}</a>
        </p>
  
        <!-- Footer Section -->
        <hr style="border: 0; border-top: 1px solid hsl(var(--border)); margin-bottom: 20px;">
        <p style="color: hsl(var(--muted-foreground)); font-size: 14px; line-height: 1.5; margin: 0; text-align: left;">
          If you did not request this email, you can safely ignore it. For support, reach out to us at <a href="mailto:${process.env.CONTACT_EMAIL}" style="color: hsl(var(--primary)); text-decoration: none;">${process.env.CONTACT_EMAIL}</a>.
        </p>
      </main>
    </body>
  </html>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text(params: { url: string; host: string }): string {
  const { url, host } = params;
  return `Hi there! Welcome back to Inventory ☺️

Click the link below to securely sign in:
${url}

---

If you did not request this email, you can safely ignore it.
For support, reach out to us at ${process.env.CONTACT_EMAIL}.
`;
}
