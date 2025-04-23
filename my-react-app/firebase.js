import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTlgHimTflDjxvLT_imd3ClR791UqTfvo",
  authDomain: "gold-fit.firebaseapp.com",
  projectId: "gold-fit",
  storageBucket: "gold-fit.firebasestorage.app",
  messagingSenderId: "266468364421",
  appId: "1:266468364421:web:52b62607c80e52a38559ec",
  measurementId: "G-35WWV9101J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Handle login with Google
const googleLogin = document.getElementById("google-login-btn");
if (googleLogin) {
  googleLogin.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);

        // Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );

        // Redirect to the root route (Dashboard)
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error during login:", error.message);
      });
  });
}

// Add sign-out functionality
const signOutBtn = document.getElementById("sign-out-btn");
if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        localStorage.removeItem("user");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  });
}



// Export auth and db
export { auth, db };