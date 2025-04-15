// API endpoint for authentication
export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get credentials from request body
    const { userId, password } = req.body;
    console.log('Auth request received for userId:', userId);

    // Get credentials from environment variables
    // These are server-side only and won't be exposed to the client
    const envUserId = process.env.USER_ID;
    const envPassword = process.env.PASSWORD;

    // Log environment variable status (but not values)
    console.log('Environment variables status:', {
      hasUserId: !!envUserId,
      hasPassword: !!envPassword
    });
    
    // Check if environment variables are available
    if (!envUserId || !envPassword) {
      console.warn('Warning: USER_ID or PASSWORD environment variables are not set');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error. Please contact administrator.' 
      });
    }
    
    // Check if credentials match
    const isValid = userId === envUserId && password === envPassword;
    console.log('Authentication result:', isValid ? 'success' : 'failed');
    
    if (isValid) {
      console.log('Authentication successful');
      return res.status(200).json({ success: true });
    }
    
    // If we get here, credentials didn't match
    console.log('Authentication failed - invalid credentials');
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials. Please try again.' 
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
} 