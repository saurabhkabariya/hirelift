// Email service for sending OTP emails
import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // For development/testing, you can use Gmail SMTP
  // For production, use services like SendGrid, AWS SES, Mailgun, etc.
  
  if (process.env.NODE_ENV === 'production') {
    // Production email service configuration
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
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
