import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmREIGFnC_byQpu8CGf5qIev_6m-BSvg",
  authDomain: "probhat-7d5e9.firebaseapp.com",
  projectId: "probhat-7d5e9",
  storageBucket: "probhat-7d5e9.firebasestorage.app",
  messagingSenderId: "369971365753",
  appId: "1:369971365753:web:bd88925c9daa6fd55111a8",
  measurementId: "G-2DR3PSN3NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

// Helper to display errors
function showError(msg) {
  if (loginError) {
    loginError.style.display = "block";
    loginError.style.color = "#f87171";
    loginError.textContent = msg;
  }
}

function clearError() {
  if (loginError) {
    loginError.style.display = "none";
    loginError.textContent = "";
  }
}

// 1. Session State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in: reveal dashboard, hide login screen
    if (loginScreen) loginScreen.style.display = "none";
    if (dashboard) dashboard.style.display = "flex";
    console.log("Logged in UID:", user.uid);
  } else {
    // User is logged out: reveal login screen, hide dashboard
    if (loginScreen) loginScreen.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";
  }
});

// 2. Form Submission / Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    if (!email || !password) {
      showError("Please enter both email and password.");
      return;
    }

    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = "Signing In...";
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the UI switch upon success
    } catch (err) {
      console.error("Auth error:", err.code, err.message);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        showError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        showError("Too many failed attempts. Try again later.");
      } else {
        showError("Login failed: " + err.message);
      }
    } finally {
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";
      }
    }
  });
}

// 3. Logout Buttons / Navigation Links
document.querySelectorAll('[data-section="logout"], #logoutBtn').forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  });
});
