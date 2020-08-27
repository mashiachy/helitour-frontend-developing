import Swiper, { Thumbs, Navigation, Pagination } from 'swiper';
import supportsWebP from 'supports-webp';

supportsWebP.then(result => {
  if (result) {
    document.querySelectorAll('[data-back-webp], [data-back-jpg]').forEach(el => {
      if (el.hasAttribute('data-back-webp'))
        el.style.backgroundImage = `url(${el.getAttribute('data-back-webp')})`;
      else
        el.style.backgroundImage = `url(${el.getAttribute('data-back-jpg')})`;
    });
  } else {
    document.querySelectorAll('[data-back-jpg]').forEach(el => {
      if (el.hasAttribute('data-back-jpg'))
        el.style.backgroundImage = `url(${el.getAttribute('data-back-jpg')})`;
    });
  }
});

Swiper.use(Thumbs);
Swiper.use(Navigation);
Swiper.use(Pagination);

const len = document.querySelector('.thumb-slider .swiper-container .swiper-wrapper').children.length;
const thumbSlider = new Swiper('.thumb-slider .swiper-container', {
  slidesPerView: len > 5 ? 5 : len,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

const helicopterSlider = new Swiper('.main-slider', {
  slidesPerView: 1,
  thumbs: {
    swiper: thumbSlider,
  },
});

const excursionsSlider = new Swiper('.our-excursions .swiper-container', {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
  loopAdditionalSlides: 1,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class=${className}></span>`;
    },
  },
});