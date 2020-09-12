import {webp, headerPopup, vhFix, excursionsSlider, initModal, openModal, closeModal} from './base';
import Swiper, {Pagination} from 'swiper';

webp();
headerPopup();
vhFix();

Swiper.use(Pagination);

excursionsSlider();

initModal('.modal-document');
document.querySelectorAll('.js__open-modal-document').forEach(control => {
  control.addEventListener('click', e => {
    const target = e.target;
    document.querySelector('.modal-document img')
      .setAttribute('src',
        target.getAttribute(
          window.webp ?
            'data-popup-webp' :
            'data-popup-jpg'
        )
      );
    document.querySelector('.modal-document img')
      .setAttribute('alt',
        target.getAttribute('data-popup-alt')
      );
    openModal('.modal-document');
    e.stopPropagation();
  });
});

document.querySelectorAll('.js__close-modal-document').forEach(control => {
  control.addEventListener('click', e => {
    closeModal('.modal-document');
    e.stopPropagation();
  });
});