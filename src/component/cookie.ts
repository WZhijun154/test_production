import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

function ensureSessionId() {
    // Check if a session ID already exists
    if (!Cookies.get('session_id')) {
        // Generate a new unique session ID
        const newSessionId = uuidv4();
        // Store the session ID in a cookie with a specified expiration
        Cookies.set('session_id', newSessionId, { expires: 1 }); // Expires in 1 days
        console.log('New session ID generated and stored:', newSessionId);
    } else {
        console.log('Session ID already exists:', Cookies.get('session_id'));
    }
}

// Call this function when your app loads or when appropriate
ensureSessionId();

export function getSessionId() {
    try {
        // Attempt to get the session_id from cookies
        const sessionId = Cookies.get('session_id');
        if (!sessionId) {
            console.log('No session ID found');
            return null; // or you might want to generate a new one
        }
        return sessionId;
    } catch (error) {
        console.error('Failed to retrieve session ID:', error);
        return null;
    }
}
