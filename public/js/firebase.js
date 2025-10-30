// Import modules using CDN paths and include the 'firebase/auth' module
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
// Optional: If you want analytics
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js"; 


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdNVl9NJqR0Ji4uHRw7Rv2wT6ZMhq9WCU",
  authDomain: "vortx-streaming.firebaseapp.com",
  projectId: "vortx-streaming",
  storageBucket: "vortx-streaming.firebasestorage.app",
  messagingSenderId: "87335574011",
  appId: "1:87335574011:web:4aab9df2f1552e3fa5d35e",
  measurementId: "G-19H1Z92ZLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Signup function
document.getElementById('firebaseSignUp').addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById('email-1').value;
    let password = document.getElementById('password-1').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password); 
        alert("Account has been created successfully");
        window.location.href = "../signin-up.html"; 
    }catch (error){
        alert(error.message);
    }
});

// Login function
document.getElementById('firebaseLogin').addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById('email-2').value;
    let password = document.getElementById('password-2').value;

    try {
        await signInWithEmailAndPassword(auth, email, password); 
        alert("Successfully logged in");
        window.location.href = "../index.html"; 
    }catch (error){
        alert(error.message);
    }
});

