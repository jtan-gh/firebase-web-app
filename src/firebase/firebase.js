// firebase-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-adminsdk.json'); // Adjust the path accordingly
const { getAuth: getClientAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app')

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const clientApp = (() => {
  try {
    const cApp = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully.");
    return cApp;
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error; // Optionally re-throw the error for further handling
  }
})();

const clientAuth = getClientAuth(clientApp);

const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    // If the sign-in is successful, userCredential.user will contain the authenticated user
    const idToken = await userCredential.user.getIdToken();
    return { success: true, idToken: idToken };
  } catch (error) {
    // Handle different error cases based on Firebase error codes
    let errorMessage = "Failed to sign in.";
    switch (error.code) {
      case "auth/wrong-password":
        errorMessage = "Incorrect password.";
        break;
      case "auth/user-not-found":
        errorMessage = "No account found with this email.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
      default:
        errorMessage = "An error occurred. Please try again.";
        break;
    }
    console.error("Sign-in error:", error);
    return { success: false, message: errorMessage };
  }
}


module.exports = {
  admin,
  signin,
}
