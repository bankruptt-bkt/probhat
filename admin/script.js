import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
setDoc,
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================
FIREBASE CONFIG
========================= */

const firebaseConfig = {
apiKey: "AIzaSyCmREIGFnC_byQpu8CGf5qIev_6m-BSvg",
authDomain: "probhat-7d5e9.firebaseapp.com",
projectId: "probhat-7d5e9",
storageBucket: "probhat-7d5e9.firebasestorage.app",
messagingSenderId: "369971365753",
appId: "1:369971365753:web:bd88925c9daa6fd55111a8",
measurementId: "G-2DR3PSN3NN"
};

/* =========================
INITIALIZE FIREBASE
========================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* =========================
ELEMENTS
========================= */

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const logoutBtn = document.getElementById("logoutBtn");
const mobileLogout = document.getElementById("mobileLogout");

const navButtons = document.querySelectorAll("[data-section]");
const sections = document.querySelectorAll(".admin-section");

/* =========================
AUTH STATE
========================= */

onAuthStateChanged(auth, async (user) => {

if (user) {

```
loginScreen.classList.add("hidden");
dashboard.classList.remove("hidden");

await loadAllData();
```

} else {

```
dashboard.classList.add("hidden");
loginScreen.classList.remove("hidden");
```

}

});

/* =========================
LOGIN
========================= */

loginForm.addEventListener("submit", async (e) => {

e.preventDefault();

loginError.textContent = "";
loginError.classList.remove("show");

const email = emailInput.value.trim();
const password = passwordInput.value;

if (!email || !password) {

```
showLoginError("Please enter your email and password.");
return;
```

}

loginBtn.disabled = true;
loginBtn.textContent = "Logging in...";

try {

```
await signInWithEmailAndPassword(auth, email, password);
```

} catch (error) {

```
console.error("LOGIN ERROR:", error);

let message = "Login failed. Please check your details.";

if (error.code === "auth/invalid-credential") {
  message = "Incorrect email or password.";
}

if (error.code === "auth/user-not-found") {
  message = "No account found with this email.";
}

if (error.code === "auth/wrong-password") {
  message = "Incorrect password.";
}

if (error.code === "auth/invalid-email") {
  message = "Please enter a valid email address.";
}

if (error.code === "auth/too-many-requests") {
  message = "Too many attempts. Please wait and try again.";
}

showLoginError(message);
```

} finally {

```
loginBtn.disabled = false;
loginBtn.textContent = "Login";
```

}

});

function showLoginError(message) {

loginError.textContent = message;
loginError.classList.add("show");

}

/* =========================
LOGOUT
========================= */

async function logout() {

try {

```
await signOut(auth);
```

} catch (error) {

```
console.error("Logout error:", error);
```

}

}

logoutBtn?.addEventListener("click", logout);
mobileLogout?.addEventListener("click", logout);

/* =========================
NAVIGATION
========================= */

navButtons.forEach(button => {

button.addEventListener("click", () => {

```
const target = button.dataset.section;

navButtons.forEach(btn => {
  btn.classList.remove("active");
});

button.classList.add("active");

sections.forEach(section => {
  section.classList.add("hidden");
});

const targetSection = document.getElementById(target);

if (targetSection) {
  targetSection.classList.remove("hidden");
}
```

});

});

/* =========================
LOAD EVERYTHING
========================= */

async function loadAllData() {

await loadProfile();
await loadContact();
await loadProjects();

}

/* =========================
PROFILE
========================= */

const profileForm = document.getElementById("profileForm");

const profileName = document.getElementById("profileName");
const profileTitle = document.getElementById("profileTitle");
const profileBio = document.getElementById("profileBio");
const profileImage = document.getElementById("profileImage");
const profileMessage = document.getElementById("profileMessage");

profileForm?.addEventListener("submit", async (e) => {

e.preventDefault();

try {

```
await setDoc(doc(db, "siteData", "profile"), {

  name: profileName.value.trim(),
  title: profileTitle.value.trim(),
  bio: profileBio.value.trim(),
  image: profileImage.value.trim(),
  updatedAt: new Date().toISOString()

});

showMessage(profileMessage, "Profile saved successfully.");

updateProfileStatus(true);
```

} catch (error) {

```
console.error(error);

showMessage(
  profileMessage,
  "Could not save profile.",
  true
);
```

}

});

async function loadProfile() {

try {

```
const snapshot = await getDoc(
  doc(db, "siteData", "profile")
);

if (!snapshot.exists()) return;

const data = snapshot.data();

profileName.value = data.name || "";
profileTitle.value = data.title || "";
profileBio.value = data.bio || "";
profileImage.value = data.image || "";

updateProfileStatus(true);
```

} catch (error) {

```
console.error("Profile load error:", error);
```

}

}

/* =========================
CONTACT
========================= */

const contactForm = document.getElementById("contactForm");

const contactEmail = document.getElementById("contactEmail");
const contactWhatsapp = document.getElementById("contactWhatsapp");
const contactInstagram = document.getElementById("contactInstagram");
const contactLinkedin = document.getElementById("contactLinkedin");
const contactMessage = document.getElementById("contactMessage");

contactForm?.addEventListener("submit", async (e) => {

e.preventDefault();

try {

```
await setDoc(doc(db, "siteData", "contact"), {

  email: contactEmail.value.trim(),
  whatsapp: contactWhatsapp.value.trim(),
  instagram: contactInstagram.value.trim(),
  linkedin: contactLinkedin.value.trim(),
  updatedAt: new Date().toISOString()

});

showMessage(
  contactMessage,
  "Contact information saved successfully."
);
```

} catch (error) {

```
console.error(error);

showMessage(
  contactMessage,
  "Could not save contact information.",
  true
);
```

}

});

async function loadContact() {

try {

```
const snapshot = await getDoc(
  doc(db, "siteData", "contact")
);

if (!snapshot.exists()) return;

const data = snapshot.data();

contactEmail.value = data.email || "";
contactWhatsapp.value = data.whatsapp || "";
contactInstagram.value = data.instagram || "";
contactLinkedin.value = data.linkedin || "";
```

} catch (error) {

```
console.error("Contact load error:", error);
```

}

}

/* =========================
PROJECTS
========================= */

const projectForm = document.getElementById("projectForm");

const projectId = document.getElementById("projectId");
const projectName = document.getElementById("projectName");
const projectCategory = document.getElementById("projectCategory");
const projectDescription = document.getElementById("projectDescription");
const projectImage = document.getElementById("projectImage");
const projectLink = document.getElementById("projectLink");

const projectSaveBtn = document.getElementById("projectSaveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const projectMessage = document.getElementById("projectMessage");
const projectsList = document.getElementById("projectsList");

projectForm?.addEventListener("submit", async (e) => {

e.preventDefault();

try {

```
const data = {

  name: projectName.value.trim(),
  category: projectCategory.value.trim(),
  description: projectDescription.value.trim(),
  image: projectImage.value.trim(),
  link: projectLink.value.trim(),
  updatedAt: new Date().toISOString()

};


if (projectId.value) {

  await updateDoc(
    doc(db, "projects", projectId.value),
    data
  );

  showMessage(
    projectMessage,
    "Project updated successfully."
  );

} else {

  data.createdAt = new Date().toISOString();

  await addDoc(
    collection(db, "projects"),
    data
  );

  showMessage(
    projectMessage,
    "Project added successfully."
  );

}


resetProjectForm();
await loadProjects();
```

} catch (error) {

```
console.error(error);

showMessage(
  projectMessage,
  "Could not save project.",
  true
);
```

}

});

async function loadProjects() {

try {

```
const snapshot = await getDocs(
  collection(db, "projects")
);

projectsList.innerHTML = "";

let count = 0;

snapshot.forEach(item => {

  count++;

  const data = item.data();

  const card = document.createElement("div");

  card.className = "project-admin-card";

  card.innerHTML = `

    <div>

      <h3>${escapeHTML(data.name || "Untitled Project")}</h3>

      <p>${escapeHTML(data.category || "")}</p>

      <small>
        ${escapeHTML(data.description || "")}
      </small>

    </div>

    <div class="project-actions">

      <button
        class="btn secondary edit-project"
        data-id="${item.id}">
        Edit
      </button>

      <button
        class="btn danger delete-project"
        data-id="${item.id}">
        Delete
      </button>

    </div>

  `;

  projectsList.appendChild(card);

});


document.getElementById("projectCount").textContent = count;


document.querySelectorAll(".edit-project")
  .forEach(button => {

    button.addEventListener("click", () => {

      editProject(button.dataset.id);

    });

  });


document.querySelectorAll(".delete-project")
  .forEach(button => {

    button.addEventListener("click", () => {

      deleteProject(button.dataset.id);

    });

  });
```

} catch (error) {

```
console.error("Projects load error:", error);
```

}

}

/* =========================
EDIT PROJECT
========================= */

async function editProject(id) {

try {

```
const snapshot = await getDoc(
  doc(db, "projects", id)
);

if (!snapshot.exists()) return;

const data = snapshot.data();

projectId.value = id;

projectName.value = data.name || "";
projectCategory.value = data.category || "";
projectDescription.value = data.description || "";
projectImage.value = data.image || "";
projectLink.value = data.link || "";

projectSaveBtn.textContent = "Update Project";
cancelEditBtn.classList.remove("hidden");

document.getElementById("projectsSection")
  .scrollIntoView({
    behavior: "smooth"
  });
```

} catch (error) {

```
console.error(error);
```

}

}

/* =========================
DELETE PROJECT
========================= */

async function deleteProject(id) {

const confirmed = confirm(
"Are you sure you want to delete this project?"
);

if (!confirmed) return;

try {

```
await deleteDoc(
  doc(db, "projects", id)
);

await loadProjects();
```

} catch (error) {

```
console.error("Delete error:", error);

alert("Could not delete project.");
```

}

}

/* =========================
RESET PROJECT FORM
========================= */

cancelEditBtn?.addEventListener(
"click",
resetProjectForm
);

function resetProjectForm() {

projectForm.reset();

projectId.value = "";

projectSaveBtn.textContent = "Add Project";

cancelEditBtn.classList.add("hidden");

}

/* =========================
HELPERS
========================= */

function showMessage(element, message, error = false) {

if (!element) return;

element.textContent = message;

element.classList.remove("success", "error");

element.classList.add(
error ? "error" : "success"
);

setTimeout(() => {

```
element.textContent = "";

element.classList.remove(
  "success",
  "error"
);
```

}, 4000);

}

function updateProfileStatus(status) {

const element =
document.getElementById("profileStatus");

if (!element) return;

element.textContent =
status ? "Configured" : "Not configured";

}

function escapeHTML(value) {

return String(value)
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");

}
