import { useSearchParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { MOCK_LISTINGS, CATEGORIES, CONDITIONS } from '../data/mockListings'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const listingTypeParam = searchParams.get('listingType') || ''

  const [sortBy, setSortBy] = useState('relevant')
  const [filterCategory, setFilterCategory] = useState(categoryParam)
  const [filterCondition, setFilterCondition] = useState('')
  const [filterType, setFilterType] = useState(listingTypeParam)
  const [maxPrice, setMaxPrice] = useState('')

  const results = useMemo(() => {
    let list = [...MOCK_LISTINGS]
    if (query) list = list.filter(l => l.title.toLowerCase().includes(query.toLowerCase()) || l.description.toLowerCase().includes(query.toLowerCase()))
    if (filterCategory) list = list.filter(l => l.category === filterCategory)
    if (filterCondition) list = list.filter(l => l.condition === filterCondition)
    if (filterType) list = list.filter(l => l.listingType === filterType || l.listingType === 'BOTH')
    if (maxPrice) list = list.filter(l => (l.buyNowPrice || l.currentBid || l.startingBid || 0) <= parseFloat(maxPrice))

    switch (sortBy) {
      case 'price_asc': return list.sort((a, b) => (a.buyNowPrice || a.currentBid || 0) - (b.buyNowPrice || b.currentBid || 0))
      case 'price_desc': return list.sort((a, b) => (b.buyNowPrice || b.currentBid || 0) - (a.buyNowPrice || a.currentBid || 0))
      case 'ending': return list.filter(l => l.auctionEndTime).sort((a, b) => new Date(a.auctionEndTime) - new Date(b.auctionEndTime))
      case 'newest': return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      default: return list
    }
  }, [query, filterCategory, filterCondition, filterType, maxPrice, sortBy])

  return (
    <div className="search-page container">
      <div className="search-header">
        <h1>
          {query ? `Results for "${query}"` : filterCategory || 'All listings'}
          <span className="result-count"> ({results.length} results)</span>
        </h1>
      </div>

      <div className="search-layout">
        {/* Sidebar filters */}
        <aside className="search-filters">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Condition</label>
            <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
              <option value="">Any condition</option>
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Listing type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All types</option>
              <option value="AUCTION">Auction</option>
              <option value="BUY_NOW">Buy it now</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Max price ($)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 500"
              min="0"
            />
          </div>

          <button
            className="btn-secondary btn-sm full-width"
            onClick={() => { setFilterCategory(''); setFilterCondition(''); setFilterType(''); setMaxPrice('') }}
          >
            Clear filters
          </button>
        </aside>

        {/* Results */}
        <div className="search-results">
          <div className="results-toolbar">
            <span>{results.length} items</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="relevant">Best match</option>
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="ending">Ending soonest</option>
            </select>
          </div>

          {results.length === 0 ? (
            <div className="empty-results">
              <p>No items match your search. Try different keywords or filters.</p>
            </div>
          ) : (
            <div className="product-grid">
              {results.map(listing => <ProductCard key={listing.id} listing={listing} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
