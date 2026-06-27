import { useState } from 'react'
import { Link } from 'react-router-dom'

const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    listingTitle: 'Apple MacBook Pro 14" M3 Pro',
    listingImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=60&fit=crop',
    price: 1799.99,
    shippingCost: 0,
    status: 'SHIPPED',
    trackingNumber: '1Z999AA10123456784',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    sellerId: 'seller1',
  },
  {
    id: 'ORD-002',
    listingTitle: 'KitchenAid Stand Mixer 5Qt Professional',
    listingImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&h=60&fit=crop',
    price: 249.99,
    shippingCost: 24.99,
    status: 'DELIVERED',
    trackingNumber: '9400111899223408527',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    sellerId: 'seller5',
  },
]

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  PAID: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
  REFUNDED: '#6b7280',
}

export default function MyOrders() {
  const [tab, setTab] = useState('buying')

  return (
    <div className="container my-orders">
      <h1>My orders</h1>

      <div className="tab-bar">
        <button className={`tab ${tab === 'buying' ? 'active' : ''}`} onClick={() => setTab('buying')}>Buying</button>
        <button className={`tab ${tab === 'selling' ? 'active' : ''}`} onClick={() => setTab('selling')}>Selling</button>
      </div>

      {MOCK_ORDERS.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet. <Link to="/">Start shopping →</Link></p>
        </div>
      ) : (
        <div className="orders-list">
          {MOCK_ORDERS.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">{order.id}</span>
                <span
                  className="order-status"
                  style={{ color: STATUS_COLORS[order.status] }}
                >
                  {order.status}
                </span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="order-card-body">
                {order.listingImage && <img src={order.listingImage} alt="" className="order-img" />}
                <div className="order-info">
                  <p className="order-title">{order.listingTitle}</p>
                  <p className="order-price">
                    ${order.price.toFixed(2)}
                    {order.shippingCost > 0 && <span> + ${order.shippingCost.toFixed(2)} shipping</span>}
                  </p>
                  {order.trackingNumber && (
                    <p className="tracking">📦 Tracking: <code>{order.trackingNumber}</code></p>
                  )}
                </div>
              </div>
              <div className="order-card-footer">
                {order.status === 'DELIVERED' && (
                  <button className="btn-secondary btn-sm">Leave feedback</button>
                )}
                {order.status === 'PENDING' && (
                  <button className="btn-danger btn-sm">Cancel order</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
