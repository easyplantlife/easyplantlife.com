export { sendContactMessage, subscribeToNewsletter } from "./forms";
export type { ContactMessage } from "./forms";
export {
  getResendClient,
  isResendConfigured,
  validateResendConfig,
  ResendConfigError,
} from "./resend";
export type { ResendConfigValidation } from "./resend";
export { addToNewsletter, sendEmail, EmailServiceError } from "./email";
export type {
  AddToNewsletterParams,
  AddToNewsletterResult,
  SendEmailParams,
  SendEmailResult,
} from "./email";
