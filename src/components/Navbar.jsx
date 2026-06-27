import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-logo">
          <span className="logo-e">e</span>
          <span className="logo-bay">Bay</span>
          <span className="logo-clone"> Clone</span>
        </Link>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything"
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="navbar-actions">
          {user ? (
            <>
              <div className="user-menu-wrapper">
                <button className="user-menu-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                  Hi, {user.attributes?.given_name || user.username?.split('@')[0]}
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                    <Link to="/my-listings" onClick={() => setMenuOpen(false)}>My Listings</Link>
                    <Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                    <button onClick={handleLogout}>Sign Out</button>
                  </div>
                )}
              </div>
              <Link to="/create-listing" className="btn-primary btn-sm">+ Sell</Link>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className="nav-link">Sign In</Link>
              <Link to="/auth?mode=register" className="nav-link">Register</Link>
            </>
          )}
          <Link to="/cart" className="cart-btn">
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>
      </div>

      <nav className="navbar-categories">
        {['Electronics', 'Fashion', 'Motors', 'Collectibles', 'Home & Garden', 'Sporting Goods', 'Toys', 'Business'].map((cat) => (
          <Link key={cat} to={`/search?category=${encodeURIComponent(cat)}`} className="category-link">
            {cat}
          </Link>
        ))}
      </nav>
    </header>
  )
}
