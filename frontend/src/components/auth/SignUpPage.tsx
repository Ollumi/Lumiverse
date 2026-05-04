import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion, LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { useStore } from '@/store'
import styles from './LoginPage.module.css'
import clsx from 'clsx'

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const signup = useStore((s) => s.signup)
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await signup(username.trim(), password, name.trim() || undefined)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Sign-up failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!focused) return
    const scrollFocusedInput = () => {
      formRef.current?.querySelector(`#signup-${focused}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
    const timers = [100, 350, 650].map((delay) => setTimeout(scrollFocusedInput, delay))
    window.visualViewport?.addEventListener('resize', scrollFocusedInput)

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      window.visualViewport?.removeEventListener('resize', scrollFocusedInput)
    }
  }, [focused])

  const canSubmit = username.trim().length > 0 && password.length > 0 && confirmPassword.length > 0

  return (
    <LazyMotion features={domAnimation} strict={false}>
    <MotionConfig reducedMotion="user">
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={clsx(styles.bgGlow, styles.bgGlow1)} />
        <div className={clsx(styles.bgGlow, styles.bgGlow2)} />
        <div className={clsx(styles.bgGlow, styles.bgGlow3)} />
      </div>

      <div className={styles.grid} />

      <div className={styles.content}>
        <motion.div
          className={styles.logoBlock}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.logoIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="36" height="36">
              <g transform="rotate(-12, 32, 32)">
                <ellipse cx="32" cy="12" rx="18" ry="6" fill="#8B5A2B" />
                <ellipse cx="32" cy="12" rx="14" ry="4" fill="#A0522D" />
                <rect x="14" y="12" width="36" height="40" fill="#8B5FC7" />
                <line x1="14" y1="18" x2="50" y2="18" stroke="#7A4EB8" strokeWidth="1.5" />
                <line x1="14" y1="24" x2="50" y2="24" stroke="#7A4EB8" strokeWidth="1.5" />
                <line x1="14" y1="30" x2="50" y2="30" stroke="#7A4EB8" strokeWidth="1.5" />
                <line x1="14" y1="36" x2="50" y2="36" stroke="#7A4EB8" strokeWidth="1.5" />
                <line x1="14" y1="42" x2="50" y2="42" stroke="#7A4EB8" strokeWidth="1.5" />
                <line x1="14" y1="48" x2="50" y2="48" stroke="#7A4EB8" strokeWidth="1.5" />
                <rect x="14" y="12" width="8" height="40" fill="#A78BD4" opacity="0.5" />
                <ellipse cx="32" cy="52" rx="18" ry="6" fill="#8B5A2B" />
                <rect x="14" y="48" width="36" height="4" fill="#8B5FC7" />
                <ellipse cx="32" cy="52" rx="14" ry="4" fill="#A0522D" />
                <ellipse cx="32" cy="52" rx="5" ry="2" fill="#5D3A1A" />
                <path d="M 48 35 Q 55 38 52 45 Q 49 52 56 58" fill="none" stroke="#8B5FC7" strokeWidth="2" strokeLinecap="round" />
              </g>
            </svg>
          </div>
          <h1 className={styles.logoTitle}>Lumiverse</h1>
          <p className={styles.logoSubtitle}>Create your account</p>
        </motion.div>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.cardHighlight} />

          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <motion.div
              className={styles.field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label className={styles.label} htmlFor="signup-username">Username</label>
              <div className={clsx(styles.inputWrap, focused === 'username' && styles.inputWrapFocused)}>
                <input
                  id="signup-username"
                  name="username"
                  className={styles.input}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoFocus
                  spellCheck={false}
                  enterKeyHint="next"
                  placeholder="Choose a username"
                />
              </div>
            </motion.div>

            <motion.div
              className={styles.field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <label className={styles.label} htmlFor="signup-name">Display name <span className={styles.optionalTag}>(optional)</span></label>
              <div className={clsx(styles.inputWrap, focused === 'name' && styles.inputWrapFocused)}>
                <input
                  id="signup-name"
                  name="name"
                  className={styles.input}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  autoComplete="name"
                  enterKeyHint="next"
                  placeholder="Your display name"
                />
              </div>
            </motion.div>

            <motion.div
              className={styles.field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label className={styles.label} htmlFor="signup-password">Password</label>
              <div className={clsx(styles.inputWrap, focused === 'password' && styles.inputWrapFocused)}>
                <input
                  id="signup-password"
                  name="password"
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  enterKeyHint="next"
                  placeholder="At least 8 characters"
                />
              </div>
            </motion.div>

            <motion.div
              className={styles.field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <label className={styles.label} htmlFor="signup-confirm">Confirm password</label>
              <div className={clsx(styles.inputWrap, focused === 'confirm' && styles.inputWrapFocused)}>
                <input
                  id="signup-confirm"
                  name="confirm"
                  className={styles.input}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  enterKeyHint="done"
                  placeholder="Re-enter your password"
                />
              </div>
            </motion.div>

            {error && (
              <motion.div
                className={styles.error}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.errorInner}>{error}</div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !canSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              {loading ? (
                <span className={styles.loadingState}>
                  <span className={styles.spinner} />
                  Creating account
                </span>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Already have an account?{' '}
          <button type="button" className={styles.link} onClick={() => navigate('/login')}>
            Sign in
          </button>
        </motion.p>
      </div>
    </div>
    </MotionConfig>
    </LazyMotion>
  )
}
