import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Listing: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      category: a.string().required(),
      condition: a.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
      listingType: a.enum(['AUCTION', 'BUY_NOW', 'BOTH']),
      buyNowPrice: a.float(),
      startingBid: a.float(),
      currentBid: a.float(),
      imageKeys: a.string().array(),
      sellerId: a.string().required(),
      sellerName: a.string().required(),
      status: a.enum(['ACTIVE', 'SOLD', 'ENDED', 'DRAFT']),
      auctionEndTime: a.datetime(),
      quantity: a.integer(),
      location: a.string(),
      shippingCost: a.float(),
      views: a.integer().default(0),
      bids: a.hasMany('Bid', 'listingId'),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.guest().to(['read']),
    ]),

  Bid: a
    .model({
      listingId: a.id().required(),
      listing: a.belongsTo('Listing', 'listingId'),
      bidderId: a.string().required(),
      bidderName: a.string().required(),
      amount: a.float().required(),
      status: a.enum(['ACTIVE', 'OUTBID', 'WON', 'CANCELLED']),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  Order: a
    .model({
      listingId: a.id().required(),
      listingTitle: a.string().required(),
      listingImage: a.string(),
      buyerId: a.string().required(),
      sellerId: a.string().required(),
      price: a.float().required(),
      shippingCost: a.float(),
      status: a.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
      shippingAddress: a.json(),
      trackingNumber: a.string(),
      paymentIntentId: a.string(),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'update', 'delete', 'read']),
      allow.authenticated().to(['read']),
    ]),

  Review: a
    .model({
      sellerId: a.string().required(),
      reviewerId: a.string().required(),
      reviewerName: a.string().required(),
      orderId: a.id().required(),
      rating: a.integer().required(),
      comment: a.string(),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.guest().to(['read']),
    ]),

  WatchList: a
    .model({
      userId: a.string().required(),
      listingId: a.id().required(),
      listingTitle: a.string().required(),
      listingImage: a.string(),
      currentPrice: a.float(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationConfig: {
      expiresInDays: 30,
    },
  },
});
