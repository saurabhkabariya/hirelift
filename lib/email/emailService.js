// Email service for sending OTP emails
import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // For development/testing, you can use Gmail SMTP
  // For production, use services like SendGrid, AWS SES, Mailgun, etc.
    // Production email service configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('📧 Using production SMTP configuration');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Additional production configurations
      pool: true, // Use connection pool
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000, // Rate limiting
      rateLimit: 10, // Max 10 emails per second
      tls: {
        // Don't fail on invalid certs
        rejectUnauthorized: false
      }
    });
  }
  
  // Development/testing: Use ethereal email (fake SMTP service)
  // You can also use Gmail SMTP for testing with app passwords
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.pass'
    }
  });
};
export const generateOTPEmailHTML = (otp, userEmail) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - HireLift</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background-color: #f8fafc;
                color: #334155;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                padding: 40px 30px;
                text-align: center;
            }
            .logo {
                color: #ffffff;
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .header-text {
                color: #e2e8f0;
                font-size: 16px;
                margin: 0;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .greeting {
                font-size: 24px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 20px;
            }
            .message {
                font-size: 16px;
                line-height: 1.6;
                color: #64748b;
                margin-bottom: 30px;
            }
            .otp-container {
                background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                border: 2px solid #3b82f6;
                border-radius: 16px;
                padding: 30px;
                margin: 30px 0;
                text-align: center;
            }
            .otp-label {
                font-size: 14px;
                font-weight: 600;
                color: #3b82f6;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 15px;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #1e293b;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                background-color: #ffffff;
                padding: 15px 30px;
                border-radius: 12px;
                display: inline-block;
                border: 1px solid #e2e8f0;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .expiry-notice {
                font-size: 14px;
                color: #ef4444;
                margin-top: 20px;
                font-weight: 500;
            }
            .instructions {
                background-color: #f8fafc;
                border-left: 4px solid #3b82f6;
                padding: 20px;
                margin: 30px 0;
                border-radius: 0 8px 8px 0;
            }
            .instructions h3 {
                margin: 0 0 15px 0;
                font-size: 18px;
                color: #1e293b;
            }
            .instructions ul {
                margin: 0;
                padding-left: 20px;
                color: #64748b;
            }
            .instructions li {
                margin-bottom: 8px;
                line-height: 1.5;
            }
            .security-notice {
                background-color: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 12px;
                padding: 20px;
                margin: 30px 0;
            }
            .security-notice h3 {
                color: #dc2626;
                margin: 0 0 10px 0;
                font-size: 16px;
                display: flex;
                align-items: center;
            }
            .security-notice p {
                color: #7f1d1d;
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
            }
            .footer {
                background-color: #f8fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer-text {
                font-size: 14px;
                color: #64748b;
                margin: 0 0 15px 0;
            }
            .company-info {
                font-size: 12px;
                color: #94a3b8;
                line-height: 1.5;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                padding: 8px;
                background-color: #e2e8f0;
                border-radius: 50%;
                text-decoration: none;
                color: #64748b;
                transition: all 0.3s ease;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
            }
            @media (max-width: 600px) {
                .container {
                    margin: 0 10px;
                }
                .header, .content, .footer {
                    padding: 30px 20px;
                }
                .otp-code {
                    font-size: 28px;
                    letter-spacing: 4px;
                    padding: 12px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🚀 HireLift</div>
                <p class="header-text">Your Career Acceleration Platform</p>
            </div>
            
            <div class="content">
                <h1 class="greeting">Almost There! 🎉</h1>
                <p class="message">
                    Thank you for joining HireLift! To complete your account setup and ensure the security of your account, 
                    please verify your email address using the verification code below.
                </p>
                
                <div class="otp-container">
                    <div class="otp-label">Your Verification Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="expiry-notice">⏰ This code expires in 10 minutes</div>
                </div>
                
                <div class="instructions">
                    <h3>📝 How to verify:</h3>
                    <ul>
                        <li>Go back to the HireLift signup page</li>
                        <li>Enter the 6-digit code shown above</li>
                        <li>Click "Verify Email" to complete your registration</li>
                        <li>Start exploring our amazing features!</li>
                    </ul>
                </div>
                
                <div class="security-notice">
                    <h3>🔒 Security Notice</h3>
                    <p>
                        If you didn't request this verification code, please ignore this email. 
                        This code is only valid for 10 minutes and can only be used once. 
                        Never share this code with anyone - HireLift will never ask for your verification code.
                    </p>
                </div>
                
                <p class="message">
                    Having trouble? Our support team is here to help! Contact us at 
                    <a href="mailto:support@hirelift.com" style="color: #3b82f6; text-decoration: none;">support@hirelift.com</a>
                </p>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    Welcome to the HireLift community! 🌟<br>
                    We're excited to help you accelerate your career journey.
                </p>
                
                <div class="company-info">
                    <strong>HireLift</strong><br>
                    AI-Powered Career Acceleration Platform<br>
                    Helping job seekers land their dream jobs faster<br><br>
                    
                    This email was sent to ${userEmail}<br>
                    © ${new Date().getFullYear()} HireLift. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const generateOTPEmailText = (otp, userEmail) => {
  return `
HireLift - Email Verification

Hello!

Thank you for joining HireLift! To complete your account setup, please verify your email address.

Your verification code: ${otp}

This code expires in 10 minutes.

How to verify:
1. Go back to the HireLift signup page
2. Enter the 6-digit code: ${otp}
3. Click "Verify Email" to complete registration

Security Notice: If you didn't request this code, please ignore this email. Never share this code with anyone.

Need help? Contact us at support@hirelift.com

Welcome to HireLift!
The HireLift Team

This email was sent to ${userEmail}
© ${new Date().getFullYear()} HireLift. All rights reserved.
  `;
};

// Simple email sending function with proper SMTP configuration handling
export const sendOTPEmail = async (email, otp) => {
  try {
    const emailHTML = generateOTPEmailHTML(otp, email);
    const emailText = generateOTPEmailText(otp, email);
    
    const mailOptions = {
      from: {
        name: 'HireLift',
        address: process.env.SMTP_FROM || 'noreply@hirelift.com'
      },
      to: email,
      subject: '🔐 Your HireLift Email Verification Code',
      text: emailText,
      html: emailHTML,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    // Check if SMTP credentials are configured
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    
    if (hasSmtpConfig) {
      // Use configured SMTP service (Brevo/Sendinblue)
      console.log('📧 Using configured SMTP service:', process.env.SMTP_HOST);
      console.log('📧 SMTP User:', process.env.SMTP_USER);
      console.log('📧 SMTP Port:', process.env.SMTP_PORT);
      console.log('📧 SMTP Secure:', process.env.SMTP_SECURE);
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        debug: true, // Enable debug for troubleshooting
        logger: true, // Log SMTP traffic
      });

      const info = await transporter.sendMail(mailOptions);
      
      console.log('📧 OTP Email sent successfully via SMTP!', info.messageId);
      console.log('📧 Email sent to:', email);
      
      return {
        success: true,
        messageId: info.messageId,
        email,
        provider: 'smtp'
      };
      
    } else {
      // Development mode: Use Ethereal Email for testing
      console.log('📧 No SMTP config found, using Ethereal Email for development...');
      
      try {
        const testAccount = await nodemailer.createTestAccount();
        const devTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        const info = await devTransporter.sendMail(mailOptions);
        
        console.log('📧 OTP Email sent to test account!');
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        console.log('📧 OTP Code:', otp);
        
        return {
          success: true,
          messageId: info.messageId,
          previewUrl: nodemailer.getTestMessageUrl(info),
          email,
          otp,
          provider: 'ethereal'
        };
      } catch (devError) {
        console.error('Ethereal email error, falling back to mock:', devError);
        // Fall back to mock implementation
        console.log('📧 OTP Email would be sent to:', email);
        console.log('📧 OTP Code:', otp);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          success: true,
          messageId: `mock-message-id-${Date.now()}`,
          email,
          otp,
          provider: 'mock'
        };
      }
    }
    
  } catch (error) {
    console.error('Email sending error:', error.message);
    console.error('Full error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// General email sending function
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Validate inputs
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters: to, subject, and html are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error('Invalid email address format');
    }

    const hasValidSMTP = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Force production mode if SMTP is properly configured
    if (!hasValidSMTP && !isProduction) {
      console.log('📧 Development Mode: Email would be sent (SMTP not configured)');
      console.log('📧 To:', to);
      console.log('📧 Subject:', subject);
      console.log('📧 HTML Preview (first 150 chars):', html.substring(0, 150) + '...');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        messageId: `dev-mock-${Date.now()}`,
        previewURL: null,
        mode: 'development-mock'
      };
    }

    console.log('📧 Attempting to send production email...');
    const transporter = createTransporter();
    
    // Verify transporter connection with timeout
    const verificationPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SMTP verification timeout')), 10000)
    );
    
    try {
      await Promise.race([verificationPromise, timeoutPromise]);
      console.log('✅ SMTP server connection verified');
    } catch (verifyError) {
      console.warn('⚠️ SMTP verification failed:', verifyError.message);
      
      // In production, we should try to send anyway
      if (isProduction) {
        console.log('📧 Production mode: Attempting to send despite verification failure');
      } else {
        // In development, fall back to mock
        console.log('📧 Development fallback: Email would be sent');
        console.log('📧 To:', to);
        console.log('📧 Subject:', subject);
        
        return {
          success: true,
          messageId: `dev-fallback-${Date.now()}`,
          previewURL: null,
          mode: 'development-fallback',
          note: 'SMTP verification failed, fell back to mock'
        };
      }
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'HireLift Support <hirelift01@gmail.com>',
      to: to.trim(),
      subject: subject.trim(),
      html,
      text: text || html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      // Production email headers
      headers: {
        'X-Mailer': 'HireLift Contact System',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal'
      }
    };

    console.log('📧 Sending email...');
    console.log('📧 To:', to);
    console.log('📧 Subject:', subject);
    console.log('📧 From:', mailOptions.from);

    // Send email with timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const sendTimeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout')), 30000)
    );

    const info = await Promise.race([sendPromise, sendTimeoutPromise]);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    
    // Log preview URL for development
    if (info.previewURL && !isProduction) {
      console.log('📧 Preview URL:', info.previewURL);
    }

    // Close transporter pool in production to avoid memory leaks
    if (isProduction) {
      transporter.close();
    }

    return {
      success: true,
      messageId: info.messageId,
      previewURL: info.previewURL,
      mode: 'production'
    };

  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    
    // In production, we should not expose detailed error messages
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Log detailed error for debugging but don't expose it
      console.error('Production email error details:', {
        message: error.message,
        code: error.code,
        response: error.response,
        stack: error.stack
      });
      
      // Return a generic error for production
      throw new Error('Email service temporarily unavailable. Please try again later or contact support directly.');
    } else {
      // In development, provide more details for debugging
      console.log('📧 Development fallback due to error');
      console.log('📧 Original error:', error.message);
      
      return {
        success: true,
        messageId: `error-fallback-${Date.now()}`,
        previewURL: null,
        mode: 'development-error-fallback',
        note: `Email would be sent (Error: ${error.message})`
      };
    }
  }
};
