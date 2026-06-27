import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function BidModal({ listing, onClose, onBidPlaced }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const minBid = (listing.currentBid || listing.startingBid || 0) + 0.50
  const [amount, setAmount] = useState(minBid.toFixed(2))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleBid(e) {
    e.preventDefault()
    if (!user) { navigate('/auth?mode=login'); return }
    const val = parseFloat(amount)
    if (isNaN(val) || val < minBid) {
      setError(`Minimum bid is $${minBid.toFixed(2)}`)
      return
    }
    setLoading(true)
    setError('')
    try {
      // Real: await client.models.Bid.create({ listingId: listing.id, bidderId: user.userId, bidderName: ..., amount: val, status: 'ACTIVE' })
      // Also update listing.currentBid
      // Mock:
      await new Promise(r => setTimeout(r, 800))
      onBidPlaced(val)
      onClose()
    } catch (err) {
      setError('Failed to place bid. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Place a Bid</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-listing-title">{listing.title}</p>

          <div className="bid-info">
            <div>
              <span className="bid-info-label">Current bid</span>
              <span className="bid-info-value">${(listing.currentBid || listing.startingBid)?.toFixed(2)}</span>
            </div>
            <div>
              <span className="bid-info-label">Minimum bid</span>
              <span className="bid-info-value">${minBid.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleBid}>
            <label className="form-label">Your maximum bid (USD)</label>
            <div className="bid-input-wrapper">
              <span className="bid-currency">$</span>
              <input
                type="number"
                step="0.01"
                min={minBid}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bid-input"
                autoFocus
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <p className="bid-note">
              By placing a bid, you agree to buy this item if you win.
            </p>
            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Placing bid…' : 'Place bid'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
