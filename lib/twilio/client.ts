import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSMS(to: string, body: string): Promise<void> {
  if (!client) {
    console.warn('Twilio client not configured. SMS not sent.');
    return;
  }

  if (!twilioPhoneNumber) {
    throw new Error('TWILIO_PHONE_NUMBER is not configured');
  }

  const formattedPhone = formatPhoneNumber(to);

  await client.messages.create({
    body,
    from: twilioPhoneNumber,
    to: formattedPhone,
  });
}

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
}
