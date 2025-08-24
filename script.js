// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Mobile menu toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    // Animate hamburger icon
    const lines = hamburger.querySelectorAll("line");
    if (navLinks.classList.contains("active")) {
      // Transform to X
      lines[0].setAttribute("transform", "rotate(45 12 12)");
      lines[1].setAttribute("opacity", "0");
      lines[2].setAttribute("transform", "rotate(-45 12 12)");
    } else {
      // Transform back to hamburger
      lines[0].setAttribute("transform", "rotate(0)");
      lines[1].setAttribute("opacity", "1");
      lines[2].setAttribute("transform", "rotate(0)");
    }
  });

  // Close mobile menu when clicking on a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      // Reset hamburger icon
      const lines = hamburger.querySelectorAll("line");
      lines[0].setAttribute("transform", "rotate(0)");
      lines[1].setAttribute("opacity", "1");
      lines[2].setAttribute("transform", "rotate(0)");
    });
  });
}

// Intersection Observer for animations
const observerOptions = {
  root: null,
  rootMargin: "-50px",
  threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Add staggered animation for skills and projects
      if (entry.target.classList.contains("skill-category")) {
        const skills = entry.target.querySelectorAll(".skill-item");
        skills.forEach((skill, index) => {
          setTimeout(() => {
            skill.style.opacity = "1";
            skill.style.transform = "translateY(0)";
          }, index * 100);
        });
      }

      if (entry.target.classList.contains("project-card")) {
        const tags = entry.target.querySelectorAll(".project-tag");
        tags.forEach((tag, index) => {
          setTimeout(() => {
            tag.style.opacity = "1";
            tag.style.transform = "translateY(0) scale(1)";
          }, index * 150);
        });
      }
    }
  });
}, observerOptions);

// Observe elements for animation
const elementsToAnimate = document.querySelectorAll(
  ".timeline-item, .project-card, .skill-category, .contact-item"
);

elementsToAnimate.forEach((element) => {
  observer.observe(element);
});

// Initialize skill items and project tags as hidden for animation
document.querySelectorAll(".skill-item").forEach((skill) => {
  skill.style.opacity = "0";
  skill.style.transform = "translateY(20px)";
  skill.style.transition = "opacity 0.5s ease, transform 0.5s ease";
});

document.querySelectorAll(".project-tag").forEach((tag) => {
  tag.style.opacity = "0";
  tag.style.transform = "translateY(10px) scale(0.8)";
  tag.style.transition = "opacity 0.5s ease, transform 0.5s ease";
});

// Header background change on scroll
let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Change header opacity based on scroll
  if (scrollTop > 100) {
    header.style.background =
      "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)";
    header.style.backdropFilter = "blur(10px)";
  } else {
    header.style.background =
      "linear-gradient(135deg, #111827 0%, #1f2937 100%)";
    header.style.backdropFilter = "none";
  }

  // Hide/show header on scroll
  if (scrollTop > lastScrollTop && scrollTop > 200) {
    // Scrolling down
    header.style.transform = "translateY(-100%)";
  } else {
    // Scrolling up
    header.style.transform = "translateY(0)";
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Animate counter numbers (for achievements)
function animateCounters() {
  const counters = document.querySelectorAll(".badge span");

  counters.forEach((counter) => {
    const text = counter.textContent;
    const numbers = text.match(/\d+/);

    if (numbers) {
      const finalNumber = parseInt(numbers[0]);
      let currentNumber = 0;
      const increment = finalNumber / 50;
      const duration = 2000; // 2 seconds
      const stepTime = duration / 50;

      const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
          currentNumber = finalNumber;
          clearInterval(timer);
        }

        const newText = text.replace(/\d+/, Math.floor(currentNumber));
        counter.textContent = newText;
      }, stepTime);
    }
  });
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 1000); // Delay for better effect
        heroObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroSection = document.querySelector(".hero");
if (heroSection) {
  heroObserver.observe(heroSection);
}

// Form submission handling
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name =
      formData.get("name") ||
      contactForm.querySelector('input[placeholder="Your Name"]').value;
    const email =
      formData.get("email") ||
      contactForm.querySelector('input[placeholder="Your Email"]').value;
    const subject =
      formData.get("subject") ||
      contactForm.querySelector('input[placeholder="Subject"]').value;
    const message =
      formData.get("message") || contactForm.querySelector("textarea").value;

    // Basic validation
    if (!name || !email || !message) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Reset form
      contactForm.reset();

      showNotification(
        "Thank you! Your message has been sent successfully.",
        "success"
      );
    }, 2000);
  });
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existing = document.querySelector(".notification");
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

  // Set background based on type
  if (type === "success") {
    notification.style.background =
      "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  } else if (type === "error") {
    notification.style.background =
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
  } else {
    notification.style.background =
      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Close functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Add loading animation for page
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // Animate hero elements
  const heroText = document.querySelector(".hero-text");
  const heroImage = document.querySelector(".hero-image");

  if (heroText) {
    setTimeout(() => {
      heroText.style.opacity = "1";
      heroText.style.transform = "translateY(0)";
    }, 300);
  }

  if (heroImage) {
    setTimeout(() => {
      heroImage.style.opacity = "1";
      heroImage.style.transform = "translateY(0)";
    }, 600);
  }
});

// Initialize hero animations
document.addEventListener("DOMContentLoaded", () => {
  const heroText = document.querySelector(".hero-text");
  const heroImage = document.querySelector(".hero-image");

  if (heroText) {
    heroText.style.opacity = "0";
    heroText.style.transform = "translateY(30px)";
    heroText.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  }

  if (heroImage) {
    heroImage.style.opacity = "0";
    heroImage.style.transform = "translateY(30px)";
    heroImage.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  }
});

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");

  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Uncomment to enable typing effect
// document.addEventListener('DOMContentLoaded', () => {
//     const heroTitle = document.querySelector('.hero h1');
//     if (heroTitle) {
//         const originalText = heroTitle.textContent;
//         setTimeout(() => {
//             typeWriter(heroTitle, originalText, 80);
//         }, 1000);
//     }
// });

// Read More Functionality
document.addEventListener('DOMContentLoaded', function() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const projectDescription = this.closest('.project-description');
            const projectCard = this.closest('.project-card');
            const dots = projectDescription.querySelector('.dots');
            const moreText = projectDescription.querySelector('.more-text');
            
            if (dots.style.display === 'none') {
                // Collapse
                dots.style.display = 'inline';
                moreText.style.display = 'none';
                this.textContent = 'read more';
                projectCard.classList.remove('expanded');
                
                // Smooth scroll to card if it's out of view
                setTimeout(() => {
                    projectCard.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
            } else {
                // Expand
                dots.style.display = 'none';
                moreText.style.display = 'inline';
                this.textContent = 'read less';
                projectCard.classList.add('expanded');
            }
        });
    });
});
console.log(
  "🚀 Prince Chouhan Portfolio - Interactive features loaded successfully!"
);
