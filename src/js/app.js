import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis';
import SplitType from 'split-type';
import Swup from 'swup';
import SwupPreloadPlugin from '@swup/preload-plugin';
// import SwupParallelPlugin from '@swup/parallel-plugin'; // Uncomment if needed

gsap.registerPlugin(ScrollTrigger);

// Initialize SplitType
const text = new SplitType('#compass', { types: 'words, chars' });

// Animate characters into view with a stagger effect
gsap.from(text.chars, {
  opacity: 0,
  y: 25,
  duration: 0.5,
  stagger: { amount: 0.5 }
});

// Initialize Swup with Preload Plugin
const swup = new Swup({
  plugins: [
    new SwupPreloadPlugin()
    // new SwupParallelPlugin() // Uncomment if needed
  ]
});

// Navigation Highlighter Function
function init() {
  if (document.querySelector('#pagenav')) {
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", navHighlighter);

    function navHighlighter() {
      let scrollY = window.pageYOffset;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 260;
        let sectionId = current.getAttribute("id");

        if (
          scrollY > sectionTop &&
          scrollY <= sectionTop + sectionHeight
        ) {
          document.querySelector(".pagenav a[href*=" + sectionId + "]").classList.add("active");
        } else {
          document.querySelector(".pagenav a[href*=" + sectionId + "]").classList.remove("active");
        }
      });
    }
  }
}

if (document.readyState === 'complete') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', () => init());
}

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

ScrollTrigger.normalizeScroll(true);

// Example GSAP ScrollTrigger Animations
const callout = gsap.timeline({
  scrollTrigger: {
    trigger: ".callout",
    pin: true,   // pin the trigger element while active
    start: "top top", // when the top of the trigger hits the top of the viewport
    end: "+=2500", // end after scrolling 2500px beyond the start
    pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
    scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
    smoothTouch: 0.1,
    pinSpacing: "margin"
  }
});

// Video Scrubbing Animation
const coolVideo = document.querySelector(".scrubvideo");

if (coolVideo) {
  let scrubtl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scrubvideo",
      start: "top bottom",
      end: "bottom+=200% bottom",
      scrub: true
    }
  });

  // Wait until video metadata is loaded to get duration
  coolVideo.onloadedmetadata = function () {
    scrubtl.to(coolVideo, { currentTime: coolVideo.duration });
  };

  // Handle touch devices
  function isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  if (isTouchDevice()) {
    coolVideo.play();
    coolVideo.pause();
  }
}
