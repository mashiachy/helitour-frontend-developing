import Swiper, { Thumbs, Navigation, Pagination } from 'swiper';
import { initModal, openModal, instagramSlider, excursionsSlider, webp, headerPopup, vhFix } from './base';

webp();
headerPopup();
vhFix();

Swiper.use(Thumbs);
Swiper.use(Navigation);
Swiper.use(Pagination);

let player
let modalPlayer

const initSlider = () => {
  const swiperWrapper = document.querySelector('.thumb-slider .swiper-container .swiper-wrapper');
  if (!swiperWrapper) return
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
    if (player && window.innerWidth >= 1280) {
      const state = player.getPlayerState();
      if (state === 1 || state === 3 || state === 5) {
        player.pauseVideo();
      }
    }
  });
}
initSlider();
excursionsSlider();
instagramSlider();

const playerId = 'youtube-player';
const modalPlayerId = 'youtube-modal-player';
if (document.querySelectorAll('[data-youtube-player]').length) {
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

initModal('.modal-video', () => {
  console.log(modalPlayer)
  const state = modalPlayer.getPlayerState();
  if (state === 1 || state === 3 || state === 5) {
    modalPlayer.pauseVideo();
  }
})
let globalVideoId
document.querySelectorAll('.js__open-modal-video').forEach(el =>
  el.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    let t = e.target.hasAttribute('data-youtube-player') ? e.target : e.target.parentNode
    let videoId = t.getAttribute('data-youtube-player')
    openModal('.modal-video').then(() => {
      if (YT) {
        if (!modalPlayer) {
          modalPlayer = new YT.Player(modalPlayerId, {
            height: '100%',
            width: '100%',
            videoId
          });
          globalVideoId = videoId
        } else {
          if (videoId !== globalVideoId) {
            modalPlayer.loadVideoById(videoId)
            globalVideoId = videoId
          }
        }
      }
    })
  })
);