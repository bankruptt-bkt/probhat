```javascript
/* =========================================================
   PROBHAT PORTFOLIO — VERSION 1
   Main JavaScript
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        const isOpen = mobileMenu.classList.toggle("active");

        mobileMenu.style.display = isOpen ? "block" : "none";

        menuButton.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });


    /* Close menu after clicking a link */

    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("active");

            mobileMenu.style.display = "none";

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================================
   CURRENT YEAR
========================================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 30) {

        navbar.style.background =
            "rgba(8, 8, 12, 0.90)";

        navbar.style.borderBottomColor =
            "rgba(255,255,255,0.09)";

    } else {

        navbar.style.background =
            "rgba(8, 8, 12, 0.72)";

        navbar.style.borderBottomColor =
            "rgba(255,255,255,0.05)";

    }

});


/* =========================================================
   SIMPLE SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(
    ".benefit-card, .service-item, .project-card, .about-content, .contact-link"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("revealed");

            observer.unobserve(entry.target);

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    revealObserver.observe(element);

});


/* =========================================================
   ADD REVEALED STATE
========================================================= */

const revealStyle = document.createElement("style");

revealStyle.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

document.head.appendChild(revealStyle);


/* =========================================================
   PROJECT HOVER MICRO EFFECT
========================================================= */

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {

    card.addEventListener("mousemove", event => {

        if (window.innerWidth < 800) return;

        const rect = card.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) / rect.width - 0.5;

        const y =
            (event.clientY - rect.top) / rect.height - 0.5;

        const image = card.querySelector(".project-image");

        if (!image) return;

        image.style.transform =
            `perspective(800px)
             rotateX(${y * -3}deg)
             rotateY(${x * 3}deg)
             translateY(-4px)`;

    });


    card.addEventListener("mouseleave", () => {

        const image = card.querySelector(".project-image");

        if (!image) return;

        image.style.transform = "";

    });

});


/* =========================================================
   SMOOTH ANCHOR NAVIGATION
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target =
            document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        const navbarHeight =
            navbar ? navbar.offsetHeight : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });

    });

});


/* =========================================================
   PROFILE CARD PARALLAX
========================================================= */

const profileCard =
    document.querySelector(".profile-card");

if (profileCard) {

    window.addEventListener("mousemove", event => {

        if (window.innerWidth < 900) return;

        const x =
            (event.clientX / window.innerWidth - 0.5);

        const y =
            (event.clientY / window.innerHeight - 0.5);

        profileCard.style.transform =
            `rotate(${2 + x * 2}deg)
             translate(${x * 5}px, ${y * 5}px)`;

    });

}


/* =========================================================
   BUTTON RIPPLE EFFECT
========================================================= */

const buttons = document.querySelectorAll(
    ".primary-button, .secondary-button, .cta-button, .nav-button"
);

buttons.forEach(button => {

    button.addEventListener("click", () => {

        button.style.transform = "scale(0.97)";

        setTimeout(() => {

            button.style.transform = "";

        }, 120);

    });

});


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "%cPROBHAT.DEV",
    "font-size:20px;font-weight:bold;"
);

console.log(
    "Portfolio loaded successfully 🚀"
);
```
