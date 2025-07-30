// Quick test to verify the contact form is working with new templates
const testContactForm = async () => {
  try {
    console.log('🧪 Testing Contact Form with New Email Templates...');
    
    const testData = {
      name: 'Template Test User',
      email: 'template.test@example.com',
      subject: 'Testing New Email Template Structure',
      message: 'This is a test message to verify that the new email templates are working correctly with proper HTML structure and layout. The contact details should now appear in the correct section.'
    };

    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Contact form test successful!');
      console.log('📧 Response:', result);
      console.log('🔍 Check server logs for email sending details');
      console.log('📬 Both support and confirmation emails should be sent');
    } else {
      console.log('❌ Contact form test failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

// Wait a moment for server to start, then run test
setTimeout(testContactForm, 3000);
