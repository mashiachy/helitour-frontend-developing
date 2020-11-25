// import { map } from 'lodash';
import { webp, headerPopup, vhFix, initBaseMap, initModal, openModal } from './base';

webp();
headerPopup();
vhFix();
/*initBaseMap('#js__map').then(map => {
  const infowindow = new google.maps.InfoWindow();
  const marker = new google.maps.Marker({
    map,
    position: {lat: 50.4578396, lng: 30.5683109},
    title: 'какой-то заголовок'
  });
  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(
      "<div><strong>" +
        "Helitour Киев" +
        "</strong><br>" +
        "Адрес" +
        "</div>"
    );
    infowindow.open(map, this);
  });
})*/

initModal('.modal-reserve');
initModal('.modal-thanks')
document.querySelectorAll('.js__open-modal-reserve').forEach(el =>
  el.addEventListener('click', e => {
    openModal('.modal-reserve');
    e.stopPropagation();
  })
);

const iframe = document.querySelector('#js__map iframe')
iframe.addEventListener('load', () => {
  iframe.contentWindow.querySelector('body').innerHtml += '<style>.place-card{display:none!important;}</style>'
})