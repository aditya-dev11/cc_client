/**
 * Translates raw Firebase Authentication error codes into user-friendly messages.
 * @param {Error} error - The Firebase error object
 * @returns {string} - A human-readable error message
 */
export const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'The email address you entered is not valid.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email address. Please sign up instead.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account already exists with this email address. Please sign in instead.';
        case 'auth/weak-password':
            return 'Your password is too weak. Please use at least 6 characters.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is currently disabled. Please contact support.';
        case 'auth/invalid-credential':
            return 'Invalid email or password provided. Please check your credentials.';
        case 'auth/too-many-requests':
            return 'Too many unsuccessful login attempts. Please try again later or reset your password.';
        case 'auth/network-request-failed':
            return 'A network error occurred. Please check your internet connection and try again.';
        default:
            // Fallback to the original message if we don't have a specific translation, 
            // but strip the "Firebase: " prefix if it exists to make it slightly cleaner.
            if (error.message && error.message.startsWith('Firebase:')) {
                return error.message.replace('Firebase:', '').trim();
            }
            return 'An unexpected error occurred. Please try again.';
    }
};
