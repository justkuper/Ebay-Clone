import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <h4>Buy</h4>
            <ul>
              <li><Link to="/search">Browse listings</Link></li>
              <li><Link to="/search?listingType=AUCTION">Auctions</Link></li>
              <li><Link to="/cart">Shopping cart</Link></li>
              <li><Link to="/my-orders">Purchase history</Link></li>
            </ul>
          </div>
          <div>
            <h4>Sell</h4>
            <ul>
              <li><Link to="/create-listing">Create listing</Link></li>
              <li><Link to="/my-listings">My listings</Link></li>
              <li><Link to="/my-orders">Seller hub</Link></li>
            </ul>
          </div>
          <div>
            <h4>Categories</h4>
            <ul>
              {['Electronics', 'Fashion', 'Motors', 'Collectibles', 'Home & Garden'].map((c) => (
                <li key={c}><Link to={`/search?category=${encodeURIComponent(c)}`}>{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><a href="#">About eBay Clone</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">User Agreement</a></li>
              <li><a href="#">Contact us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} eBay Clone — Built with React & AWS Amplify</p>
        </div>
      </div>
    </footer>
  )
}
