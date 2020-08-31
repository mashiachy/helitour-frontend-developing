import Vue from 'vue';
import VueCurrencyFilter from 'vue-currency-filter';
import DatePicker from 'vue2-datepicker';
import axios from 'axios';
import { webp, headerPopup, vhFix } from './base';

webp();
headerPopup();
vhFix();

Vue.use(VueCurrencyFilter, {
  thousandsSeparator: ' ',
  fractionCount: 2,
  fractionSeparator: '.',
});

const app = new Vue({
  el: '#app',
  components: {
    DatePicker,
  },
  data () {
    return {
      trip: null,
      passengers: null,
      helicopter: null,
      trips: [],
      helicopters: [],
      price: 25000,
      present: false,
      date: '20:12:2020',
      time: '12:00',
      name: null,
      telephone: null,
      email: null,
      delivery: null,
      offerAccept: null,
      lang: {
        formatLocale: {
          months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
          weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
          weekdaysMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
          firstDayOfWeek: 1,
        },
        days: [],
        months: [],
      },
      deliveries: [
        {
          id: 1000,
          name: 'Способ 1',
        },
        {
          id: 1001,
          name: 'Способ 2 способ 2 способ 2',
        },
        {
          id: 1002,
          name: 'Способ 3 способ 3 способ 3 способ 3 способ 3 способ 3 способ 3 способ 3 способ 3',
        },
      ],
    };
  },
  watch: {
    trip () {
      this.passengers = 1;

    },
    passengers () {
      this.helicopter = null;
    },
  },
  computed: {
    tripInfo () {
      return this.trips.find(trip => trip.id === this.trip);
    },
    filteredHelicopters () {
      return this.helicopters.filter( ({ id, passengers }) =>
        this.tripInfo.helicopters.indexOf(id) !== -1 && this.passengers <= passengers
      );
    },
    passengersMax () {
      return this.trip ? [
        ...Array(1 + Math.max(
          ...this.filteredHelicopters.map( ({ passengers }) =>
            passengers
          )
        )).keys()
      ].slice(1) : [];
    },
    deliveryName () {
      return this.deliveries.find(d => d.id === this.delivery).name;
    },
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
  },
  async created () {
    const { data } = await axios.get('/helitours_info.json');
    this.trips = [...data.trips];
    this.helicopters = [...data.helicopters];
    this.trip = this.trips[0].id;
    this.passengers = 1;
  },
  mounted () {
    window.addEventListener('click', () => {
      document.querySelectorAll('.select-input').forEach(el => {
        if (el.classList.contains('select-input_active')) el.classList.remove('select-input_active');
      });
    });
  }
});