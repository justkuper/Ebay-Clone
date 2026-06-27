import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [params] = useSearchParams()
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const redirect = params.get('redirect') || '/'
  const [mode, setMode] = useState(params.get('mode') || 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', confirm: '' })
  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError('') }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (mode === 'register' && form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.email, form.password, form.firstName, form.lastName)
      }
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="logo-e">e</span><span className="logo-bay">Bay</span><span className="logo-clone"> Clone</span>
        </Link>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Sign in</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-row">
              <div className="form-group">
                <label>First name</label>
                <input required value={form.firstName} onChange={e => update('firstName', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input required value={form.lastName} onChange={e => update('lastName', e.target.value)} />
              </div>
            </div>
          )}
          <div className="form-group">
            <label>Email address</label>
            <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={form.password} onChange={e => update('password', e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </div>
          {mode === 'register' && (
            <div className="form-group">
              <label>Confirm password</label>
              <input type="password" required value={form.confirm} onChange={e => update('confirm', e.target.value)} />
            </div>
          )}

          {error && <div className="form-error-box">{error}</div>}

          <button type="submit" className="btn-primary btn-lg full-width" disabled={loading}>
            {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign in' : 'Create account')}
          </button>

          {mode === 'login' && (
            <p className="auth-switch">
              Don't have an account?{' '}
              <button type="button" onClick={() => setMode('register')}>Register</button>
            </p>
          )}
        </form>

        <p className="auth-terms">
          By continuing, you agree to our <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
