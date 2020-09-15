import {webp, headerPopup, vhFix, excursionsSlider, instagramSlider} from './base';
import Swiper, {Pagination} from 'swiper';

webp();
headerPopup();
vhFix();

Swiper.use(Pagination);

excursionsSlider();
instagramSlider();

window.addEventListener('scroll', () => {
  const controllerLength = document.getElementById('js__fixed-visible-controller').scrollHeight;
  const control = document.getElementById('js__fixed-visible-control');
  if (window.pageYOffset >= controllerLength) {
    if (!control.classList.contains('active'))
      control.classList.add('active');
  } else {
    if (control.classList.contains('active'))
      control.classList.remove('active');
  }
}, { passive: true });