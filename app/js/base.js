import supportsWebP from "supports-webp";
import Swiper from "swiper";

export const questionsManager = () => {
  document.querySelectorAll('[data-question]').forEach(question => {
    const anchor = question.querySelector('[data-question-anchor]');
    const disActive = e => {
      e.parentNode.style.maxHeight = `${e.clientHeight}px`;
      e.removeAttribute('data-question-anchor-active', 'true');
    };
    const active = e => {
      e.parentNode.style.maxHeight = '1000px';
      e.setAttribute('data-question-anchor-active', true);
    };
    disActive(anchor);
    anchor.addEventListener('click', ({ target }) => {
      if (target.hasAttribute('data-question-anchor-active')) {
        disActive(target);
      } else {
        active(target);
      }
    });
  });
};

export const vhFix = () => {
  const setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
  setVh();
  window.addEventListener('resize', setVh);
};

export const excursionsSlider = () => {
  const excursionsSlider = new Swiper('.our-excursions .swiper-container', {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
    breakpoints: {
      461: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
    loop: true,
    loopAdditionalSlides: 1,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        return `<span class=${className}></span>`;
      },
    },
  });
};

export const instagramSlider = () => {
  const instagramSlider = new Swiper('.our-instagram .swiper-container', {
    loop: true,
    loopAdditionalSlides: 1,
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      460: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      577: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        return `<span class=${className}></span>`;
      },
    },
  });
  const instagramSliderElement = document.querySelector('.our-instagram .swiper-container');
  const length = 1 + Math.max(...Array.from(instagramSliderElement.querySelectorAll('.swiper-wrapper .swiper-slide'))
    .map(el => Number.parseInt(el.getAttribute('data-swiper-slide-index'))));
  const paginationElement = instagramSliderElement.querySelector('.swiper-pagination');
  const paginationVisible = () => {
    if (length <= 3 && window.innerWidth >= 578) {
      paginationElement.style.display = 'none';
    } else {
      paginationElement.style.display = 'block';
    }
  };
  paginationVisible();
  window.addEventListener('resize', paginationVisible);
};

export const webp = () => {
  supportsWebP.then(result => {
    if (result) {
      document.querySelectorAll('[data-back-webp], [data-back-jpg]').forEach(el => {
        if (el.hasAttribute('data-back-webp'))
          el.style.backgroundImage = `url(${el.getAttribute('data-back-webp')})`;
        else
          el.style.backgroundImage = `url(${el.getAttribute('data-back-jpg')})`;
      });
    } else {
      document.querySelectorAll('[data-back-jpg]').forEach(el => {
        if (el.hasAttribute('data-back-jpg'))
          el.style.backgroundImage = `url(${el.getAttribute('data-back-jpg')})`;
      });
    }
  });
};