import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { MOCK_LISTINGS, CATEGORIES } from '../data/mockListings'

const HERO_CATEGORIES = [
  { name: 'Electronics', emoji: '💻', color: '#e8f4fd' },
  { name: 'Fashion', emoji: '👗', color: '#fdf0f8' },
  { name: 'Collectibles', emoji: '🏆', color: '#fdf5e8' },
  { name: 'Home & Garden', emoji: '🏡', color: '#f0fdf4' },
  { name: 'Sporting Goods', emoji: '⚽', color: '#f0f8ff' },
  { name: 'Toys', emoji: '🎮', color: '#fff0f0' },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const endingSoon = MOCK_LISTINGS
    .filter(l => l.listingType === 'AUCTION' || l.listingType === 'BOTH')
    .sort((a, b) => new Date(a.auctionEndTime) - new Date(b.auctionEndTime))
    .slice(0, 4)

  const featured = MOCK_LISTINGS.filter(l => l.listingType === 'BUY_NOW').slice(0, 4)

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1>Find anything. Sell everything.</h1>
          <p>Millions of items available — bid, buy, or sell today</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`) }}
            className="hero-search"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for items..."
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* Category grid */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            {HERO_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
                style={{ backgroundColor: cat.color }}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ending soon */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">⏰ Ending Soon</h2>
            <Link to="/search?listingType=AUCTION" className="see-all">See all auctions →</Link>
          </div>
          <div className="product-grid">
            {endingSoon.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Buy Now deals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🏷️ Buy It Now</h2>
            <Link to="/search?listingType=BUY_NOW" className="see-all">See all →</Link>
          </div>
          <div className="product-grid">
            {featured.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="section sell-cta">
        <div className="container">
          <div className="sell-cta-inner">
            <div>
              <h2>Ready to sell?</h2>
              <p>List your first item in minutes — no listing fees for your first 250 items.</p>
            </div>
            <Link to="/create-listing" className="btn-primary btn-lg">Start selling</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
