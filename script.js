// EmailJS credentials
const EMAILJS_SERVICE_ID = "service_ng316pi";
const EMAILJS_PUBLIC_KEY = "pd9VyyGoVv9oE-25h";
const EMAILJS_TEMPLATE_ID = "template_jpzesq5";

if (typeof emailjs !== "undefined") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

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
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 },
);

projectCards.forEach((card) => revealObserver.observe(card));

const form = document.getElementById("contactForm");

if (form) {
  const submitBtn = form.querySelector(".submit-btn");
  const defaultBtnHtml = submitBtn?.innerHTML;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (
      !form.from_name.value.trim() ||
      !form.from_email.value.trim() ||
      !form.message.value.trim()
    ) {
      alert("Please fill in all fields before sending your message.");
      return;
    }

    const replyToField = document.getElementById("reply_to");
    if (replyToField) replyToField.value = form.from_email.value.trim();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Sending…';
    }

    emailjs
      .sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form,
        EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        alert("Message sent successfully!");
        form.reset();
      })
      .catch((error) => {
        console.log("EmailJS Error:", error);
        alert(
          "An unexpected error occurred while sending the message. Please try again later.",
        );
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = defaultBtnHtml;
        }
      });
  });
}
