import Swiper, { Pagination } from 'swiper';

Swiper.use(Pagination);

const swiperOne = new Swiper('.swiper-container--one', {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class=${className}></span>`;
    },
  },
});

const swiperTwo = new Swiper('.swiper-container--two', {
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    568: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: 2,
      spaceBetween: 20,
    }
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class=${className}></span>`;
    },
  },
});