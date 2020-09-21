import supportsWebP from "supports-webp";
import Swiper from "swiper";

export const selectItemInit = () => {
  window.addEventListener('load', () => {
    window.activeSelectInput = null;
    document.querySelectorAll('.select-input').forEach(selectInput => {
      selectInput.querySelector('.select-input__value-block').addEventListener('click', e => {
        console.log('value-block clicked');
        const parent = e.target.parentElement;
        if (!parent.classList.contains('select-input_active')) {
          if (window.activeSelectInput) window.activeSelectInput.classList.remove('select-input_active');
          window.activeSelectInput = parent;
        } else {
          window.activeSelectInput = null;
        }
        parent.classList.toggle('select-input_active');
        e.stopPropagation();
      });
      selectInput.querySelectorAll('.select-input__dropdown-item').forEach(dropdownItem => {
        dropdownItem.addEventListener('click', e => {
          e.target.parentElement.parentElement.classList.remove('select-input_active');
          window.activeSelectInput = null;
          e.stopPropagation();
        });
      });
    });
    window.addEventListener('click', () => {
      if (window.activeSelectInput) window.activeSelectInput.classList.remove('select-input_active');
    });
  });
};

export const questionsManager = () => {
  document.querySelectorAll('[data-question]').forEach(question => {
    const anchor = question.querySelector('[data-question-anchor]');
    const disActive = e => {
      e.parentNode.style.maxHeight = `${e.clientHeight}px`;
      e.removeAttribute('data-question-anchor-active', 'true');
    };
    const active = e => {
      e.parentNode.style.maxHeight = `${e.parentNode.scrollHeight}px`;
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
      481: {
        slidesPerView: 2,
        spaceBetween: 10,
        centeredSlides: true,
      },
      992: {
        slidesPerView: 2,
        spaceBetween: 10,
        centeredSlides: false,
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

export const articlesSlider = () => {
  const articlesSlider = new Swiper('.our-articles .swiper-container', {
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
};

export const documentSlider = () => {
  const documentSlider = new Swiper('.license .swiper-container', {
    loop: true,
    loopAdditionalSlides: 1,
    slidesPerView: 'auto',
    loopedSlides: 1,
    spaceBetween: 10,
    centeredSlides: true,
    breakpoints: {
      420: {
        slidesPerView: 2,
        spaceBetween: 10,
        centeredSlides: true,
      },
      576: {
        slidesPerView: 3,
        spaceBetween: 10,
        centeredSlides: true,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 1,
        centeredSlides: false,
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
  const documentSliderElement = document.querySelector('.license .swiper-container');
  const length = 1 + Math.max(...Array.from(documentSliderElement.querySelectorAll('.swiper-wrapper .swiper-slide'))
    .map(el => Number.parseInt(el.getAttribute('data-swiper-slide-index'))));
  const paginationElement = documentSliderElement.querySelector('.swiper-pagination');
  const paginationVisible = () => {
    if (length <= 4 && window.innerWidth > 991) {
      paginationElement.style.display = 'none';
    } else {
      paginationElement.style.display = 'block';
    }
  };
  paginationVisible();
  window.addEventListener('resize', paginationVisible);
};

export const instagramSlider = () => {
  const instagramSlider = new Swiper('.our-instagram .swiper-container', {
    loop: true,
    loopAdditionalSlides: 1,
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      578: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      768: {
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
    if (length <= 3 && window.innerWidth >= 768) {
      paginationElement.style.display = 'none';
    } else {
      paginationElement.style.display = 'block';
    }
  };
  paginationVisible();
  window.addEventListener('resize', paginationVisible);
};

export const webp = () => {
  const handle = (domEl) => {
    if (window.webp) {
      domEl.querySelectorAll('[data-back-webp], [data-back-jpg]').forEach(el => {
        if (el.hasAttribute('data-back-webp'))
          el.style.backgroundImage = `url(${el.getAttribute('data-back-webp')})`;
        else
          el.style.backgroundImage = `url(${el.getAttribute('data-back-jpg')})`;
      });
    } else {
      domEl.querySelectorAll('[data-back-jpg]').forEach(el => {
        if (el.hasAttribute('data-back-jpg'))
          el.style.backgroundImage = `url(${el.getAttribute('data-back-jpg')})`;
      });
    }
  };
  const observer = new MutationObserver((mutationList, observer) => {
    mutationList.forEach(mutation => {
      if (mutation.target.querySelectorAll('[data-back-webp], [data-back-jpg]').length)
        handle(mutation.target);
    });
  });
  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true
  });
  supportsWebP.then(result => {
    window.webp = result;
    if (window.webp) {
      document.body.classList.add('webp');
    } else {
      document.body.classList.add('no-webp');
    }
    handle(document);
  });
};

export const headerPopup = () => {
  document.querySelectorAll('.js__header-popup_controller').forEach(controller => {
    controller.addEventListener('click', e => {
      if (window.innerWidth <= 768) toggleBodyScrollable();
      document.querySelectorAll('.js__header-popup_control').forEach(control => {
        control.classList.toggle('header-extended_active');
      });
      document.querySelectorAll('.js__header-popup_controller-content').forEach(c => {
        const content = c.innerHTML;
        c.innerHTML = c.getAttribute('data-popup-content');
        c.setAttribute('data-popup-content', content);
      });
      e.stopPropagation();
    });
  });
  let activeNav = null;
  document.querySelectorAll('.js__header-nav_control').forEach(control => {
    control.addEventListener('click', (e) => {
      let target = e.target;
      target.classList.toggle('active');
      const nav = target.parentElement.querySelector('.js__header-nav_controller');
      if (target.classList.contains('active')) {
        nav.style.maxHeight = `${nav.scrollHeight + 100}px`;
        if (activeNav) {
          activeNav.classList.remove('active');
          activeNav.parentElement.querySelector('.js__header-nav_controller').style.maxHeight = `0px`;
        }
        activeNav = target;
      } else {
        nav.style.maxHeight = `0px`;
        activeNav = null;
      }
      e.stopPropagation();
    });
  });
  document.querySelector('.header-extended.js__header-popup_control').addEventListener('click', e => {
    e.stopPropagation();
  });
  window.addEventListener('click', () => {
    if (activeNav) {
      activeNav.classList.remove('active');
      activeNav.parentElement.querySelector('.js__header-nav_controller').style.maxHeight = `0px`;
    }
    activeNav = null;

    let isActiveHeader = document.querySelector('.header-extended.js__header-popup_control')
      .classList.contains('header-extended_active');
    if (isActiveHeader) {
      if (window.innerWidth <= 768) {
        toggleBodyScrollable();
      }
      document.querySelectorAll('.js__header-popup_control').forEach(control => {
        control.classList.toggle('header-extended_active');
      });
      document.querySelectorAll('.js__header-popup_controller-content').forEach(c => {
        const content = c.innerHTML;
        c.innerHTML = c.getAttribute('data-popup-content');
        c.setAttribute('data-popup-content', content);
      });
    }
  });
};

const toggleBodyScrollable = () => {
  document.documentElement.classList.toggle('noscroll');
};

export const initModal = (modalSelector) => {
  document.querySelectorAll(modalSelector).forEach(modal => {
    modal.querySelector('[data-modal-body]').addEventListener('click', e => e.stopPropagation());
  });
  window.addEventListener('click', () => {
    closeModal(modalSelector);
  });
};

export const openModal = (modalSelector) => {
  document.documentElement.classList.add('noscroll');
  document.querySelector('.modal').classList.add('active');
  document.querySelectorAll(modalSelector).forEach(modal => {
    modal.classList.add('active', 'before-enter');
    modal.classList.add('enter');
    const handler = ({ target }) => {
      target.classList.remove('before-enter');
      target.classList.remove('enter');
      modal.removeEventListener('animationend', handler);
    };
    modal.addEventListener('animationend', handler);
  });
};

export const closeModal = (modalSelector) => {
  document.documentElement.classList.remove('noscroll');
  document.querySelectorAll(modalSelector).forEach(modal => {
    if (!modal.classList.contains('active'))
      return;
    modal.classList.add('leave');
    const handler = ({ target }) => {
      target.classList.add('after-leave');
      target.classList.remove('leave');
      target.classList.remove('active');
      target.classList.remove('after-leave');
      document.querySelector('.modal').classList.remove('active');
      modal.removeEventListener('animationend', handler);
    };
    modal.addEventListener('animationend', handler);
  });
};