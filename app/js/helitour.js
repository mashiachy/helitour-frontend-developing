import Swiper, { Thumbs, Navigation, Pagination } from 'swiper';
import { instagramSlider, excursionsSlider, webp, headerPopup, vhFix } from './base';

webp();
headerPopup();
vhFix();

Swiper.use(Thumbs);
Swiper.use(Navigation);
Swiper.use(Pagination);

const initSlider = () => {
  const swiperWrapper = document.querySelector('.thumb-slider .swiper-container .swiper-wrapper');
  if (!swiperWrapper) return;
  const len = swiperWrapper.children.length;
  const thumbSlider = new Swiper('.thumb-slider .swiper-container', {
    slidesPerView: len > 5 ? 5 : len,
    slideToClickedSlide: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  const helicopterSlider = new Swiper('.main-slider', {
    slidesPerView: 1,
    touchMoveStopPropagation: true,
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
  helicopterSlider.on('slideChange', () => {
    const state = player.getPlayerState();
    if (state === 1 || state === 3 || state === 5) {
      player.pauseVideo();
    }
  });
}

excursionsSlider();
instagramSlider();

let player;
const playerId = 'youtube-player';
if (document.querySelector(playerId)) {
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  script.async = true;
  const handle = () => {
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player(playerId, {
        height: '100%',
        width: '100%',
        videoId: document.getElementById(playerId).getAttribute('data-youtube-player'),
      });
    };
    script.removeEventListener('load', handle);
  };
  script.addEventListener('load', handle)
  document.head.appendChild(script);
}