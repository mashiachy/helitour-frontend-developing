import { webp, headerPopup, vhFix, initBaseMap, initModal, openModal } from './base';

webp();
headerPopup();
vhFix();
initBaseMap('#js__map');

initModal('.modal-reserve');
initModal('.modal-thanks')
document.querySelectorAll('.js__open-modal-reserve').forEach(el =>
  el.addEventListener('click', e => {
    openModal('.modal-reserve');
    e.stopPropagation();
  })
);