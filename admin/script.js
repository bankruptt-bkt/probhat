```javascript
/* =========================================
   PROBHAT ADMIN PANEL
   FIREBASE + DASHBOARD LOGIC
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const logoutBtn = document.getElementById("logoutBtn");
const mobileLogout = document.getElementById("mobileLogout");

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".admin-section");


/* =========================================
   FIREBASE
========================================= */

const auth = window.firebaseAuth;
const db = window.firebaseDB;

const {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} = window.firebaseFunctions;


/* =========================================
   FIRESTORE IMPORTS
========================================= */

import(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"
).then((firebaseFirestore) => {

  window.firestoreFunctions = firebaseFirestore;

  initializeAdmin();

});


/* =========================================
   INITIALIZE
========================================= */

function initializeAdmin() {

  const {
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc
  } = window.firestoreFunctions;


  window.firestore = {
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc
  };


  /* -----------------------------------------
     AUTH STATE
  ----------------------------------------- */

  onAuthStateChanged(auth, async (user) => {

    if (user) {

      loginScreen.classList.add("hidden");

      dashboard.classList.remove("hidden");

      await loadAllData();

    } else {

      dashboard.classList.add("hidden");

      loginScreen.classList.remove("hidden");

    }

  });


  /* -----------------------------------------
     LOGIN
  ----------------------------------------- */

  loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;


    loginError.textContent = "";

    loginBtn.disabled = true;

    loginBtn.innerHTML = `
      <span>Signing In...</span>
      <span>...</span>
    `;


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    } catch (error) {

      console.error(error);

      loginError.textContent =
        getLoginError(error.code);

      loginBtn.disabled = false;

      loginBtn.innerHTML = `
        <span>Sign In</span>
        <span>→</span>
      `;

    }

  });


  /* -----------------------------------------
     LOGOUT
  ----------------------------------------- */

  async function logoutAdmin() {

    try {

      await signOut(auth);

    } catch (error) {

      console.error("Logout error:", error);

    }

  }

  logoutBtn.addEventListener(
    "click",
    logoutAdmin
  );

  mobileLogout.addEventListener(
    "click",
    logoutAdmin
  );


  /* -----------------------------------------
     NAVIGATION
  ----------------------------------------- */

  navItems.forEach((item) => {

    item.addEventListener("click", () => {

      const target =
        item.dataset.section;


      navItems.forEach((nav) => {

        nav.classList.remove("active");

      });

      item.classList.add("active");


      sections.forEach((section) => {

        section.classList.remove(
          "active-section"
        );

      });


      const targetSection =
        document.getElementById(target);


      if (targetSection) {

        targetSection.classList.add(
          "active-section"
        );

      }

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  });


  /* -----------------------------------------
     PROFILE
  ----------------------------------------- */

  const profileForm =
    document.getElementById("profileForm");


  profileForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const name =
        document.getElementById(
          "profileName"
        ).value.trim();

      const title =
        document.getElementById(
          "profileTitle"
        ).value.trim();

      const bio =
        document.getElementById(
          "profileBio"
        ).value.trim();

      const image =
        document.getElementById(
          "profileImage"
        ).value.trim();


      const message =
        document.getElementById(
          "profileMessage"
        );


      try {

        await setDoc(
          doc(db, "siteData", "profile"),
          {
            name,
            title,
            bio,
            image,
            updatedAt:
              new Date().toISOString()
          }
        );


        message.textContent =
          "✓ Profile saved successfully.";

        updateProfileStatus(true);

      } catch (error) {

        console.error(error);

        message.textContent =
          "Unable to save profile.";

      }

    }
  );


  /* -----------------------------------------
     CONTACT
  ----------------------------------------- */

  const contactForm =
    document.getElementById("contactForm");


  contactForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const email =
        document.getElementById(
          "contactEmail"
        ).value.trim();

      const whatsapp =
        document.getElementById(
          "contactWhatsapp"
        ).value.trim();

      const instagram =
        document.getElementById(
          "contactInstagram"
        ).value.trim();

      const linkedin =
        document.getElementById(
          "contactLinkedin"
        ).value.trim();


      const message =
        document.getElementById(
          "contactMessage"
        );


      try {

        await setDoc(
          doc(db, "siteData", "contact"),
          {
            email,
            whatsapp,
            instagram,
            linkedin,
            updatedAt:
              new Date().toISOString()
          }
        );


        message.textContent =
          "✓ Contact information saved.";

        updateContactStatus(true);

      } catch (error) {

        console.error(error);

        message.textContent =
          "Unable to save contact information.";

      }

    }
  );


  /* -----------------------------------------
     PROJECTS
  ----------------------------------------- */

  const projectForm =
    document.getElementById("projectForm");

  const projectList =
    document.getElementById("projectsList");

  const projectSaveBtn =
    document.getElementById(
      "projectSaveBtn"
    );

  const cancelEditBtn =
    document.getElementById(
      "cancelEditBtn"
    );


  projectForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const projectId =
        document.getElementById(
          "projectId"
        ).value;


      const project = {

        name:
          document.getElementById(
            "projectName"
          ).value.trim(),

        category:
          document.getElementById(
            "projectCategory"
          ).value.trim(),

        description:
          document.getElementById(
            "projectDescription"
          ).value.trim(),

        image:
          document.getElementById(
            "projectImage"
          ).value.trim(),

        link:
          document.getElementById(
            "projectLink"
          ).value.trim(),

        updatedAt:
          new Date().toISOString()

      };


      const message =
        document.getElementById(
          "projectMessage"
        );


      try {

        if (projectId) {

          await updateDoc(
            doc(
              db,
              "projects",
              projectId
            ),
            project
          );

          message.textContent =
            "✓ Project updated.";

        } else {

          project.createdAt =
            new Date().toISOString();

          await addDoc(
            collection(
              db,
              "projects"
            ),
            project
          );

          message.textContent =
            "✓ Project added.";

        }


        resetProjectForm();

        await loadProjects();

      } catch (error) {

        console.error(error);

        message.textContent =
          "Unable to save project.";

      }

    }
  );


  /* -----------------------------------------
     CANCEL EDIT
  ----------------------------------------- */

  cancelEditBtn.addEventListener(
    "click",
    resetProjectForm
  );


  /* -----------------------------------------
     LOAD PROFILE
  ----------------------------------------- */

  async function loadProfile() {

    try {

      const snapshot =
        await getDoc(
          doc(
            db,
            "siteData",
            "profile"
          )
        );


      if (!snapshot.exists()) {

        updateProfileStatus(false);

        return;

      }


      const data =
        snapshot.data();


      document.getElementById(
        "profileName"
      ).value =
        data.name || "";


      document.getElementById(
        "profileTitle"
      ).value =
        data.title || "";


      document.getElementById(
        "profileBio"
      ).value =
        data.bio || "";


      document.getElementById(
        "profileImage"
      ).value =
        data.image || "";


      updateProfileStatus(true);

    } catch (error) {

      console.error(
        "Profile loading error:",
        error
      );

    }

  }


  /* -----------------------------------------
     LOAD CONTACT
  ----------------------------------------- */

  async function loadContact() {

    try {

      const snapshot =
        await getDoc(
          doc(
            db,
            "siteData",
            "contact"
          )
        );


      if (!snapshot.exists()) {

        updateContactStatus(false);

        return;

      }


      const data =
        snapshot.data();


      document.getElementById(
        "contactEmail"
      ).value =
        data.email || "";


      document.getElementById(
        "contactWhatsapp"
      ).value =
        data.whatsapp || "";


      document.getElementById(
        "contactInstagram"
      ).value =
        data.instagram || "";


      document.getElementById(
        "contactLinkedin"
      ).value =
        data.linkedin || "";


      updateContactStatus(true);

    } catch (error) {

      console.error(
        "Contact loading error:",
        error
      );

    }

  }


  /* -----------------------------------------
     LOAD PROJECTS
  ----------------------------------------- */

  async function loadProjects() {

    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "projects"
          )
        );


      projectList.innerHTML = "";


      if (snapshot.empty) {

        projectList.innerHTML = `

          <div class="empty-projects">

            <div class="empty-icon">
              ▣
            </div>

            <h3>No projects yet</h3>

            <p>
              Add your first project using
              the form above.
            </p>

          </div>

        `;

        document.getElementById(
          "projectCount"
        ).textContent = "0";

        return;

      }


      let count = 0;


      snapshot.forEach((projectDoc) => {

        const project =
          projectDoc.data();

        const id =
          projectDoc.id;


        count++;


        const card =
          document.createElement(
            "div"
          );


        card.className =
          "project-admin-card";


        card.innerHTML = `

          <div class="project-admin-info">

            <h3>
              ${escapeHTML(
                project.name || "Untitled Project"
              )}
            </h3>

            <p>
              ${escapeHTML(
                project.description || ""
              )}
            </p>

            <span class="project-admin-category">
              ${escapeHTML(
                project.category || "Project"
              )}
            </span>

          </div>

          <div class="project-actions">

            <button
              class="project-action edit"
              data-id="${id}"
            >
              Edit
            </button>

            <button
              class="project-action delete"
              data-id="${id}"
            >
              Delete
            </button>

          </div>

        `;


        projectList.appendChild(card);


        const editButton =
          card.querySelector(
            ".edit"
          );


        const deleteButton =
          card.querySelector(
            ".delete"
          );


        editButton.addEventListener(
          "click",
          () => {

            editProject(
              id,
              project
            );

          }
        );


        deleteButton.addEventListener(
          "click",
          async () => {

            await deleteProject(id);

          }
        );

      });


      document.getElementById(
        "projectCount"
      ).textContent =
        count;

    } catch (error) {

      console.error(
        "Project loading error:",
        error
      );

      projectList.innerHTML = `

        <div class="empty-projects">

          <h3>Unable to load projects</h3>

          <p>
            Check your Firestore settings.
          </p>

        </div>

      `;

    }

  }


  /* -----------------------------------------
     EDIT PROJECT
  ----------------------------------------- */

  function editProject(
    id,
    project
  ) {

    document.getElementById(
      "projectId"
    ).value = id;


    document.getElementById(
      "projectName"
    ).value =
      project.name || "";


    document.getElementById(
      "projectCategory"
    ).value =
      project.category || "";


    document.getElementById(
      "projectDescription"
    ).value =
      project.description || "";


    document.getElementById(
      "projectImage"
    ).value =
      project.image || "";


    document.getElementById(
      "projectLink"
    ).value =
      project.link || "";


    projectSaveBtn.innerHTML = `
      <span>Update Project</span>
      <span>→</span>
    `;


    cancelEditBtn.classList.remove(
      "hidden"
    );


    document.getElementById(
      "projectsSection"
    ).scrollIntoView({
      behavior: "smooth"
    });

  }


  /* -----------------------------------------
     DELETE PROJECT
  ----------------------------------------- */

  async function deleteProject(id) {

    const confirmed =
      confirm(
        "Are you sure you want to delete this project?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await deleteDoc(
        doc(
          db,
          "projects",
          id
        )
      );


      await loadProjects();

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        "Unable to delete project."
      );

    }

  }


  /* -----------------------------------------
     RESET PROJECT FORM
  ----------------------------------------- */

  function resetProjectForm() {

    projectForm.reset();

    document.getElementById(
      "projectId"
    ).value = "";


    projectSaveBtn.innerHTML = `
      <span>Add Project</span>
      <span>→</span>
    `;


    cancelEditBtn.classList.add(
      "hidden"
    );


    document.getElementById(
      "projectMessage"
    ).textContent = "";

  }


  /* -----------------------------------------
     LOAD EVERYTHING
  ----------------------------------------- */

  async function loadAllData() {

    await loadProfile();

    await loadContact();

    await loadProjects();

  }


  /* -----------------------------------------
     STATUS
  ----------------------------------------- */

  function updateProfileStatus(
    exists
  ) {

    document.getElementById(
      "profileStatus"
    ).textContent =
      exists
        ? "Ready"
        : "Not Set";

  }


  function updateContactStatus(
    exists
  ) {

    document.getElementById(
      "contactStatus"
    ).textContent =
      exists
        ? "Ready"
        : "Not Set";

  }

}


/* =========================================
   LOGIN ERRORS
========================================= */

function getLoginError(code) {

  switch (code) {

    case "auth/invalid-email":
      return "Please enter a valid email.";

    case "auth/user-not-found":
      return "No admin account found.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";

    default:
      return "Login failed. Please try again.";

  }

}


/* =========================================
   SECURITY
   PREVENT HTML INJECTION
========================================= */

function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}
```
