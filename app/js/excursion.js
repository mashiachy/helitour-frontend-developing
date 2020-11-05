import {
  webp,
  headerPopup,
  vhFix,
  excursionsSlider,
  instagramSlider,
  initBaseMap,
  MAP_POLYGON_CONFIG,
  INIT_DOUGLAS_PEUCKER, MAP_MARKER_CONFIG, INIT_MARKERS_ANIMATION
} from './base';
import Swiper, {Pagination} from 'swiper';
import axios from 'axios';

webp();
headerPopup();
vhFix();
initBaseMap('#js__map')
  .then(async (map) => {
    INIT_DOUGLAS_PEUCKER(map);
    INIT_MARKERS_ANIMATION(map);
    const excursionMeta = document.querySelector('meta[name="excursionId"]');
    if (!excursionMeta) return;
    const excursionId = excursionMeta.getAttribute('content');
    const { path, markers } = (await axios.get(`./api/excursions-map.json?ID=${excursionId}`)).data;

    // Draw path
    const tripPath = new google.maps.Polygon(MAP_POLYGON_CONFIG);
    tripPath.setSmoothPath(path);
    tripPath.setMap(map);

    // Draw markers
    const tripMarkers = [];
    markers.forEach(({ id, latLng }) => {
      tripMarkers.push({
        id,
        marker: new google.maps.Marker({
          ...MAP_MARKER_CONFIG(),
          map,
          position: latLng
        })
      });
    });

    // Add listeners to pulse markers
    tripMarkers.forEach(marker => {
      const controlEl = document.querySelector(`[data-marker="${marker.id}"]`);
      if (!controlEl) return;
      controlEl.addEventListener('mouseenter', () => {
        marker.marker.startAnimation();
      })
      controlEl.addEventListener('mouseleave', () => {
        marker.marker.stopAnimation();
      })
    });
  });

Swiper.use(Pagination);

excursionsSlider();
instagramSlider();

window.addEventListener('scroll', () => {
  const controllerElement = document.getElementById('js__fixed-visible-controller');
  if (!controllerElement) return;
  const controllerLength = controllerElement.scrollHeight;
  const control = document.getElementById('js__fixed-visible-control');
  if (!control) return;
  if (window.pageYOffset >= controllerLength) {
    if (!control.classList.contains('active'))
      control.classList.add('active');
  } else {
    if (control.classList.contains('active'))
      control.classList.remove('active');
  }
}, { passive: true });