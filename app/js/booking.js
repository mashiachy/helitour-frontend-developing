import Vue from 'vue';
import VueCurrencyFilter from 'vue-currency-filter';
import DatePicker from 'vue2-datepicker';
import axios from 'axios';
import { webp, headerPopup, vhFix, selectItemInit } from './base';

webp();
headerPopup();
vhFix();
selectItemInit();

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
    const date = new Date();
    return {
      trip: null,
      passengers: null,
      helicopter: null,
      trips: [],
      helicopters: [],
      // price: 25000,
      present: false,
      date: `${('0'+date.getDate()).slice(-2)}.${('0'+(date.getMonth()+1)).slice(-2)}.${date.getFullYear()}`,
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
    price () {
      const t = this.tripInfo
      return t.prices[t.helicopters.indexOf(this.helicopter)]
    }
  },
  async created () {
    const { data } = await axios.get('/helitours_info.json');
    this.trips = [...data.trips];
    this.helicopters = [...data.helicopters];
    this.trip = this.trips[0].id;
    this.passengers = 1;
  },
});