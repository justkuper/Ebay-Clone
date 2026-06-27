import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [shipping, setShipping] = useState({
    firstName: user?.attributes?.given_name || '',
    lastName: user?.attributes?.family_name || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  })

  const [payment, setPayment] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: '',
  })

  const [errors, setErrors] = useState({})

  function updateShipping(k, v) { setShipping(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  function updatePayment(k, v) { setPayment(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  function validateShipping() {
    const e = {}
    if (!shipping.firstName) e.firstName = 'Required'
    if (!shipping.lastName) e.lastName = 'Required'
    if (!shipping.address) e.address = 'Required'
    if (!shipping.city) e.city = 'Required'
    if (!shipping.state) e.state = 'Required'
    if (!shipping.zip) e.zip = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validatePayment() {
    const e = {}
    if (!payment.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) e.cardNumber = 'Invalid card number'
    if (!payment.nameOnCard) e.nameOnCard = 'Required'
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Use MM/YY format'
    if (!payment.cvv.match(/^\d{3,4}$/)) e.cvv = 'Invalid CVV'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (step === 0 && !validateShipping()) return
    if (step === 1 && !validatePayment()) return
    setStep(s => s + 1)
  }

  async function placeOrder() {
    setLoading(true)
    try {
      // Real: create Order records, update listing status, send confirmation email
      await new Promise(r => setTimeout(r, 1500))
      const id = `ORD-${Date.now()}`
      setOrderId(id)
      clearCart()
      setOrderComplete(true)
    } catch {
      setErrors({ submit: 'Order failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (orderComplete) return (
    <div className="container success-screen">
      <div className="success-icon">🎉</div>
      <h2>Order placed!</h2>
      <p>Order <strong>{orderId}</strong> has been confirmed.</p>
      <p>You'll receive a confirmation email at {user?.attributes?.email || user?.username}.</p>
      <div className="success-actions">
        <Link to="/my-orders" className="btn-primary">View my orders</Link>
        <Link to="/" className="btn-secondary">Keep shopping</Link>
      </div>
    </div>
  )

  if (items.length === 0) return (
    <div className="container empty-cart">
      <h2>Your cart is empty</h2>
      <Link to="/" className="btn-primary">Shop now</Link>
    </div>
  )

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <div className="step-dot">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-card">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="form-section">
              <h2>Shipping address</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First name</label>
                  <input value={shipping.firstName} onChange={e => updateShipping('firstName', e.target.value)} />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input value={shipping.lastName} onChange={e => updateShipping('lastName', e.target.value)} />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Street address</label>
                <input value={shipping.address} onChange={e => updateShipping('address', e.target.value)} placeholder="123 Main St" />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input value={shipping.city} onChange={e => updateShipping('city', e.target.value)} />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input value={shipping.state} onChange={e => updateShipping('state', e.target.value)} maxLength={2} placeholder="CA" />
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label>ZIP code</label>
                  <input value={shipping.zip} onChange={e => updateShipping('zip', e.target.value)} placeholder="90210" />
                  {errors.zip && <span className="form-error">{errors.zip}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input type="tel" value={shipping.phone} onChange={e => updateShipping('phone', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="form-section">
              <h2>Payment details</h2>
              <div className="payment-note">🔒 Your payment info is encrypted and secure</div>
              <div className="form-group">
                <label>Card number</label>
                <input
                  value={payment.cardNumber}
                  onChange={e => updatePayment('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
              </div>
              <div className="form-group">
                <label>Name on card</label>
                <input value={payment.nameOnCard} onChange={e => updatePayment('nameOnCard', e.target.value)} />
                {errors.nameOnCard && <span className="form-error">{errors.nameOnCard}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry</label>
                  <input
                    value={payment.expiry}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '')
                      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4)
                      updatePayment('expiry', v)
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="password" value={payment.cvv} onChange={e => updatePayment('cvv', e.target.value.replace(/\D/g, ''))} maxLength={4} placeholder="•••" />
                  {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="form-section">
              <h2>Review order</h2>
              <div className="review-shipping">
                <h3>Shipping to</h3>
                <p>{shipping.firstName} {shipping.lastName}</p>
                <p>{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
              </div>
              <div className="review-items">
                <h3>Items</h3>
                {items.map(item => (
                  <div key={item.id} className="review-line-item">
                    <span>{item.title} × {item.cartQty}</span>
                    <span>${(item.buyNowPrice * item.cartQty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {errors.submit && <p className="form-error">{errors.submit}</p>}
            </div>
          )}

          <div className="form-nav">
            {step > 0 && <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
            {step < 2
              ? <button className="btn-primary" onClick={next}>Next →</button>
              : <button className="btn-primary btn-lg" onClick={placeOrder} disabled={loading}>
                  {loading ? 'Processing…' : `Place order · $${total.toFixed(2)}`}
                </button>
            }
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="cart-summary">
          <h2>Order summary</h2>
          {items.map(item => (
            <div key={item.id} className="summary-line">
              <span>{item.title.slice(0, 30)}{item.title.length > 30 ? '…' : ''} ×{item.cartQty}</span>
              <span>${(item.buyNowPrice * item.cartQty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
