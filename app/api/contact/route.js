import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/emailService';
import { headers } from 'next/headers';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map();

// Rate limiting function
function checkRateLimit(identifier, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }
  
  const requests = rateLimitStore.get(identifier);
  // Remove old requests outside the window
  const recentRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  rateLimitStore.set(identifier, recentRequests);
  return true; // Request allowed
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 2000); // Limit length
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers();
    const clientIP = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    
    // Check rate limit (5 requests per 15 minutes per IP)
    if (!checkRateLimit(clientIP, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait 15 minutes before sending another message.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Enhanced validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Validate lengths
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (sanitizedSubject.length < 5 || sanitizedSubject.length > 200) {
      return NextResponse.json(
        { error: 'Subject must be between 5 and 200 characters' },
        { status: 400 }
      );
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Basic spam detection
    const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'inheritance', 'bitcoin', 'crypto'];
    const messageContent = (sanitizedSubject + ' ' + sanitizedMessage).toLowerCase();
    const hasSpamKeywords = spamKeywords.some(keyword => messageContent.includes(keyword));
    
    if (hasSpamKeywords) {
      console.warn('Potential spam detected from:', sanitizedEmail);
      // Still process but flag it
    }    // Get current timestamp for reference
    const timestamp = new Date().toISOString();
    const userAgent = headersList.get('user-agent') || 'Unknown';// Prepare enhanced email content for support team
    const emailSubject = `[HireLift Contact] ${sanitizedSubject}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission - HireLift</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7209B7, #F72585); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">New Contact Form Submission</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Received on ${new Date().toLocaleString()}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Contact Details Section -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #7209B7;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📋 Contact Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 100px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${sanitizedName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${sanitizedEmail}" style="color: #7209B7; text-decoration: none;">${sanitizedEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
                  <td style="padding: 8px 0; color: #333;">${sanitizedSubject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">IP Address:</td>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">${clientIP}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Timestamp:</td>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">${timestamp}</td>
                </tr>
              </table>
            </div>
            
            <!-- Message Section -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #F72585;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💬 Message</h2>
              <div style="background: white; padding: 15px; border-radius: 6px; line-height: 1.6; color: #333; border: 1px solid #e9ecef;">
                ${sanitizedMessage.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            ${hasSpamKeywords ? `
            <!-- Spam Alert -->
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>⚠️ Spam Alert:</strong> This message contains potential spam keywords. Please review carefully.
              </p>
            </div>
            ` : ''}
            
            <!-- Action Required -->
            <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #2196F3;">
              <p style="margin: 0; font-size: 14px; color: #1976D2;">
                <strong>📞 Action Required:</strong> Please respond to this inquiry within 24 hours as promised on our contact page.
              </p>
            </div>
            
            <!-- Reply Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${sanitizedEmail}?subject=Re: ${encodeURIComponent(sanitizedSubject)}&body=Hi ${encodeURIComponent(sanitizedName)},%0A%0AThank you for contacting HireLift. " 
                 style="background: linear-gradient(135deg, #7209B7, #F72585); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
                📧 Reply to Customer
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; text-align: center; padding: 20px; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; color: #666; font-size: 12px;">This message was sent from the HireLift contact form.</p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">System: Production Contact Form v2.0</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to support team
    console.log('📧 Sending notification to support team...');
    await sendEmail({
      to: 'hirelift01@gmail.com',
      subject: emailSubject,
      html: emailHtml
    });    // Send enhanced confirmation email to user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - HireLift</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7209B7, #F72585); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Thank You for Contacting HireLift!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">We've received your message</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #e8f5e8; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                ✅
              </div>
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 22px;">Message Received Successfully!</h2>
              <p style="color: #666; line-height: 1.6; font-size: 16px;">
                Hi <strong>${sanitizedName}</strong>,<br><br>
                Thank you for reaching out to us. We've received your message about "<strong>${sanitizedSubject}</strong>" and our support team will get back to you within <strong>24 hours</strong>.
              </p>
            </div>
            
            <!-- What happens next section -->
            <div style="background: #e8f4fd; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2196F3;">
              <h3 style="color: #1976D2; margin: 0 0 15px 0; font-size: 18px;">🚀 What happens next?</h3>
              <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Our support team will review your message</li>
                <li>You'll receive a detailed response within 24 hours</li>
                <li>For urgent matters, feel free to email us directly at <a href="mailto:hirelift01@gmail.com" style="color: #7209B7;">hirelift01@gmail.com</a></li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <p style="color: #666; margin-bottom: 20px;">
                In the meantime, feel free to explore our platform and check out our latest features!
              </p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
                 style="background: linear-gradient(135deg, #7209B7, #F72585); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
                🚀 Visit HireLift
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; text-align: center; padding: 20px; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; color: #666; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">For support, contact us at <a href="mailto:hirelift01@gmail.com" style="color: #7209B7;">hirelift01@gmail.com</a></p>
            <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">Reference ID: ${timestamp}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('📧 Sending confirmation to user...');
    await sendEmail({
      to: sanitizedEmail,
      subject: 'Thank you for contacting HireLift - We\'ll respond within 24 hours!',
      html: confirmationHtml
    });

    // Log successful contact form submission
    console.log('✅ Contact form submission processed successfully');
    console.log(`📧 From: ${sanitizedName} <${sanitizedEmail}>`);
    console.log(`📧 Subject: ${sanitizedSubject}`);
    console.log(`📧 IP: ${clientIP}`);

    return NextResponse.json(
      { 
        message: 'Message sent successfully! Check your email for confirmation.',
        success: true,
        referenceId: timestamp
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Enhanced error logging for production debugging
    console.error('Contact form error details:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction 
      ? 'We\'re experiencing technical difficulties. Please try again later or email us directly at hirelift01@gmail.com'
      : `Failed to send message: ${error.message}. Please try again or email us directly at hirelift01@gmail.com`;

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
