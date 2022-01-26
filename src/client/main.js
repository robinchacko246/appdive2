"use-strict";
function toggleFab() {
  const fab_button = document.querySelector(".fab-button");
  const fab_content = document.querySelector(".fab-content");
  fab_content.classList.toggle("hidden");
}

// accordian for event section

let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

// header on scroll sticky
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 10);
});

document.addEventListener("DOMContentLoaded", function () {
  new Splide("#splide", {
    type: "loop",
    perPage: 1,
    autoplay: true,
    interval: 4000,
    pauseOnHover: false,
    pauseOnFocus: false,
    updateOnMove: true,
    pagination: true,
  }).mount();

  new Splide("#footer-splide", {
    type: "loop",
    perPage: 1,
    autoplay: true,
    interval: 4000,
    pauseOnHover: false,
    pauseOnFocus: false,
    updateOnMove: true,
    pagination: true,
  }).mount();
});
