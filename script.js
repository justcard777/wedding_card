const opening = document.getElementById("opening");
const mainSite = document.getElementById("mainSite");
const envelope = document.getElementById("envelope");
const openButton = document.getElementById("openInvitation");
const audio = document.getElementById("weddingAudio"); // Get your audio element
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

openButton.addEventListener("click", async () => {
  // 1. Try to play the background music immediately on button click
  if (audio) {
    try {
      await audio.play();
      if (musicLabel) musicLabel.textContent = "Music On";
      if (musicToggle) musicToggle.setAttribute("aria-pressed", "true");
    } catch (error) {
      console.log("Autoplay prevented or audio file missing:", error);
      if (musicLabel) musicLabel.textContent = "Play Music";
    }
  }

  // 2. Open the invitation transition
  opening.classList.add("opened");
  openButton.disabled = true;
  window.setTimeout(() => {
    opening.classList.add("fade-away");
    opening.style.transition = "opacity .8s ease";
    opening.style.opacity = "0";
    mainSite.classList.remove("hidden");
    document.body.style.overflow = "auto";
    window.setTimeout(() => opening.remove(), 850);
  }, 1050);
});

// Countdown target: 2 February 2027, 6:00 PM Indian Standard Time (UTC+05:30).
const weddingDate = new Date("2027-02-02T18:00:00+05:30").getTime();
const pad = value => String(value).padStart(2, "0");

function updateCountdown() {
  const remaining = weddingDate - Date.now();
  const days = Math.max(0, Math.floor(remaining / 86400000));
  const hours = Math.max(0, Math.floor((remaining % 86400000) / 3600000));
  const minutes = Math.max(0, Math.floor((remaining % 3600000) / 60000));
  const seconds = Math.max(0, Math.floor((remaining % 60000) / 1000));

  document.getElementById("days").textContent = String(days).padStart(3, "0");
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("minutes").textContent = pad(minutes);
  document.getElementById("seconds").textContent = pad(seconds);
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// Music toggle manual control
if (musicToggle && audio) {
  musicToggle.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        musicLabel.textContent = "Music On";
        musicToggle.setAttribute("aria-pressed", "true");
      } catch (error) {
        musicLabel.textContent = "Add Music";
        alert("Please add your wedding instrumental MP3 as assets/audio/wedding-music.mp3, then try again.");
      }
    } else {
      audio.pause();
      musicLabel.textContent = "Music Off";
      musicToggle.setAttribute("aria-pressed", "false");
    }
  });
}

// Keep the invitation from scrolling behind the opening cover.
document.body.style.overflow = "hidden";

// Gentle falling petals and scroll reveals. Both are deliberately lightweight.
const petalLayer = document.getElementById("petalLayer");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (petalLayer && !reducedMotion) {
  const petalCount = window.matchMedia("(max-width: 700px)").matches ? 7 : 11;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${(i * 37 + 9) % 100}%`;
    petal.style.setProperty("--delay", `${(i * 1.7) % 13}s`);
    petal.style.setProperty("--duration", `${12 + (i % 5) * 1.8}s`);
    petal.style.setProperty("--sway", `${18 + (i % 4) * 13}px`);
    petalLayer.appendChild(petal);
  }
}

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealItems = document.querySelectorAll(
    ".section-heading, .couple-card, .event-card, .countdown-section, .venue-inner, .footer > *"
  );
  revealItems.forEach(item => item.classList.add("js-reveal"));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach(item => revealObserver.observe(item));
}