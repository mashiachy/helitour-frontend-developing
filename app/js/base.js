import supportsWebP from "supports-webp";
import Swiper from "swiper";
import axios from 'axios';
// import smooth from 'chaikin-smooth';
// import { reject } from "lodash";

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
  const container = document.querySelector('.our-excursions .swiper-container');
  if (!container) return;
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
  window.excursionClick = function (tripId) {
    axios.post('./booking.html', JSON.stringify({ tripId, helicopterId: null }))
  }
};

export const articlesSlider = () => {
  const container = document.querySelector('.our-articles .swiper-container');
  if (!container) return;
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
  const documentSliderElement = document.querySelector('.license .swiper-container');
  if (!documentSliderElement) return;
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
  // const documentSliderElement = document.querySelector('.license .swiper-container');
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
  const instagramSliderElement = document.querySelector('.our-instagram .swiper-container');
  if (!instagramSliderElement) return;
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
  // const instagramSliderElement = document.querySelector('.our-instagram .swiper-container');
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
      if (!nav) return;
      if (target.classList.contains('active')) {
        nav.style.maxHeight = `${nav.scrollHeight + 100}px`;
        if (activeNav) {
          activeNav.classList.remove('active');
          const navController = activeNav.parentElement.querySelector('.js__header-nav_controller')
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
  const headerController = document.querySelector('.header-extended.js__header-popup_control')
  if (headerController) {
    headerController.addEventListener('click', e => {
      e.stopPropagation();
    });
  }  
  window.addEventListener('click', () => {
    if (activeNav) {
      activeNav.classList.remove('active');
      const navController = activeNav.parentElement.querySelector('.js__header-nav_controller')
      if (navController)
        navController.style.maxHeight = `0px`;
    }
    activeNav = null;

    const activeHeader = document.querySelector('.header-extended.js__header-popup_control')
    let isActiveHeader = false
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

export const initModal = (modalSelector) => {
  document.querySelectorAll(modalSelector).forEach(modal => {
    const modalBody = modal.querySelector('[data-modal-body]')
    if (modalBody)
      modalBody.addEventListener('click', e => e.stopPropagation());
  });
  window.addEventListener('click', () => {
    closeModal(modalSelector);
  });
};

const openThanksHandler = () => {
  closeModal('.modal-reserve').then(() => openModal('.modal-thanks'))
}

export const openModal = (modalSelector) => {
  return new Promise((resolve, _) => {
    document.documentElement.classList.add('noscroll');
    const modalW = document.querySelector('.modal')
    if (modalW)
      modalW.classList.add('active');
    document.querySelectorAll(modalSelector).forEach(modal => {
      modal.classList.add('active', 'before-enter');
      modal.classList.add('enter');
      const handler = ({ target }) => {
        target.classList.remove('before-enter');
        target.classList.remove('enter');
        modal.removeEventListener('animationend', handler);
        resolve();
      };
      modal.addEventListener('animationend', handler);
      const openThanksButton = modal.querySelector('.js__open-thanks')
      if (openThanksButton) {
        openThanksButton.addEventListener('click', openThanksHandler)
      }
    });
  })
};

export const closeModal = (modalSelector) => {
  return new Promise((resolve, _) => {
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
        const newModal = document.querySelector('.modal')
        if (newModal)
          newModal.classList.remove('active');
        modal.removeEventListener('animationend', handler);
        resolve()
      };
      modal.addEventListener('animationend', handler);
      const openThanksButton = modal.querySelector('.js__open-thanks')
      if (openThanksButton) {
        openThanksButton.removeEventListener('click', openThanksHandler)
      }
    });
  })
};

export const loadMap = () => {
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

export const initBaseMap = (container) => {
  return loadMap().then(() => {
    return new Promise((resolve, reject) => {
      const containerElement = document.querySelector(container);
      if (!containerElement) reject();
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
      const map = new google.maps.Map(containerElement, {
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

export const MAP_POLYGON_CONFIG = {
  strokeColor: '#0facd0',
  strokeOpacity: 1,
  strokeWeight: 3,
  fillColor: '#0facd0',
  fillOpacity: 0,
  draggable: false,
  geodesic: false,
  clickable: false
}

export const MAP_MARKER_CONFIG = () => ({
  draggable: false,
  clickable: false,
  icon: {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#0facd0',
    fillOpacity: 1,
    anchor: new google.maps.Point(0,0),
    strokeWeight: 0,
    scale: 10
  }
})

export const INIT_MARKERS_ANIMATION = (map) => {
  google.maps.Marker.prototype.animateInterval = null;
  google.maps.Marker.prototype.i = 1;
  google.maps.Marker.prototype.startAnimation = function() {
    this.setDefaultScale()
    this.animateInterval = setInterval(this.animateHandler.bind(this), 5)
  }
  google.maps.Marker.prototype.stopAnimation = function() {
    clearInterval(this.animateInterval)
    this.animateInterval = null
    this.setDefaultScale()
  }
  google.maps.Marker.prototype.animateHandler = function() {
    const s = this.getIcon();
    s.scale = s.scale + this.i * 0.1
    this.setIcon(s)
    const f = Math.floor(s.scale)
    if (f === 20) this.i = -1
    if (f === 10) this.i = 1
  }
  google.maps.Marker.prototype.setDefaultScale = function() {
    this.i = 1
    const s = this.getIcon()
    s.scale = 10
    this.setIcon(s)
  }
}

export const INIT_DOUGLAS_PEUCKER = (map) => {
  google.maps.Polygon.prototype.douglasPeucker = function(tolerance) {
    let res = null;
    tolerance = tolerance * Math.pow(2, 20 - map.getZoom());
    if(this.getPath() && this.getPath().getLength()) {
      const points = this.getPath().getArray();

      const Line = function( p1, p2 ) {
        this.p1 = p1;
        this.p2 = p2;

        this.distanceToPoint = function( point ) {
          let m = ( this.p2.lat() - this.p1.lat() ) / ( this.p2.lng() - this.p1.lng() ),
            b = this.p1.lat() - ( m * this.p1.lng() ),
            d = [];
          d.push( Math.abs( point.lat() - ( m * point.lng() ) - b ) / Math.sqrt( Math.pow( m, 2 ) + 1 ) );
          d.push( Math.sqrt( Math.pow( ( point.lng() - this.p1.lng() ), 2 ) + Math.pow( ( point.lat() - this.p1.lat() ), 2 ) ) );
          d.push( Math.sqrt( Math.pow( ( point.lng() - this.p2.lng() ), 2 ) + Math.pow( ( point.lat() - this.p2.lat() ), 2 ) ) );
          return d.sort((a, b) => a - b)[0];
        };
      };

      const douglasPeucker = function( points, tolerance ) {
        if ( points.length <= 2 ) {
          return [points[0]];
        }
        let returnPoints = [],
          line = new Line( points[0], points[points.length - 1] ),
          maxDistance = 0,
          maxDistanceIndex = 0,
          p;
        for(let i = 1; i <= points.length - 2; i++) {
          const distance = line.distanceToPoint(points[i]);
          if( distance > maxDistance ) {
            maxDistance = distance;
            maxDistanceIndex = i;
          }
        }
        if (maxDistance >= tolerance) {
          p = points[maxDistanceIndex];
          line.distanceToPoint( p, true );
          returnPoints = returnPoints.concat(douglasPeucker(points.slice( 0, maxDistanceIndex + 1), tolerance));
          returnPoints = returnPoints.concat(douglasPeucker(points.slice( maxDistanceIndex, points.length ), tolerance));
        } else {
          p = points[maxDistanceIndex];
          line.distanceToPoint( p, true );
          returnPoints = [points[0]];
        }
        return returnPoints;
      };
      res = douglasPeucker(points, tolerance);
      res.push(points[points.length - 1 ]);
      this.setPath(res);
    }
    return this;
  }
  const EARTH_RADIUS = 6378137.0
  google.maps.Polygon.prototype.setSmoothPath = function(path) {
    this.setPath(path)
    this.douglasPeucker(360.0 / (2.0 * Math.PI * EARTH_RADIUS))
    // this.setPath(smooth(smooth(this.getPath().i.map(({ lat, lng }) => [ lat(), lng() ])))
    //   .map(([ lat, lng ]) => ({ lat, lng }))
    // )
  }
}