// i18n localization structure — ready for multi-language support
// Default language: Dutch (Netherlands)

export type Locale = 'nl' | 'en'

export const defaultLocale: Locale = 'nl'

const translations = {
  nl: {
    auth: {
      continue: 'Doorgaan',
      noAccount: 'Heb je nog geen account?',
      register: 'Registreren',
      hasAccount: 'Heb je al een account?',
      login: 'Inloggen',
      or: 'OF',
      continueWithGoogle: 'Doorgaan met Google',
      continueWithApple: 'Doorgaan met Apple',
      continueWithMicrosoft: 'Doorgaan met Microsoft',
      continueWithPhone: 'Doorgaan met telefoonnummer',
      terms: 'Gebruiksvoorwaarden',
      privacy: 'Privacybeleid',
      email: 'E-mailadres',
      password: 'Wachtwoord',
      fullName: 'Volledige naam',
      emailPlaceholder: 'naam@voorbeeld.nl',
      passwordPlaceholder: 'Min. 6 tekens',
      namePlaceholder: 'Jan Jansen',
      signingIn: 'Bezig met inloggen...',
      creatingAccount: 'Account aanmaken...',
      createAccount: 'Account aanmaken',
      checkEmail: 'Controleer je e-mail',
      confirmationSent: 'We hebben een bevestigingslink gestuurd naar',
      clickToActivate: 'Klik op de link om je account te activeren.',
      backToLogin: 'Terug naar inloggen',
    },
  },
  en: {
    auth: {
      continue: 'Continue',
      noAccount: "Don't have an account?",
      register: 'Register',
      hasAccount: 'Already have an account?',
      login: 'Log in',
      or: 'OR',
      continueWithGoogle: 'Continue with Google',
      continueWithApple: 'Continue with Apple',
      continueWithMicrosoft: 'Continue with Microsoft',
      continueWithPhone: 'Continue with phone number',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      email: 'Email address',
      password: 'Password',
      fullName: 'Full name',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'Min. 6 characters',
      namePlaceholder: 'John Doe',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      createAccount: 'Create account',
      checkEmail: 'Check your email',
      confirmationSent: 'We sent a confirmation link to',
      clickToActivate: 'Click the link to activate your account.',
      backToLogin: 'Back to login',
    },
  },
} as const

export type TranslationKey = keyof typeof translations.nl.auth

export function t(key: TranslationKey, locale: Locale = defaultLocale): string {
  return translations[locale]?.auth?.[key] ?? translations.nl.auth[key]
}

export function useTranslations(locale: Locale = defaultLocale) {
  return {
    t: (key: TranslationKey) => t(key, locale),
    locale,
  }
}
