// API endpoint for authentication
export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get credentials from request body
    const { userId, password } = req.body;

    // Get credentials from environment variables
    // These are server-side only and won't be exposed to the client
    const envUserId = process.env.USER_ID;
    const envPassword = process.env.PASSWORD;

    // Log that we're checking (but don't log actual credentials)
    console.log('Auth request received');
    
    // Check if environment variables are available
    if (!envUserId || !envPassword) {
      console.warn('Warning: USER_ID or PASSWORD environment variables are not set');
    }
    
    // Check if credentials match the environment variables
    const isValid = envUserId && envPassword && 
                    userId === envUserId && 
                    password === envPassword;
    
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