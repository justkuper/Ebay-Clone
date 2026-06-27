import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_LISTINGS } from '../data/mockListings'

export default function MyListings() {
  const { user } = useAuth()
  // In real app: filter by sellerId === user.userId via client.models.Listing.list(...)
  const [tab, setTab] = useState('ACTIVE')

  // Mock: show all listings as the user's for demo
  const listings = MOCK_LISTINGS.filter(l => tab === 'ALL' || l.status === tab)

  return (
    <div className="container my-listings">
      <div className="page-header">
        <h1>My listings</h1>
        <Link to="/create-listing" className="btn-primary">+ New listing</Link>
      </div>

      <div className="tab-bar">
        {['ACTIVE', 'SOLD', 'ENDED', 'ALL'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="empty-state">
          <p>No {tab.toLowerCase()} listings. <Link to="/create-listing">Create one →</Link></p>
        </div>
      ) : (
        <div className="listings-table">
          <div className="table-header">
            <span>Item</span>
            <span>Price</span>
            <span>Type</span>
            <span>Status</span>
            <span>Views</span>
            <span>Actions</span>
          </div>
          {listings.map(listing => (
            <div key={listing.id} className="table-row">
              <div className="table-item-cell">
                {listing.imageKeys?.[0]
                  ? <img src={listing.imageKeys[0]} alt="" className="table-thumb" />
                  : <div className="table-thumb-placeholder">📦</div>
                }
                <div>
                  <Link to={`/listing/${listing.id}`} className="table-title">{listing.title}</Link>
                  <p className="table-subtitle">{listing.condition?.replace('_', ' ')} · {listing.category}</p>
                </div>
              </div>
              <span className="table-cell">
                ${(listing.buyNowPrice || listing.currentBid || listing.startingBid)?.toFixed(2)}
              </span>
              <span className="table-cell">{listing.listingType?.replace('_', ' ')}</span>
              <span className={`badge-status status-${listing.status?.toLowerCase()}`}>{listing.status}</span>
              <span className="table-cell">{listing.views}</span>
              <div className="table-actions">
                <Link to={`/listing/${listing.id}`} className="action-link">View</Link>
                <button className="action-link danger">End</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
