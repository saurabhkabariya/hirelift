# Subscription Payment Field Tracking Fix

## Problem
The subscription payment verification was setting `isPremium: true` but not properly tracking the subscription-specific fields (`proPlanType`, `purchaseDate`, `expiryDate`), leading to null values in the database for subscription users.

## Solution Implemented

### 1. Fixed Payment Verification Route (`/api/payment/verify`)
Updated the route to properly set subscription tracking fields when verifying subscription payments:

```javascript
// Update user premium status immediately with proper subscription tracking
const now = new Date();
const updatedUser = await User.findByIdAndUpdate(
  user._id,
  {
    isPremium: true,
    proPlanType: 'subscription', // Mark as subscription-based premium
    purchaseDate: now, // Track when subscription was activated
    expiryDate: null, // Subscriptions don't have fixed expiry (managed by webhooks)
    updatedAt: now
  },
  { new: true }
);
```

### 2. Updated Webhook Handlers
Enhanced all relevant webhook handlers to maintain consistent subscription field tracking:

#### Subscription Activated (`handleSubscriptionActivated`)
- Sets `proPlanType: 'subscription'`
- Sets `purchaseDate` to current date
- Sets `expiryDate: null` (managed by webhooks)

#### Subscription Charged (`handleSubscriptionCharged`)
- Ensures `proPlanType: 'subscription'` is always set
- Maintains `expiryDate: null`
- Keeps user premium status active

#### Subscription Resumed (`handleSubscriptionResumed`)
- Restores subscription tracking fields when subscription is reactivated
- Sets proper `proPlanType` and clears fixed expiry

#### Subscription Cancelled (`handleSubscriptionCancelled`)
- Clears subscription fields when premium status is revoked:
  - `isPremium: false`
  - `proPlanType: null`
  - `expiryDate: null`

### 3. Database Schema Fields
The User model properly tracks subscription information:

```javascript
proPlanType: {
  type: String,
  enum: ['subscription', 'onetime'],
  default: null,
},
purchaseDate: {
  type: Date,
  default: null,
},
expiryDate: {
  type: Date,
  default: null,
},
```

## Field Meanings for Subscription Users

- **`isPremium: true`** - User has active premium access
- **`proPlanType: 'subscription'`** - Premium access is subscription-based
- **`purchaseDate`** - When the subscription was first activated
- **`expiryDate: null`** - Subscriptions don't have fixed expiry, managed by webhook events

## Field Meanings for One-Time Payment Users

- **`isPremium: true`** - User has active premium access
- **`proPlanType: 'onetime'`** - Premium access is from one-time payment
- **`purchaseDate`** - When the one-time payment was made
- **`expiryDate`** - When the one-time access expires (set by cron job)

## Migration Script

Created `fix-subscription-fields.js` to update any existing users missing proper subscription tracking:

```bash
node fix-subscription-fields.js
```

This script:
1. Finds premium users missing subscription fields
2. Checks if they have subscriptions or payment records
3. Updates fields appropriately based on payment type
4. Provides summary of current user distribution

## Testing Scripts

### Check Current State
```bash
node test-subscription-fields.js
```

### Debug Subscription Flow
```bash
node debug-subscription-payment.js
```

## Key Benefits

1. **Robust Tracking** - All subscription users now have proper field tracking
2. **Database Accuracy** - Clear distinction between subscription and one-time users
3. **Consistent Updates** - All webhook events maintain field consistency
4. **Easy Monitoring** - Can easily query users by plan type
5. **Audit Trail** - Purchase dates tracked for all premium users

## Files Modified

1. `app/api/payment/verify/route.js` - Fixed subscription verification
2. `app/api/webhook/route.js` - Updated all webhook handlers
3. `fix-subscription-fields.js` - Migration script for existing users
4. `test-subscription-fields.js` - Testing script for verification

## Verification Queries

### Find all subscription users:
```javascript
const subscriptionUsers = await User.find({
  isPremium: true,
  proPlanType: 'subscription'
});
```

### Find users missing tracking fields:
```javascript
const missingFields = await User.find({
  isPremium: true,
  $or: [
    { proPlanType: null },
    { purchaseDate: null }
  ]
});
```

### Count users by plan type:
```javascript
const subscriptionCount = await User.countDocuments({
  isPremium: true,
  proPlanType: 'subscription'
});

const oneTimeCount = await User.countDocuments({
  isPremium: true,
  proPlanType: 'onetime'
});
```

This fix ensures robust and accurate tracking of all premium users regardless of their payment method, providing a solid foundation for subscription management and analytics.
