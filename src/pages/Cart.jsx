import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="container empty-cart">
      <div className="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Add items from listings to get started.</p>
      <Link to="/" className="btn-primary">Shop now</Link>
    </div>
  )

  return (
    <div className="container cart-page">
      <h1>Shopping Cart <span>({items.length} item{items.length > 1 ? 's' : ''})</span></h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.imageKeys?.length > 0
                  ? <img src={item.imageKeys[0]} alt={item.title} />
                  : <div className="cart-img-placeholder">📦</div>
                }
              </div>
              <div className="cart-item-info">
                <Link to={`/listing/${item.id}`} className="cart-item-title">{item.title}</Link>
                <p className="cart-item-meta">{item.condition?.replace('_', ' ')} · {item.sellerName}</p>
                {item.shippingCost === 0 ? (
                  <p className="free-shipping">Free shipping</p>
                ) : (
                  <p className="cart-item-meta">+${item.shippingCost?.toFixed(2)} shipping</p>
                )}
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, item.cartQty - 1)}>−</button>
                  <span>{item.cartQty}</span>
                  <button onClick={() => updateQty(item.id, item.cartQty + 1)}>+</button>
                </div>
                <div className="cart-item-price">${(item.buyNowPrice * item.cartQty).toFixed(2)}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}

          <div className="cart-footer-actions">
            <button className="btn-secondary btn-sm" onClick={clearCart}>Clear cart</button>
          </div>
        </div>

        {/* Order summary */}
        <div className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{items.every(i => i.shippingCost === 0) ? 'Free' : 'Calculated at checkout'}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn-primary btn-lg full-width" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </button>
          <Link to="/" className="continue-shopping">← Continue shopping</Link>
        </div>
      </div>
    </div>
  )
}
