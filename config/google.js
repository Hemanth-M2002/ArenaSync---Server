const { OAuth2Client } = require('google-auth-library');

/**
 * Google OAuth configuration
 * Verifies Google ID tokens for authentication
 */
class GoogleAuth {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!this.clientId && process.env.NODE_ENV === 'production') {
      console.error('❌ GOOGLE_CLIENT_ID is not set in environment variables');
    }
    
    this.client = new OAuth2Client(this.clientId);
  }

  /**
   * Verify Google ID token
   * @param {string} token - Google ID token from frontend
   * @returns {Promise<Object>} Decoded user payload
   */
  async verifyToken(token) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });
      
      const payload = ticket.getPayload();
      
      return {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        avatar: payload.picture,
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      console.error('Google token verification failed:', error.message);
      throw new Error('Invalid Google token');
    }
  }
}

module.exports = new GoogleAuth();