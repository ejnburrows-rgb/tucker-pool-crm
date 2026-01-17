import type { LanguagePreference } from '@/types/database';

interface SMSTemplates {
  [key: string]: {
    en: string;
    es: string;
  };
}

export const smsTemplates: SMSTemplates = {
  payment_reminder_3day: {
    en: 'Hi! This is Tucker Pool Service. Your monthly service payment of ${amount} was due on {date}. Please Zelle payment to: {zelle}. Questions? Call us at {phone}. Thank you!',
    es: '¡Hola! Le saluda Tucker Pool Service. Su pago mensual de servicio de ${amount} venció el {date}. Por favor envíe el pago por Zelle a: {zelle}. ¿Preguntas? Llámenos al {phone}. ¡Gracias!',
  },
  work_reminder_7day: {
    en: 'Hi! Tucker Pool Service here. Friendly reminder: your invoice for {work_type} completed on {date} is ready. Amount due: ${amount}. Please Zelle to: {zelle}. Thank you!',
    es: '¡Hola! Le saluda Tucker Pool Service. Recordatorio: su factura por {work_type} completado el {date} está lista. Monto: ${amount}. Por favor envíe por Zelle a: {zelle}. ¡Gracias!',
  },
  appointment_confirmation: {
    en: 'Reminder from Tucker Pool Service! We are scheduled to visit tomorrow, {date} at {time} for {service_type}. Address: {address}. Please ensure gate access. Questions? {phone}',
    es: '¡Recordatorio de Tucker Pool Service! Visitaremos mañana, {date} a las {time} para {service_type}. Dirección: {address}. Asegure acceso al portón. ¿Preguntas? {phone}',
  },
};

export function getSMSTemplate(templateName: string, language: LanguagePreference): string {
  const template = smsTemplates[templateName];
  if (!template) {
    throw new Error(`SMS template "${templateName}" not found`);
  }
  return template[language] || template.en;
}

export function formatMessage(template: string, variables: Record<string, string | number>): string {
  let message = template;
  for (const [key, value] of Object.entries(variables)) {
    message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return message;
}
