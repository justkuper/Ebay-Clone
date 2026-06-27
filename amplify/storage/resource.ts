import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'ebayCloneStorage',
  access: (allow) => ({
    'listing-images/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
    ],
    'profile-images/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
    ],
  }),
});
