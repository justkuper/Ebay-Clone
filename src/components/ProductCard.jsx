import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ listing }) {
  const { addToCart } = useCart()

  const price = listing.listingType === 'AUCTION'
    ? listing.currentBid || listing.startingBid
    : listing.buyNowPrice

  const label = listing.listingType === 'AUCTION' ? 'Current bid' : 'Buy it now'
  const isAuction = listing.listingType === 'AUCTION' || listing.listingType === 'BOTH'
  const hasPlaceholderImg = !listing.imageKeys || listing.imageKeys.length === 0

  return (
    <div className="product-card">
      <Link to={`/listing/${listing.id}`} className="product-card-image-wrap">
        {hasPlaceholderImg ? (
          <div className="product-card-placeholder">
            <span>📦</span>
          </div>
        ) : (
          <img src={listing.imageKeys[0]} alt={listing.title} className="product-card-img" />
        )}
        {listing.status === 'SOLD' && <div className="sold-badge">SOLD</div>}
      </Link>

      <div className="product-card-body">
        <Link to={`/listing/${listing.id}`} className="product-card-title">
          {listing.title}
        </Link>

        <div className="product-card-meta">
          <span className="product-card-condition">{listing.condition?.replace('_', ' ')}</span>
          {listing.shippingCost === 0
            ? <span className="free-shipping">Free shipping</span>
            : listing.shippingCost
              ? <span className="shipping-cost">+${listing.shippingCost.toFixed(2)} shipping</span>
              : null}
        </div>

        <div className="product-card-price-row">
          <div>
            <div className="price-label">{label}</div>
            <div className="price-value">${price?.toFixed(2) || '—'}</div>
          </div>
          {isAuction && listing.auctionEndTime && (
            <div className="auction-timer">
              <AuctionCountdown endTime={listing.auctionEndTime} />
            </div>
          )}
        </div>

        <div className="product-card-actions">
          {listing.listingType !== 'AUCTION' && listing.status !== 'SOLD' && (
            <button
              className="btn-primary btn-sm full-width"
              onClick={(e) => { e.preventDefault(); addToCart(listing) }}
            >
              Add to cart
            </button>
          )}
          {isAuction && listing.status !== 'SOLD' && (
            <Link to={`/listing/${listing.id}`} className="btn-secondary btn-sm full-width">
              Place bid
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function AuctionCountdown({ endTime }) {
  const end = new Date(endTime)
  const now = new Date()
  const diff = end - now

  if (diff <= 0) return <span className="ended">Ended</span>

  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const d = Math.floor(diff / 86400000)

  if (d > 1) return <span>{d}d left</span>
  if (h > 0) return <span className="ending-soon">{h}h {m}m left</span>
  return <span className="ending-very-soon">{m}m left</span>
}
