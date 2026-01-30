// Re-export API utilities
export {
  fetchMediumPosts,
  type MediumPost,
  type MediumServiceConfig,
} from "./medium";

export {
  getResendClient,
  isResendConfigured,
  validateResendConfig,
  ResendConfigError,
  type ResendConfigValidation,
} from "./resend";

export {
  addToNewsletter,
  sendEmail,
  EmailServiceError,
  type AddToNewsletterParams,
  type AddToNewsletterResult,
  type SendEmailParams,
  type SendEmailResult,
} from "./email";
