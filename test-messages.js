// Simple test script to verify message functionality
const testMessage = {
  from: 'user@example.com',
  to: ['recipient@example.com'],
  subject: 'Test Message',
  body: 'This is a test message to verify the Gmail-like functionality is working.',
  priority: 'normal',
  isHtml: false,
  attachments: []
};

async function testMessageAPI() {
  try {
    console.log('Testing message creation...');
    
    // Test creating a message
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage),
    });

    const result = await response.json();
    console.log('Create message result:', result);

    if (result.success) {
      console.log('✅ Message created successfully!');
      
      // Test fetching messages
      const fetchResponse = await fetch('http://localhost:3000/api/messages');
      const fetchResult = await fetchResponse.json();
      console.log('Fetch messages result:', fetchResult);
      
      if (fetchResult.success) {
        console.log('✅ Messages fetched successfully!');
        console.log(`Found ${fetchResult.data.length} messages`);
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMessageAPI();