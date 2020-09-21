import Swiper, { Pagination } from 'swiper';
import { webp, headerPopup, vhFix, articlesSlider} from './base';

webp();
headerPopup();
vhFix();

Swiper.use(Pagination);

const swiperOne = new Swiper('.swiper-container--one', {
  spaceBetween: 10,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class=${className}></span>`;
    },
  },
});

articlesSlider();