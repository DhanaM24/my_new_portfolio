emailjs.init({ publicKey: "pd9VyyGoVy9oE-25h" });

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  loader.classList.add("hidden");

  const revealElements = document.querySelectorAll(
    ".reveal, .about-text, .about-image, .stat-card, .skill-category, .project-card, .contact-wrapper",
  );
  const showOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach((element) => {
      const top = element.getBoundingClientRect().top;
      if (top < triggerBottom) {
        element.classList.add("active", "visible");
        // If this is a skill category, animate its progress bars
        if (element.classList.contains("skill-category")) {
          const progresses = element.querySelectorAll(".skill-progress");
          progresses.forEach((p) => {
            const width = p.getAttribute("data-width") || p.dataset.width;
            if (width) p.style.width = `${width}%`;
          });
        }
      }
    });
  };

  showOnScroll();
  window.addEventListener("scroll", showOnScroll);

  const typingText = document.getElementById("typingText");
  const typingStrings = [
    "Full Stack Web Developer",
    "MERN Stack Engineer",
    "UI/UX Enthusiast",
  ];
  let typingIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeText = () => {
    if (!typingText) return;

    const currentString = typingStrings[typingIndex];
    if (isDeleting) {
      charIndex -= 1;
      typingText.textContent = currentString.slice(0, charIndex);
    } else {
      charIndex += 1;
      typingText.textContent = currentString.slice(0, charIndex);
    }

    let delay = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentString.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingStrings.length;
      delay = 500;
    }

    setTimeout(typeText, delay);
  };

  typeText();
});

const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

window.addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  cursorFollower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
});

const navLinks = document.querySelector(".nav-links");
const mobileMenu = document.querySelector(".mobile-menu");
const backToTop = document.querySelector(".back-to-top");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
  if (window.scrollY > 400) backToTop.classList.add("visible");
  else backToTop.classList.remove("visible");
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const projectCards = document.querySelectorAll(".project-card");
const observerOptions = {
  threshold: 0.25,
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

projectCards.forEach((card) => revealObserver.observe(card));

const form = document.getElementById("contactForm");
const successMessage = document.querySelector(".success-message");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields before sending your message.");
    return;
  }

  emailjs
    .send("service_n6qiww6", "template_jpzesq5", {
      from_name: name,
      from_email: email,
      message: message,
    })
    .then(
      function () {
        form.reset();
        successMessage.classList.add("show");
        setTimeout(() => successMessage.classList.remove("show"), 4000);
      },
      function (error) {
        console.error("EmailJS error:", error);
        alert(
          "An unexpected error occurred while sending the message. Please try again later.",
        );
      },
    );
});
