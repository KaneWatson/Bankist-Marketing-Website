'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window

const openModal = function (evt) {
  evt.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(el => {
  el.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////

btnScrollTo.addEventListener('click', scrollHandler);

function scrollHandler() {
  section1.scrollIntoView({ behavior: 'smooth' });
}

const navLinks = document.querySelector('.nav__links');

navLinks.addEventListener('click', smoothScroller);

function smoothScroller(e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id !== '#') {
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/// Tab component

tabContainer.addEventListener('click', evt => {
  const clicked = evt.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });

  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(tabContent => {
    tabContent.classList.remove('operations__content--active');
  });

  document
    .querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    .classList.add('operations__content--active');
});

// Menu fade animation

nav.addEventListener('mouseover', hoverHandler.bind(0.5));

nav.addEventListener('mouseout', hoverHandler.bind(1));

function hoverHandler(evt) {
  if (evt.target.classList.contains('nav__link')) {
    const link = evt.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sib => {
      if (sib !== link) {
        sib.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}

// sticky nav

const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

function stickyNav(entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
}

// Reveal sections on scroll

const sectionObserver = new IntersectionObserver(displaySection, {
  root: null,
  threshold: 0.1,
});

const sections = document.querySelectorAll('.section');
sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

function displaySection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

// Lazyloading images

const imageObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});
const images = document.querySelectorAll('img[data-src]');

images.forEach(image => {
  imageObserver.observe(image);
});

function revealImage(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  observer.unobserve(entry.target);
}

// Slider component
function slider() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;

  for (let i = 0; i < slides.length; i++) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  }

  initSlider(currentSlide);

  btnRight.addEventListener('click', slideRight);
  btnLeft.addEventListener('click', slideLeft);

  function slideRight() {
    if (currentSlide === slides.length - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    initSlider(currentSlide);
  }

  function slideLeft() {
    if (currentSlide === 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide--;
    }
    initSlider(currentSlide);
  }

  function goToSlide(slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  }

  document.addEventListener('keydown', keyPressSlide);

  function keyPressSlide(key) {
    if (key.keyCode === 39) {
      slideRight();
    }
    if (key.keyCode === 37) {
      slideLeft();
    }
  }

  dotsContainer.addEventListener('click', jumpToSlide);

  function jumpToSlide(e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      currentSlide = Number(slide);

      initSlider(slide);
    }
  }

  function activateDot(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  function initSlider(slide) {
    goToSlide(slide);
    activateDot(slide);
  }
}

slider();
