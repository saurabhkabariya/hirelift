# Email OTP Verification System

This system provides secure email verification using one-time passwords (OTP) for user signup.

## Features

### 🔒 Security Features
- **Image-based Captcha**: Prevents automated signup attempts
- **Terms & Conditions**: Required acceptance with validation
- **6-digit OTP**: Secure email verification before account creation
- **Rate Limiting**: Prevents OTP spam (60-second cooldown between requests)
- **Attempt Limiting**: Maximum 5 OTP verification attempts before requiring new OTP
- **Expiry**: OTP expires after 10 minutes

### 🎨 UI/UX Features
- **Smooth Animations**: Framer Motion animations throughout
- **Responsive Design**: Works on all device sizes
- **Form Validation**: Real-time validation with error messages
- **Auto-focus**: Automatic focus progression in OTP input
- **Paste Support**: Paste OTP codes directly
- **Visual Feedback**: Loading states, success/error animations

### 📧 Email Features
- **Attractive HTML Email**: Non-spammy design that avoids spam folders
- **Fallback Text**: Plain text version for email clients that don't support HTML
- **Professional Branding**: Consistent with HireLift brand
- **Clear Instructions**: Step-by-step verification guide
- **Security Notice**: Warnings about not sharing OTP codes

## Components

### AuthFlowManager
Main component that manages the authentication flow between form and OTP verification.

```javascript
<AuthFlowManager mode="signup" />
```

### AuthForm
Enhanced authentication form with captcha and terms acceptance.

```javascript
<AuthForm mode="signup" onAuthSubmit={handleAuthSubmit} />
```

### OTPVerification
Interactive OTP input component with auto-focus and validation.

```javascript
<OTPVerification
  email="user@example.com"
  onVerifySuccess={handleVerified}
  onBack={handleBack}
  error={error}
  setError={setError}
/>
```

## API Endpoints

### POST /api/auth/send-otp
Sends OTP to user's email address.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "email": "user@example.com"
}
```

### POST /api/auth/verify-otp
Verifies OTP and marks email as verified.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "emailVerified": true,
    "verifiedAt": "2025-01-01T00:00:00Z"
  }
}
```

### POST /api/auth/resend-otp
Resends OTP with rate limiting.

**Request:**
```json
{
  "email": "user@example.com"
}
```

## Database Schema

### User Model Extensions
```javascript
{
  emailVerified: Boolean,
  verifiedAt: Date,
  otp: String,
  otpExpiry: Date,
  otpAttempts: Number
}
```

## Email Configuration

### Development
Uses Ethereal Email (fake SMTP) for testing:
- Creates test accounts automatically
- Provides preview URLs for emails
- Logs OTP codes to console

### Production
Configure these environment variables:
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@hirelift.com
```

### Recommended Email Services
- **SendGrid**: Reliable with good deliverability
- **AWS SES**: Cost-effective for high volume
- **Mailgun**: Developer-friendly API
- **Resend**: Modern email API service

## Security Considerations

### OTP Security
- ✅ 6-digit numeric codes (1 in 1,000,000 chance)
- ✅ 10-minute expiry window
- ✅ Maximum 5 verification attempts
- ✅ Rate limiting on resend (60 seconds)
- ✅ OTP cleared after successful verification

### Email Security
- ✅ SPF/DKIM records (configure with your email provider)
- ✅ Professional email design to avoid spam filters
- ✅ Clear sender identification
- ✅ No sensitive data logged in production

### Form Security
- ✅ Image-based captcha
- ✅ Server-side validation
- ✅ CSRF protection (Next.js built-in)
- ✅ Rate limiting on API endpoints

## User Flow

1. **Signup Form**: User fills form with captcha and terms acceptance
2. **OTP Request**: System sends OTP to user's email
3. **Email Delivery**: User receives attractive, non-spammy email
4. **OTP Entry**: User enters 6-digit code with smooth UI
5. **Verification**: System verifies OTP and creates account
6. **Auto-login**: User is automatically logged in after verification

## Error Handling

### Client-side Errors
- Form validation errors (email format, password strength)
- Captcha validation
- Terms acceptance requirement
- OTP format validation
- Network errors with retry options

### Server-side Errors
- Invalid email format
- Existing verified accounts
- OTP expiry and attempt limits
- Email delivery failures
- Database connection issues

## Testing

### Manual Testing
1. Visit `/auth` page
2. Switch to signup mode
3. Fill form with valid data
4. Check console for OTP code (development)
5. Enter OTP to complete signup

### Email Testing
Run the test script:
```bash
node scripts/test-email.js
```

### API Testing
Use tools like Postman or curl to test endpoints:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Deployment Notes

### Environment Variables
Ensure all SMTP configuration variables are set in production.

### Email Deliverability
- Configure SPF records for your domain
- Set up DKIM signing
- Use a reputable email service provider
- Monitor bounce rates and spam reports

### Database Indexes
Add indexes for efficient queries:
```javascript
// MongoDB indexes
db.users.createIndex({ email: 1 })
db.users.createIndex({ otp: 1 })
db.users.createIndex({ otpExpiry: 1 })
```

### Monitoring
- Monitor OTP delivery success rates
- Track verification completion rates
- Alert on high bounce rates or spam reports
- Log verification attempts for security analysis

## Customization

### Email Templates
Modify `lib/email/emailService.js` to customize:
- Email design and branding
- Message content
- HTML/CSS styling

### OTP Configuration
Adjust settings in `lib/otp/otpUtils.js`:
- OTP length (currently 6 digits)
- Expiry time (currently 10 minutes)
- Character set (currently numeric only)

### UI Customization
Modify components to match your brand:
- Colors and styling in Tailwind classes
- Animation timing and effects
- Form layouts and spacing
