import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES, CONDITIONS } from '../data/mockListings'

const STEPS = ['Details', 'Pricing', 'Shipping', 'Review']

export default function CreateListing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'GOOD',
    listingType: 'BUY_NOW',
    buyNowPrice: '',
    startingBid: '',
    auctionDays: '7',
    quantity: '1',
    shippingCost: '0',
    location: '',
    imageUrls: '',
  })

  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validateStep() {
    const e = {}
    if (step === 0) {
      if (!form.title.trim()) e.title = 'Title is required'
      if (!form.description.trim()) e.description = 'Description is required'
      if (!form.category) e.category = 'Category is required'
    }
    if (step === 1) {
      if (form.listingType !== 'AUCTION' && !form.buyNowPrice) e.buyNowPrice = 'Price is required'
      if (form.listingType !== 'BUY_NOW' && !form.startingBid) e.startingBid = 'Starting bid is required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() { if (validateStep()) setStep(s => s + 1) }
  function back() { setStep(s => s - 1) }

  async function submit() {
    setLoading(true)
    try {
      // Real:
      // const auctionEndTime = form.listingType !== 'BUY_NOW'
      //   ? new Date(Date.now() + parseInt(form.auctionDays) * 86400000).toISOString() : null
      // await client.models.Listing.create({ ...form, sellerId: user.userId, sellerName: ..., status: 'ACTIVE', currentBid: parseFloat(form.startingBid), auctionEndTime })
      await new Promise(r => setTimeout(r, 1000))
      setSuccess(true)
      setTimeout(() => navigate('/my-listings'), 2000)
    } catch {
      setErrors({ submit: 'Failed to create listing. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="container success-screen">
      <div className="success-icon">✅</div>
      <h2>Listing created!</h2>
      <p>Redirecting to your listings…</p>
    </div>
  )

  return (
    <div className="create-listing container">
      <h1>Create a listing</h1>

      {/* Stepper */}
      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <div className="step-dot">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="listing-form-card">
        {/* Step 0: Details */}
        {step === 0 && (
          <div className="form-section">
            <h2>Item details</h2>
            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Describe your item (80 chars max)" maxLength={80} />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={5} placeholder="Describe condition, features, what's included..." />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => update('category', e.target.value)}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select value={form.condition} onChange={e => update('condition', e.target.value)}>
                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Image URLs (one per line)</label>
              <textarea value={form.imageUrls} onChange={e => update('imageUrls', e.target.value)} rows={3} placeholder="https://..." />
              <span className="form-hint">Paste image URLs, one per line. After Amplify setup, images can be uploaded directly.</span>
            </div>
          </div>
        )}

        {/* Step 1: Pricing */}
        {step === 1 && (
          <div className="form-section">
            <h2>Pricing & listing type</h2>
            <div className="form-group">
              <label>Listing type</label>
              <div className="radio-group">
                {[['BUY_NOW', 'Buy it now', 'Set a fixed price'], ['AUCTION', 'Auction', 'Let buyers bid'], ['BOTH', 'Both', 'Fixed price + accept bids']].map(([v, l, d]) => (
                  <label key={v} className={`radio-card ${form.listingType === v ? 'selected' : ''}`}>
                    <input type="radio" value={v} checked={form.listingType === v} onChange={e => update('listingType', e.target.value)} />
                    <div>
                      <strong>{l}</strong>
                      <span>{d}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {(form.listingType === 'BUY_NOW' || form.listingType === 'BOTH') && (
              <div className="form-group">
                <label>Buy it now price ($) *</label>
                <input type="number" step="0.01" min="0.01" value={form.buyNowPrice} onChange={e => update('buyNowPrice', e.target.value)} placeholder="0.00" />
                {errors.buyNowPrice && <span className="form-error">{errors.buyNowPrice}</span>}
              </div>
            )}
            {(form.listingType === 'AUCTION' || form.listingType === 'BOTH') && (
              <>
                <div className="form-group">
                  <label>Starting bid ($) *</label>
                  <input type="number" step="0.01" min="0.01" value={form.startingBid} onChange={e => update('startingBid', e.target.value)} placeholder="0.00" />
                  {errors.startingBid && <span className="form-error">{errors.startingBid}</span>}
                </div>
                <div className="form-group">
                  <label>Auction duration</label>
                  <select value={form.auctionDays} onChange={e => update('auctionDays', e.target.value)}>
                    {[1, 3, 5, 7, 10, 14].map(d => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </>
            )}
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" min="1" value={form.quantity} onChange={e => update('quantity', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 2: Shipping */}
        {step === 2 && (
          <div className="form-section">
            <h2>Shipping & location</h2>
            <div className="form-group">
              <label>Shipping cost ($)</label>
              <input type="number" step="0.01" min="0" value={form.shippingCost} onChange={e => update('shippingCost', e.target.value)} />
              <span className="form-hint">Enter 0 for free shipping</span>
            </div>
            <div className="form-group">
              <label>Item location</label>
              <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="City, State" />
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="form-section">
            <h2>Review your listing</h2>
            <div className="review-grid">
              <div className="review-item"><span>Title</span><strong>{form.title}</strong></div>
              <div className="review-item"><span>Category</span><strong>{form.category}</strong></div>
              <div className="review-item"><span>Condition</span><strong>{form.condition?.replace('_', ' ')}</strong></div>
              <div className="review-item"><span>Listing type</span><strong>{form.listingType?.replace('_', ' ')}</strong></div>
              {form.buyNowPrice && <div className="review-item"><span>Buy now price</span><strong>${parseFloat(form.buyNowPrice).toFixed(2)}</strong></div>}
              {form.startingBid && <div className="review-item"><span>Starting bid</span><strong>${parseFloat(form.startingBid).toFixed(2)}</strong></div>}
              <div className="review-item"><span>Shipping</span><strong>{form.shippingCost === '0' ? 'Free' : `$${parseFloat(form.shippingCost).toFixed(2)}`}</strong></div>
              <div className="review-item"><span>Location</span><strong>{form.location || '—'}</strong></div>
            </div>
            {errors.submit && <p className="form-error">{errors.submit}</p>}
          </div>
        )}

        {/* Nav */}
        <div className="form-nav">
          {step > 0 && <button className="btn-secondary" onClick={back}>← Back</button>}
          {step < STEPS.length - 1
            ? <button className="btn-primary" onClick={next}>Next →</button>
            : <button className="btn-primary" onClick={submit} disabled={loading}>
                {loading ? 'Publishing…' : 'Publish listing'}
              </button>
          }
        </div>
      </div>
    </div>
  )
}
