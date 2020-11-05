import Vue from 'vue';
import axios from 'axios';
import {webp, headerPopup, vhFix, questionsManager, excursionsSlider, articlesSlider, documentSlider, initModal, openModal, closeModal} from './base';
import Swiper, {Pagination} from 'swiper';

webp();
headerPopup();
vhFix();

Swiper.use(Pagination);

excursionsSlider();
articlesSlider();
documentSlider();
questionsManager();

initModal('.modal-document');
document.querySelectorAll('.js__open-modal-document').forEach(control => {
  control.addEventListener('click', e => {
    const target = e.target;
    document.querySelector('.modal-document img')
      .setAttribute('src',
        target.getAttribute(
          window.webp ?
            'data-popup-webp' :
            'data-popup-jpg'
        )
      );
    document.querySelector('.modal-document img')
      .setAttribute('alt',
        target.getAttribute('data-popup-alt')
      );
    openModal('.modal-document');
    e.stopPropagation();
  });
});

document.querySelectorAll('.js__close-modal-document').forEach(control => {
  control.addEventListener('click', e => {
    closeModal('.modal-document');
    e.stopPropagation();
  });
});

const bookingForm = new Vue({
  el: '#booking-form',
  data () {
    return {
      trips: [],
      helicopters: [],
      trip: null,
      helicopter: null,
    };
  },
  watch: {
    trip (v) {
      const currentTrip = this.trips.find(({ id }) => id === v)
      if (!currentTrip.helicopters.includes(this.helicopter)) {
        this.helicopter = currentTrip.helicopters[0]
      }
    }
  },
  computed: {
    tripInfo () {
      return this.trips.find( trip =>
        trip.id === this.trip
      );
    },
    helicopterInfo () {
      return this.helicopters.find( helicopter =>
        helicopter.id === this.helicopter
      );
    },
    filteredHelicopters () {
      return this.helicopters.filter( ({ id }) =>
        this.tripInfo.helicopters.indexOf(id) !== -1
      );
    },
    price () {
      if (!this.helicopter) return null
      if (!this.tripInfo.helicopters.includes(this.helicopter)) return null
      return this.tripInfo.prices[this.tripInfo.helicopters.indexOf(this.helicopter)]
    },
    isTablet: () => window.innerWidth < 1280
  },
  methods: {
    clickSelect (target, e) {
      target.classList.toggle('select-input_active');
      e.stopPropagation();
    },
    clickSelectItem (target, key, value, e) {
      this[key] = value;
      target.classList.remove('select-input_active');
      e.stopPropagation();
    },
    clickButton() {
      const data = JSON.stringify({ tripId: this.trip, helicopterId: this.helicopter })
      axios.post('./booking.html', data)
        .finally(e => console.log(e))
    }
  },
  async created () {
    const { data } = await axios.get('/index-trips.json');
    this.trips = [...data.trips];
    this.helicopters = [...data.helicopters];
    this.trip = this.trips[0].id;
    this.helicopter = this.trips[0].helicopters[0];
  },
  mounted () {
    window.addEventListener('click', () => {
      document.querySelectorAll('.select-input').forEach(el => {
        if (el.classList.contains('select-input_active')) el.classList.remove('select-input_active');
      });
    });
  },
});