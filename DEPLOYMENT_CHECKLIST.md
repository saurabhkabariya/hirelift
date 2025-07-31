# HireLift Razorpay Payment Integration - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `RAZORPAY_KEY_ID` (server-side)
- [ ] `RAZORPAY_KEY_SECRET` (server-side)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` (client-side)
- [ ] `JWT_SECRET` (for authentication)
- [ ] `MONGODB_URI` (database connection)

### 2. Razorpay Dashboard Setup
- [ ] Create Razorpay account
- [ ] Generate API keys (test/live)
- [ ] Create subscription plans:
  - [ ] `plan_pro_monthly` - ₹99/month
  - [ ] `plan_pro_yearly` - ₹999/year (optional)
- [ ] Configure webhook URL: `https://yourdomain.com/api/webhook`
- [ ] Enable required webhook events:
  - [ ] `subscription.activated`
  - [ ] `subscription.cancelled`
  - [ ] `subscription.paused`
  - [ ] `subscription.resumed`
  - [ ] `payment.failed`

### 3. Database Setup
- [ ] MongoDB connection working
- [ ] User model has `isPremium` field
- [ ] Subscription model created
- [ ] Indexes created for performance

### 4. Security Checklist
- [ ] JWT secret is strong (64+ characters)
- [ ] Razorpay secrets not exposed in frontend
- [ ] Webhook signature verification enabled
- [ ] HTTPS enabled for production
- [ ] CORS configured correctly

### 5. Testing Checklist
- [ ] Backend API endpoints working
- [ ] Frontend payment flow working
- [ ] Webhook processing working
- [ ] Error handling tested
- [ ] Mobile responsiveness tested

## 🚀 Deployment Steps

### 1. Production Environment
```bash
# 1. Set environment variables in production
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX

# 2. Update webhook URL in Razorpay dashboard
# https://yourdomain.com/api/webhook

# 3. Test with live keys (small amount first)
```

### 2. Switch to Live Mode
```javascript
// In production, use live keys:
// rzp_live_XXXXXXXXXXXXX (instead of rzp_test_XXXXXXXXXXXXX)

// Update plan IDs to live plan IDs from Razorpay dashboard
```

### 3. Monitor After Deployment
- [ ] Check webhook delivery logs
- [ ] Monitor payment success rates
- [ ] Track subscription creation metrics
- [ ] Monitor error logs

## 🔧 Troubleshooting

### Common Issues

1. **Razorpay SDK not loading**
   ```javascript
   // Check if script tag is in layout.js
   <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
   ```

2. **Payment button not working**
   - Check browser console for errors
   - Verify user is logged in
   - Check Razorpay key configuration

3. **Webhook not receiving events**
   - Verify webhook URL is accessible
   - Check Razorpay dashboard webhook logs
   - Verify signature verification

4. **User premium status not updating**
   - Check webhook processing logs
   - Verify database connection
   - Check subscription status in MongoDB

### Debug Commands
```bash
# Test backend integration
npm run test:payment

# Check frontend in browser console
npm run test:frontend

# Check logs
tail -f logs/payment.log
```

## 📊 Monitoring & Analytics

### Key Metrics to Track
- Payment success rate
- Subscription conversion rate
- Churn rate
- Webhook delivery success
- API response times

### Logging
- All payment attempts
- Webhook events received
- Error conditions
- User subscription changes

## 🆘 Support & Maintenance

### Regular Tasks
- [ ] Monitor webhook health
- [ ] Update plan pricing as needed
- [ ] Review and analyze payment metrics
- [ ] Update test card numbers if needed

### Emergency Contacts
- Razorpay Support: support@razorpay.com
- Technical Documentation: https://razorpay.com/docs/

### Backup Plans
- [ ] Manual subscription activation process
- [ ] Alternative payment gateway setup
- [ ] Customer support escalation process

---

**Last Updated:** {{ current_date }}
**Integration Version:** 1.0.0
**Status:** ✅ Production Ready
