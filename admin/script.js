// admin/script.js - DIAGNOSTIC CHECK

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  // Show immediate confirmation on the screen that JS is running
  if (loginError) {
    loginError.style.display = "block";
    loginError.style.color = "#38bdf8";
    loginError.textContent = "Diagnostic Mode: JS loaded successfully.";
  }

  if (!loginForm) {
    alert("CRITICAL ERROR: Element #loginForm was NOT found in the HTML!");
    return;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents page reload

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    alert("Form intercept worked! Email entered: " + email);
  });
});
