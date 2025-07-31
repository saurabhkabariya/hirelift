# HireLift Razorpay Subscription Integration

A complete, production-ready Razorpay subscription payment integration for the HireLift SaaS application built with Next.js, MongoDB, and Razorpay.

## 🌟 Features

- ✅ **Complete Subscription Management**: Create, pause, resume, and cancel subscriptions
- ✅ **Secure Webhook Handling**: Verify Razorpay signatures for webhook events
- ✅ **JWT Authentication**: Secure API routes with JSON Web Tokens
- ✅ **MongoDB Integration**: Store subscription data with comprehensive models
- ✅ **Premium User Management**: Automatically update user premium status
- ✅ **Production Ready**: Error handling, logging, and validation
- ✅ **Modular Architecture**: Clean, maintainable code structure

## 🏗️ Architecture

```
├── models/
│   ├── User.js              # User model with premium status
│   └── Subscription.js      # Subscription model with Razorpay data
├── lib/
│   ├── razorpay.js         # Razorpay service with all methods
│   ├── auth.js             # JWT authentication middleware
│   └── mongodb.js          # MongoDB connection
├── app/api/
│   ├── subscribe/          # Main subscription endpoints
│   ├── webhook/            # Razorpay webhook handler
│   ├── subscription/       # Pause/resume endpoints
│   └── plans/              # Available plans endpoint
└── scripts/
    └── test-razorpay-subscription.js  # Testing script
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install razorpay jsonwebtoken mongoose
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# JWT Configuration  
JWT_SECRET=your_super_secret_jwt_key_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hirelift
```

### 3. Create Razorpay Plans

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Subscriptions** → **Plans**
3. Create your subscription plans
4. Note down the Plan IDs for your application

### 4. Setup Webhooks

1. In Razorpay Dashboard → **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/webhook`
3. Select events:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.completed`
   - `subscription.paused`
   - `subscription.resumed`   - `payment.failed`

## 🧪 Frontend Testing

### Quick Browser Test
1. Open your application at `http://localhost:3000/pricing`
2. Open developer console (F12)
3. Check for Razorpay SDK loading
4. Test payment flow with logged-in user

### Manual Testing Flow
1. **Prerequisites:**
   - User must be logged in
   - User must not have premium subscription
   - Environment variables set correctly

2. **Test Payment:**
   - Click "Upgrade to Pro" button
   - Should see loading modal
   - Should open Razorpay checkout
   - Use test cards: `4111111111111111` (success)

3. **Verify:**
   - Check webhook logs
   - Verify user premium status
   - Confirm redirect to dashboard

## 📡 API Endpoints

### Authentication

All subscription endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Subscription Management

#### Create Subscription
```http
POST /api/subscribe
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "planId": "plan_XXXXXXXXXXXXXXXX",
  "totalCount": 12,
  "quantity": 1,
  "customerName": "John Doe",
  "customerContact": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "objectId",
    "razorpaySubscriptionId": "sub_XXXXXXXXXXXXXXXX",
    "status": "created",
    "startAt": "2025-07-30T12:00:00.000Z",
    "endAt": "2026-07-30T12:00:00.000Z"
  },
  "paymentOptions": {
    "key": "rzp_test_XXXXXXXXXXXXXXXX",
    "subscription_id": "sub_XXXXXXXXXXXXXXXX",
    "name": "HireLift",
    "description": "Pro Monthly Subscription"
  }
}
```

#### Get Subscription Details
```http
GET /api/subscribe
Authorization: Bearer <jwt_token>
```

#### Cancel Subscription
```http
DELETE /api/subscribe?cancel_at_cycle_end=true
Authorization: Bearer <jwt_token>
```

#### Pause Subscription
```http
POST /api/subscription/pause
Authorization: Bearer <jwt_token>
```

#### Resume Subscription
```http
POST /api/subscription/resume
Authorization: Bearer <jwt_token>
```

### Plans

#### Get Available Plans
```http
GET /api/plans
```

#### Get Specific Plan
```http
GET /api/plans?id=plan_XXXXXXXXXXXXXXXX
```

### Webhooks

```http
POST /api/webhook
Content-Type: application/json
x-razorpay-signature: <razorpay_signature>

{
  "event": "subscription.activated",
  "payload": {
    "subscription": {
      "id": "sub_XXXXXXXXXXXXXXXX",
      "status": "active",
      // ... other subscription data
    }
  }
}
```

## 🔧 Frontend Integration

### Razorpay Checkout Integration

```javascript
// Install Razorpay on frontend
// npm install razorpay

// Create subscription and get payment options
const createSubscription = async (planId) => {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ planId })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Initialize Razorpay checkout
    const options = {
      ...data.paymentOptions,
      handler: function(response) {
        // Payment successful
        console.log('Payment successful:', response);
        // Handle success (redirect, show success message, etc.)
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  }
};
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscribe', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (planId) => {
    // Implementation as shown above
  };

  const cancelSubscription = async () => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchSubscription(); // Refresh subscription data
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    loading,
    createSubscription,
    cancelSubscription,
    refetch: fetchSubscription
  };
};
```

## 🧪 Testing

### Run Test Suite

```bash
# Update the test script with your plan ID
# Edit scripts/test-razorpay-subscription.js and set TEST_PLAN_ID

node scripts/test-razorpay-subscription.js
```

### Manual Testing

1. **Create subscription** via API endpoint
2. **Check Razorpay Dashboard** for subscription creation
3. **Simulate webhook** using test script
4. **Verify database** for subscription updates
5. **Test cancellation** flow

## 📊 Database Schema

### Subscription Model

```javascript
{
  userId: ObjectId,                    // Reference to User
  razorpaySubscriptionId: String,      // Razorpay subscription ID
  razorpayCustomerId: String,          // Razorpay customer ID
  razorpayPlanId: String,              // Razorpay plan ID
  status: String,                      // active, pending, canceled, etc.
  startAt: Date,                       // Subscription start date
  endAt: Date,                         // Subscription end date
  planDetails: {
    name: String,                      // Plan name
    amount: Number,                    // Plan amount in paise
    currency: String,                  // Currency (INR)
    period: String,                    // monthly, yearly, etc.
    interval: Number                   // Interval count
  },
  totalCount: Number,                  // Total payment cycles
  paidCount: Number,                   // Completed payments
  remainingCount: Number,              // Remaining payments
  lastWebhookEvent: {
    eventId: String,                   // Last webhook event ID
    eventType: String,                 // Event type
    eventTime: Date                    // Event timestamp
  },
  cancelledAt: Date,                   // Cancellation date
  cancelReason: String,                // Cancellation reason
  createdAt: Date,                     // Auto-generated
  updatedAt: Date                      // Auto-generated
}
```

## 🛡️ Security Features

- **Webhook Signature Verification**: All webhooks are verified using HMAC-SHA256
- **JWT Authentication**: Secure API endpoints with JSON Web Tokens
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Graceful error handling without exposing sensitive data
- **Rate Limiting**: (Can be added) Prevent abuse of API endpoints

## 🚨 Error Handling

The integration includes comprehensive error handling:

```javascript
// Example error responses
{
  "error": "User already has an active subscription",
  "code": "SUBSCRIPTION_EXISTS"
}

{
  "error": "Invalid plan ID provided",
  "code": "INVALID_PLAN"
}

{
  "error": "Access token required",
  "code": "AUTHENTICATION_ERROR"
}
```

## 📈 Monitoring & Logging

All operations are logged with appropriate levels:

- ✅ **Success operations**: Info level logging
- ⚠️ **Warnings**: Webhook signature failures, plan not found
- ❌ **Errors**: Database errors, Razorpay API failures
- 🔍 **Debug**: Detailed request/response data in development

## 🔄 Webhook Events Handled

| Event | Description | Action |
|-------|-------------|--------|
| `subscription.activated` | Subscription becomes active | Update status, grant premium access |
| `subscription.charged` | Successful payment | Update payment counts |
| `subscription.cancelled` | Subscription cancelled | Update status, revoke premium |
| `subscription.completed` | All payments completed | Update status |
| `subscription.paused` | Subscription paused | Update status |
| `subscription.resumed` | Subscription resumed | Update status, restore premium |
| `subscription.pending` | Payment pending | Update status |
| `subscription.halted` | Payment failures | Update status, handle grace period |
| `payment.failed` | Payment failed | Log failure, send notifications |

## 🚀 Production Deployment

1. **Environment Variables**: Set production Razorpay keys
2. **Database**: Use MongoDB Atlas or production database
3. **Webhooks**: Configure production webhook URL
4. **SSL Certificate**: Ensure HTTPS for webhook endpoint
5. **Monitoring**: Set up logging and monitoring
6. **Backup**: Regular database backups

## 📚 Additional Resources

- [Razorpay Subscriptions Documentation](https://razorpay.com/docs/subscriptions/)
- [Razorpay Webhooks Guide](https://razorpay.com/docs/webhooks/)
- [JWT.io](https://jwt.io/) - JWT debugger
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Support

For issues or questions:

1. Check the test script results
2. Verify environment variables
3. Check Razorpay Dashboard for subscription status
4. Review server logs for detailed error messages

---

**Built with ❤️ for HireLift** - A modern hiring platform to elevate your career journey.
