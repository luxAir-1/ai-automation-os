'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { t } from '@/lib/i18n'
import { SocialButton } from './social-button'
import { Divider } from './divider'
import { AuthFooter } from './auth-footer'
import { GoogleIcon, AppleIcon, MicrosoftIcon, PhoneIcon } from './social-icons'

interface AuthCardProps {
  mode: 'login' | 'signup'
}

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // OAuth handler hooks — ready for integration
  async function handleOAuth(provider: 'google' | 'apple' | 'azure') {
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
    }
  }

  async function handlePhoneLogin() {
    // Placeholder for phone auth flow
    setError('Telefoonnummer login is binnenkort beschikbaar.')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      router.push('/dashboard')
      router.refresh()
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setSuccess(true)
      setLoading(false)
    }
  }

  // Success state for signup
  if (success) {
    return (
      <div className="mx-auto w-full max-w-[420px] px-4">
        <div
          className="
            rounded-2xl bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.08)]
            dark:bg-[#1a1a1a] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]
          "
        >
          {/* Success checkmark */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdf4] dark:bg-emerald-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-emerald-600 dark:text-emerald-400"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h2 className="text-center font-heading text-xl font-bold text-[#1a1a1a] dark:text-[#e5e5e5]">
            {t('checkEmail')}
          </h2>
          <p className="mt-3 text-center text-sm leading-relaxed text-[#666] dark:text-[#999]">
            {t('confirmationSent')}{' '}
            <strong className="font-medium text-[#1a1a1a] dark:text-[#e5e5e5]">{email}</strong>.
            <br />
            {t('clickToActivate')}
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="
                inline-flex items-center gap-1.5 text-sm font-medium text-[#0066cc]
                transition-colors hover:text-[#004d99] dark:text-[#4da3ff] dark:hover:text-[#80bfff]
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                  clipRule="evenodd"
                />
              </svg>
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[420px] px-4">
      <div
        className="
          rounded-2xl bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.08)]
          dark:bg-[#1a1a1a] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]
        "
        role="main"
        aria-label={mode === 'login' ? 'Login form' : 'Registration form'}
      >
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a] dark:bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-white dark:text-[#1a1a1a]"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-heading text-lg font-bold text-[#1a1a1a] dark:text-[#e5e5e5]">
              PropScout AI
            </span>
          </div>
        </div>

        {/* Email / Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {error && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/30 dark:bg-red-900/10 dark:text-red-400"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Full Name (signup only) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-[#1a1a1a] dark:text-[#e5e5e5]"
              >
                {t('fullName')}
              </label>
              <input
                id="fullName"
                type="text"
                placeholder={t('namePlaceholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                className="
                  w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3
                  text-sm text-[#1a1a1a] placeholder:text-[#bbb]
                  outline-none transition-all duration-200
                  focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/10
                  dark:border-[#333] dark:bg-[#111] dark:text-[#e5e5e5]
                  dark:placeholder:text-[#555] dark:focus:border-[#e5e5e5]
                  dark:focus:ring-[#e5e5e5]/10
                "
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1a1a1a] dark:text-[#e5e5e5]"
            >
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="
                w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3
                text-sm text-[#1a1a1a] placeholder:text-[#bbb]
                outline-none transition-all duration-200
                focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/10
                dark:border-[#333] dark:bg-[#111] dark:text-[#e5e5e5]
                dark:placeholder:text-[#555] dark:focus:border-[#e5e5e5]
                dark:focus:ring-[#e5e5e5]/10
              "
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#1a1a1a] dark:text-[#e5e5e5]"
            >
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="
                w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3
                text-sm text-[#1a1a1a] placeholder:text-[#bbb]
                outline-none transition-all duration-200
                focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/10
                dark:border-[#333] dark:bg-[#111] dark:text-[#e5e5e5]
                dark:placeholder:text-[#555] dark:focus:border-[#e5e5e5]
                dark:focus:ring-[#e5e5e5]/10
              "
            />
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-full bg-[#1a1a1a] px-6 py-3
              text-sm font-semibold text-white
              outline-none transition-all duration-200
              hover:bg-[#333] hover:shadow-md
              focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/50 focus-visible:ring-offset-2
              active:scale-[0.98]
              disabled:pointer-events-none disabled:opacity-50
              dark:bg-white dark:text-[#1a1a1a]
              dark:hover:bg-[#e5e5e5]
              dark:focus-visible:ring-white/50
            "
          >
            {loading
              ? mode === 'login'
                ? t('signingIn')
                : t('creatingAccount')
              : t('continue')}
          </button>
        </form>

        {/* Register / Login toggle */}
        <p className="mt-4 text-center text-sm text-[#666] dark:text-[#999]">
          {mode === 'login' ? t('noAccount') : t('hasAccount')}{' '}
          <Link
            href={mode === 'login' ? '/signup' : '/login'}
            className="font-medium text-[#0066cc] transition-colors hover:text-[#004d99] dark:text-[#4da3ff] dark:hover:text-[#80bfff]"
          >
            {mode === 'login' ? t('register') : t('login')}
          </Link>
        </p>

        {/* Divider */}
        <div className="my-6">
          <Divider text={t('or')} />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3" role="group" aria-label="Social login options">
          <SocialButton
            icon={<GoogleIcon />}
            label={t('continueWithGoogle')}
            onClick={() => handleOAuth('google')}
          />
          <SocialButton
            icon={<AppleIcon />}
            label={t('continueWithApple')}
            onClick={() => handleOAuth('apple')}
          />
          <SocialButton
            icon={<MicrosoftIcon />}
            label={t('continueWithMicrosoft')}
            onClick={() => handleOAuth('azure')}
          />
          <SocialButton
            icon={<PhoneIcon />}
            label={t('continueWithPhone')}
            onClick={handlePhoneLogin}
          />
        </div>

        {/* Footer */}
        <AuthFooter
          termsLabel={t('terms')}
          privacyLabel={t('privacy')}
        />
      </div>
    </div>
  )
}
