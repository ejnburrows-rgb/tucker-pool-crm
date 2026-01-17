import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions): Promise<void> {
  if (!resend) {
    console.warn('Resend client not configured. Email not sent.');
    return;
  }

  await resend.emails.send({
    from: from || 'Tucker Pool Service <noreply@tuckerps.com>',
    to,
    subject,
    html,
  });
}
