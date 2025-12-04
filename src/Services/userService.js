import { jwtDecode } from 'jwt-decode';

export const baseUrl = "https://ecombackend-vl7q.onrender.com/";

/**
 * Register a new user
 */
export const registerUser = async formData => {
  try {
    const res = await fetch(`${baseUrl}registeruser`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    console.log('Registration response:', data);

    return { ok: res.ok, data };
  } catch (error) {
    console.error('Registration error:', error.message);
    return { ok: false, error: error.message };
  }
};

/**
 * Login user and merge cart
 * @param {Object} credentials - { email, password }
 * @param {Array} guestCart - Local cart items to merge
 */
export const loginUser = async (credentials, guestCart = []) => {
  try {
    // Prepare login payload with cart data
    const payload = {
      ...credentials,
      guestCart: guestCart // Send guest cart to backend for merging
    };

    const res = await fetch(`${baseUrl}loginuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Login response:', data);

    // Extract token from response
    let token = data.token;

    if (!token) {
      throw new Error('No authentication token received');
    }

    // Remove "Bearer " prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    // Decode token to extract user data
    const decodedToken = jwtDecode(token);
    console.log('Decoded token:', decodedToken);

    // Validate token has required fields
    if (!decodedToken.userid && !decodedToken.userId) {
      throw new Error('Invalid token: missing user ID');
    }

    // Return complete authentication data
    return {
      ok: res.ok,
      data: data, // Backend response (success, message, cart, etc.)
      token: token, // JWT token
      decodedToken: decodedToken, // Decoded user data from token
      user: {
        userid: decodedToken.userid,
        email: decodedToken.email,
        phone: decodedToken.phone,
        address: decodedToken.address,
        image: decodedToken.image,
        role: decodedToken.role
      }
    };

  } catch (error) {
    console.error('Login error:', error.message);
    return { 
      ok: false, 
      error: error.message,
      data: { success: false, message: error.message }
    };
  }
};

/**
 * Get user data from stored token
 */
export const getUserFromToken = () => {
  try {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      return null;
    }

    const decoded = jwtDecode(token);
    
    return {
      userid: decoded.userid,
      email: decoded.email,
      phone: decoded.phone,
      address: decoded.address,
      image: decoded.image,
      role: decoded.role
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  try {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      return false;
    }

    const decoded = jwtDecode(token);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userData');
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Logout user - clear all session data and cart
 */
export const logoutUser = (clearCartCallback = null) => {
  // Clear all authentication data
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userData');
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  
  // Use context clearCart function if provided, otherwise manual clear
  if (clearCartCallback && typeof clearCartCallback === 'function') {
    clearCartCallback();
  } else {
    // Fallback manual clear
    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('guestCart');
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
  }
  
  // Force page reload to reset all state
  window.location.href = '/login';
};