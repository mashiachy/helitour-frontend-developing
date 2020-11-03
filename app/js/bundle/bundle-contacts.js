/*! npm.im/supports-webp 2.0.1 */

var index = new Promise(function (resolve) {
	var image = new Image();
	image.onerror = function () { return resolve(false); };
	image.onload = function () { return resolve(image.width === 1); };
	image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
}).catch(function () { return false; });

var supportsWebp_commonJs = index;

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

const loadMap = () => {
  const mapApiKey = 'AIzaSyBUevELRNQrstYsf6nlw74wsrukteZiguc';
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callback = () => {
      script.removeEventListener('load', callback);
      resolve(script);
    };
    script.addEventListener('load', callback);
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApiKey}`;
    script.async = true;
    document.head.appendChild(script);
  });
};

const initBaseMap = (container) => {
  return loadMap().then(() => {
    return new Promise(resolve => {
      let lat, lng;
      const latMeta = document.querySelector('meta[name="mapLat"]');
      if (latMeta)
        lat = Number.parseFloat(latMeta.getAttribute('content'));
      else
        lat = 50.434341;
      const lngMeta = document.querySelector('meta[name="mapLng"]');
      if (lngMeta)
        lng = Number.parseFloat(lngMeta.getAttribute('content'));
      else
        lng = 30.527756;
      console.log(lat, lng);
      const map = new google.maps.Map(document.querySelector(container), {
        center: { lat, lng },
        zoom: 14,
        disableDefaultUI: true,
        clickableIcons: false,
        styles: [
          {
            featureType: 'poi',
            stylers: [
              { visibility: 'off' }
            ]
          },
          {
            featureType: 'poi.park',
            stylers: [
              { visibility: 'on' }
            ]
          },
          {
            featureType: 'transit',
            stylers: [
              { visibility: 'off' }
            ]
          }
        ]
      });
      resolve(map);
    })
  });
};

webp();
headerPopup();
vhFix();
initBaseMap('#js__map');
