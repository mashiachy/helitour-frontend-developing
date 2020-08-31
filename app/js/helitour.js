import Swiper, { Thumbs, Navigation, Pagination } from 'swiper';
import supportsWebP from 'supports-webp';
import { instagramSlider, excursionsSlider, webp, headerPopup, vhFix } from './base';

webp();
headerPopup();
vhFix();

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
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class=${className}></span>`;
    },
  },
});

excursionsSlider();

instagramSlider();