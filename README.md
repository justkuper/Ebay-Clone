# eBay Clone — React + AWS Amplify

A full-featured eBay-style marketplace built with React (Vite) and AWS Amplify Gen 2.

## Features

- **Auth** — Sign up / sign in with email (AWS Cognito)
- **Listings** — Create, browse, filter, and search listings with images
- **Auctions** — Real-time bidding with countdown timers
- **Buy Now** — Fixed-price purchases
- **Cart & Checkout** — Multi-step checkout with order management
- **Profile** — User dashboard, my listings, my orders

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router v6 |
| Build tool | Vite |
| Backend | AWS Amplify Gen 2 (AppSync GraphQL) |
| Auth | Amazon Cognito |
| Database | Amazon DynamoDB (via AppSync) |
| Storage | Amazon S3 (listing images) |

## Quick Start

### 1. Install dependencies

```bash
cd "Ebay Clone"
npm install
```

### 2. Configure AWS Amplify backend

You need an AWS account. Install the Amplify CLI if you haven't:

```bash
npm install -g @aws-amplify/backend-cli
```

Start a sandbox (deploys your backend to AWS):

```bash
npx ampx sandbox
```

This generates `amplify_outputs.json` in the project root.

### 3. Connect the frontend to Amplify

Uncomment these lines in `src/main.jsx`:

```js
import outputs from '../amplify_outputs.json'
import { Amplify } from 'aws-amplify'
Amplify.configure(outputs)
```

Then uncomment the real Amplify API calls in `src/context/AuthContext.jsx` (replace the mock localStorage auth).

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173

## Project Structure

```
Ebay Clone/
├── amplify/
│   ├── backend.ts          # Amplify backend definition
│   ├── auth/resource.ts    # Cognito config
│   ├── data/resource.ts    # GraphQL schema (Listing, Bid, Order, Review, WatchList)
│   └── storage/resource.ts # S3 buckets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── BidModal.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx  # Auth state + login/register/logout
│   │   └── CartContext.jsx  # Cart state (localStorage)
│   ├── data/
│   │   └── mockListings.js  # Demo data (replace with Amplify queries)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── SearchResults.jsx
│   │   ├── CreateListing.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── AuthPage.jsx
│   │   ├── Profile.jsx
│   │   ├── MyListings.jsx
│   │   └── MyOrders.jsx
│   ├── styles/index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Connecting Real Amplify Data

Each page has comments showing the real Amplify call alongside the mock. Example in `ProductDetail.jsx`:

```js
// Real:
// const { data } = await client.models.Listing.get({ id })
// Mock:
const found = MOCK_LISTINGS.find(l => l.id === id)
```

To wire up real data:

1. Run `npx ampx sandbox` to deploy the backend
2. Import and initialize the Amplify client:

```js
import { generateClient } from 'aws-amplify/data'
const client = generateClient()
```

3. Replace mock calls with `client.models.*` calls

## GraphQL Data Models

- **Listing** — title, description, category, condition, listingType (AUCTION/BUY_NOW/BOTH), pricing, images, seller, status, auctionEndTime
- **Bid** — listingId, bidderId, amount, status (ACTIVE/OUTBID/WON)
- **Order** — listingId, buyerId, sellerId, price, shippingAddress, status, trackingNumber
- **Review** — sellerId, reviewerId, orderId, rating, comment
- **WatchList** — userId, listingId

## Deploying to Production

```bash
# Deploy to AWS Amplify Hosting
npx ampx pipeline-deploy --branch main --app-id YOUR_APP_ID
```

Or connect your GitHub repo in the [Amplify Console](https://console.aws.amazon.com/amplify).
