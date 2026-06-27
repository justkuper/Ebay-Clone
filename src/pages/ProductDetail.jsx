import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import BidModal from '../components/BidModal'
import { MOCK_LISTINGS } from '../data/mockListings'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [showBidModal, setShowBidModal] = useState(false)
  const [bidSuccess, setBidSuccess] = useState(null)
  const [watching, setWatching] = useState(false)

  useEffect(() => {
    // Real: const { data } = await client.models.Listing.get({ id })
    const found = MOCK_LISTINGS.find(l => l.id === id)
    setListing(found || null)
    setLoading(false)
  }, [id])

  function handleBidPlaced(amount) {
    setBidSuccess(amount)
    setListing(prev => ({ ...prev, currentBid: amount }))
  }

  if (loading) return <div className="page-loading">Loading listing…</div>
  if (!listing) return (
    <div className="not-found">
      <h2>Listing not found</h2>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  )

  const isAuction = listing.listingType === 'AUCTION' || listing.listingType === 'BOTH'
  const isBuyNow = listing.listingType === 'BUY_NOW' || listing.listingType === 'BOTH'
  const currentPrice = isAuction ? (listing.currentBid || listing.startingBid) : listing.buyNowPrice

  return (
    <div className="product-detail container">
      {bidSuccess && (
        <div className="alert alert-success">
          🎉 Bid of <strong>${bidSuccess.toFixed(2)}</strong> placed successfully! You're the highest bidder.
          <button onClick={() => setBidSuccess(null)}>✕</button>
        </div>
      )}

      <div className="product-detail-grid">
        {/* Images */}
        <div className="product-detail-images">
          <div className="main-image-wrap">
            {listing.imageKeys?.length > 0 ? (
              <img src={listing.imageKeys[activeImg]} alt={listing.title} className="main-image" />
            ) : (
              <div className="image-placeholder-lg"><span>📦</span></div>
            )}
          </div>
          {listing.imageKeys?.length > 1 && (
            <div className="thumbnail-row">
              {listing.imageKeys.map((key, i) => (
                <button
                  key={i}
                  className={`thumbnail ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={key} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <div className="listing-badges">
            <span className={`badge badge-condition`}>{listing.condition?.replace('_', ' ')}</span>
            <span className={`badge badge-type`}>{listing.listingType?.replace('_', ' ')}</span>
          </div>

          <h1 className="detail-title">{listing.title}</h1>

          <div className="detail-stats">
            <span>{listing.views} views</span>
            <span>·</span>
            <span>Listed by <Link to={`/search?seller=${listing.sellerId}`}>{listing.sellerName}</Link></span>
            <span>·</span>
            <span>{listing.location}</span>
          </div>

          <div className="detail-price-box">
            {isAuction && (
              <div className="price-row">
                <span className="price-label">Current bid</span>
                <span className="price-big">${currentPrice?.toFixed(2)}</span>
              </div>
            )}
            {isBuyNow && (
              <div className="price-row">
                <span className="price-label">Buy it now</span>
                <span className="price-big">${listing.buyNowPrice?.toFixed(2)}</span>
              </div>
            )}
            {listing.shippingCost === 0 ? (
              <p className="shipping-note">✅ Free shipping</p>
            ) : (
              <p className="shipping-note">+ ${listing.shippingCost?.toFixed(2)} shipping</p>
            )}
            {isAuction && listing.auctionEndTime && (
              <div className="auction-end-note">
                Ends: {new Date(listing.auctionEndTime).toLocaleString()}
              </div>
            )}
          </div>

          {listing.status === 'ACTIVE' ? (
            <div className="detail-actions">
              {isBuyNow && (
                <>
                  <button
                    className="btn-primary btn-lg full-width"
                    onClick={() => { addToCart(listing); navigate('/cart') }}
                  >
                    Buy it now
                  </button>
                  <button
                    className="btn-secondary btn-lg full-width"
                    onClick={() => addToCart(listing)}
                  >
                    Add to cart
                  </button>
                </>
              )}
              {isAuction && (
                <button
                  className="btn-bid btn-lg full-width"
                  onClick={() => user ? setShowBidModal(true) : navigate('/auth?mode=login')}
                >
                  Place bid — ${((listing.currentBid || listing.startingBid || 0) + 0.5).toFixed(2)} or more
                </button>
              )}
              <button
                className={`btn-watch full-width ${watching ? 'watching' : ''}`}
                onClick={() => setWatching(!watching)}
              >
                {watching ? '❤️ Watching' : '🤍 Add to watchlist'}
              </button>
            </div>
          ) : (
            <div className="sold-notice">This item has been sold or the auction has ended.</div>
          )}

          <div className="detail-meta-list">
            <div className="meta-row"><span>Condition</span><span>{listing.condition?.replace('_', ' ')}</span></div>
            <div className="meta-row"><span>Category</span><span>{listing.category}</span></div>
            {listing.quantity && <div className="meta-row"><span>Quantity</span><span>{listing.quantity}</span></div>}
            <div className="meta-row"><span>Location</span><span>{listing.location}</span></div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="detail-description">
        <h2>Item description</h2>
        <p>{listing.description}</p>
      </div>

      {showBidModal && (
        <BidModal
          listing={listing}
          onClose={() => setShowBidModal(false)}
          onBidPlaced={handleBidPlaced}
        />
      )}
    </div>
  )
}
