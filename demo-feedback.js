// Demo script to add sample feedback data
// This is just for testing purposes

const sampleFeedbacks = [
  {
    email: "john.doe@example.com",
    message: "The resume audit feature is fantastic! It really helped me identify areas for improvement. The keyword suggestions were spot on.",
    rating: 5,
    category: "general",
    status: "pending"
  },
  {
    email: "sarah.smith@example.com", 
    message: "I found a bug in the company search page. When I filter by remote jobs, some on-site positions still show up in the results.",
    rating: 3,
    category: "bug",
    status: "pending"
  },
  {
    email: "mike.johnson@example.com",
    message: "Could you add a feature to save multiple resume versions? It would be great to have different resumes for different job types.",
    rating: 4,
    category: "feature",
    status: "reviewed"
  },
  {
    email: "emily.davis@example.com",
    message: "The playground templates are helpful, but the UI could be more intuitive. Maybe add some drag-and-drop functionality?",
    rating: 4,
    category: "ui",
    status: "pending"
  },
  {
    email: "alex.wilson@example.com",
    message: "The page loading speed is quite slow, especially on the audit page. It takes about 10 seconds to process my resume.",
    rating: 2,
    category: "performance",
    status: "resolved"
  }
];

// Function to submit sample feedback (run this in browser console)
async function submitSampleFeedback() {
  for (const feedback of sampleFeedbacks) {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });
      
      if (response.ok) {
        console.log(`✅ Submitted feedback from ${feedback.email}`);
      } else {
        console.log(`❌ Failed to submit feedback from ${feedback.email}`);
      }
    } catch (error) {
      console.error(`Error submitting feedback from ${feedback.email}:`, error);
    }
    
    // Small delay between submissions
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🎉 All sample feedback submitted! Refresh the admin dashboard to see them.');
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sampleFeedbacks, submitSampleFeedback };
}

console.log('Sample feedback data loaded. Run submitSampleFeedback() to add test data.');
