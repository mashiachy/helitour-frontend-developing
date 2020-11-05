/*! npm.im/supports-webp 2.0.1 */

var index = new Promise(function (resolve) {
	var image = new Image();
	image.onerror = function () { return resolve(false); };
	image.onload = function () { return resolve(image.width === 1); };
	image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
}).catch(function () { return false; });

var supportsWebp_commonJs = index;

const questionsManager = () => {
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

const vhFix = () => {
  const setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
  setVh();
  window.addEventListener('resize', setVh);
};

const webp = () => {
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
  supportsWebp_commonJs.then(result => {
    window.webp = result;
    if (window.webp) {
      document.body.classList.add('webp');
    } else {
      document.body.classList.add('no-webp');
    }
    handle(document);
  });
};

const headerPopup = () => {
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
      if (!nav) return;
      if (target.classList.contains('active')) {
        nav.style.maxHeight = `${nav.scrollHeight + 100}px`;
        if (activeNav) {
          activeNav.classList.remove('active');
          const navController = activeNav.parentElement.querySelector('.js__header-nav_controller');
          if (navController) navController.style.maxHeight = `0px`;
        }
        activeNav = target;
      } else {
        nav.style.maxHeight = `0px`;
        activeNav = null;
      }
      e.stopPropagation();
    });
  });
  const headerController = document.querySelector('.header-extended.js__header-popup_control');
  if (headerController) {
    headerController.addEventListener('click', e => {
      e.stopPropagation();
    });
  }  
  window.addEventListener('click', () => {
    if (activeNav) {
      activeNav.classList.remove('active');
      const navController = activeNav.parentElement.querySelector('.js__header-nav_controller');
      if (navController)
        navController.style.maxHeight = `0px`;
    }
    activeNav = null;

    const activeHeader = document.querySelector('.header-extended.js__header-popup_control');
    let isActiveHeader = false;
    if (activeHeader) {
      isActiveHeader = activeHeader.classList.contains('header-extended_active');
    }
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

webp();
headerPopup();
vhFix();
questionsManager();
