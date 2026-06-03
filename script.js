const EMAILJS_PUBLIC_KEY = "pd9VyyGoVy9oE-25h";
const EMAILJS_SERVICE_ID = "service_n6qiww6";
const EMAILJS_TEMPLATE_ID = "template_jpzesq5";
const CONTACT_EMAIL = "dhananjipallegedara432@gmail.com";

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

function showContactSuccess(form, successMessage) {
  form.reset();
  successMessage.classList.add("show");
  setTimeout(() => successMessage.classList.remove("show"), 4000);
}

function getEmailJsErrorMessage(error) {
  const status = error?.status;
  const text = (error?.text || "").toLowerCase();

  if (status === 403 || text.includes("forbidden")) {
    return (
      "EmailJS blocked this site. In your EmailJS dashboard (Account → Security), " +
      "allow: https://dhanam24.github.io"
    );
  }
  if (status === 412 || text.includes("quota")) {
    return "Monthly email limit reached on EmailJS. Trying backup delivery…";
  }
  if (status === 400) {
    return "Email template mismatch. Check template variables in EmailJS.";
  }
  return "";
}

async function sendViaEmailJS(name, email, message) {
  if (typeof emailjs === "undefined") {
    throw new Error("EmailJS not loaded");
  }

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      from_name: name,
      from_email: email,
      reply_to: email,
      name,
      email,
      message,
    },
    { publicKey: EMAILJS_PUBLIC_KEY },
  );
}

async function sendViaFormSubmit(name, email, message) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Portfolio message from ${name}`,
        _template: "table",
        _captcha: "false",
      }),
    },
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Backup send failed");
  }
  return data;
}

function openMailtoFallback(name, email, message) {
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

if (form && successMessage) {
  const submitBtn = form.querySelector(".submit-btn");
  const defaultBtnHtml = submitBtn?.innerHTML;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields before sending your message.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Sending…';
    }

    try {
      await sendViaEmailJS(name, email, message);
      showContactSuccess(form, successMessage);
    } catch (emailJsError) {
      console.error("EmailJS error:", emailJsError);
      const hint = getEmailJsErrorMessage(emailJsError);

      try {
        await sendViaFormSubmit(name, email, message);
        showContactSuccess(form, successMessage);
      } catch (fallbackError) {
        console.error("FormSubmit error:", fallbackError);
        const tryMailto = confirm(
          (hint ||
            "Could not send your message automatically.") +
            "\n\nOpen your email app to send it manually?",
        );
        if (tryMailto) openMailtoFallback(name, email, message);
        else {
          alert(
            (hint || "Sending failed.") +
              "\n\nEmail me directly: " +
              CONTACT_EMAIL,
          );
        }
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = defaultBtnHtml;
      }
    }
  });
}
