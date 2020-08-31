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

const vhFix = () => {
  const setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
  setVh();
  window.addEventListener('resize', setVh);
};

const webp = () => {
  supportsWebp_commonJs.then(result => {
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

const headerPopup = () => {
  document.querySelectorAll('.js__header-popup_controller').forEach(control => {
    control.addEventListener('click', () => {
      if (window.innerWidth <= 768) toggleBodyScrollable();
      document.querySelectorAll('.js__header-popup_control').forEach(p => {
        p.classList.toggle('header-extended_active');
      });
      document.querySelectorAll('.js__header-popup_controller-content').forEach(c => {
        const content = c.innerHTML;
        c.innerHTML = c.getAttribute('data-popup-content');
        c.setAttribute('data-popup-content', content);
      });
    });
  });
};

const toggleBodyScrollable = () => {
  document.body.classList.toggle('noscroll');
};

webp();
headerPopup();
vhFix();
questionsManager();

//# sourceMappingURL=faq.js.map
