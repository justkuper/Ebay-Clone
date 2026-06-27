import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    firstName: user?.attributes?.given_name || '',
    lastName: user?.attributes?.family_name || '',
    email: user?.attributes?.email || user?.username || '',
    bio: '',
    location: '',
  })

  async function handleSave(e) {
    e.preventDefault()
    // Real: await updateUserAttributes({ userAttributes: { given_name: form.firstName, ... } })
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <div className="avatar-circle">
          {(form.firstName?.[0] || '?').toUpperCase()}
        </div>
        <div>
          <h1>{form.firstName} {form.lastName}</h1>
          <p className="profile-email">{form.email}</p>
          <p className="member-since">Member since {new Date().getFullYear()}</p>
        </div>
      </div>

      {saved && <div className="alert alert-success">Profile updated successfully!</div>}

      <div className="profile-grid">
        {/* Profile form */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Personal information</h2>
            {!editing && <button className="btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit</button>}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First name</label>
                  <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} disabled />
                <span className="form-hint">Email cannot be changed here</span>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Tell buyers about yourself..." />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="City, State" />
              </div>
              <div className="form-nav">
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save changes</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-row"><span>Name</span><span>{form.firstName} {form.lastName}</span></div>
              <div className="info-row"><span>Email</span><span>{form.email}</span></div>
              <div className="info-row"><span>Location</span><span>{form.location || '—'}</span></div>
              <div className="info-row"><span>Bio</span><span>{form.bio || '—'}</span></div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <div className="profile-card profile-links">
            <h2>My activity</h2>
            <Link to="/my-listings" className="profile-link-item">
              <span>📦</span>
              <div>
                <strong>My listings</strong>
                <p>Manage your active and sold listings</p>
              </div>
              <span>→</span>
            </Link>
            <Link to="/my-orders" className="profile-link-item">
              <span>🛍️</span>
              <div>
                <strong>My orders</strong>
                <p>Track purchases and sales</p>
              </div>
              <span>→</span>
            </Link>
            <Link to="/cart" className="profile-link-item">
              <span>🛒</span>
              <div>
                <strong>Shopping cart</strong>
                <p>View and manage your cart</p>
              </div>
              <span>→</span>
            </Link>
          </div>

          <div className="profile-card" style={{ marginTop: '1rem' }}>
            <h2>Account</h2>
            <button className="btn-danger full-width" onClick={logout}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  )
}
