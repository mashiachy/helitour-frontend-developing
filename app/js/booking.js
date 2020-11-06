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
      disabledDates: [],
      name: null,
      telephone: null,
      email: null,
      delivery: null,
      message: null,
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
      deliveries: null,
    };
  },
  watch: {
    trip (v) {
      const maxP = Math.max.apply(null, this.helicopters.filter(({ id }) =>
        this.trips.find(trip => trip.id === v).helicopters.includes(id)
      ).map(({ passengers }) => passengers));
      if (this.passengers > maxP)
        this.passengers = 1
      const helics = this.helicopters.filter( ({ id, passengers }) =>
        this.trips.find(trip => trip.id === v).helicopters.includes(id) && this.passengers <= passengers
      ).map(({ id }) => id)
      if (!helics.includes(this.helicopter))
        this.helicopter = helics[0]
    },
    passengers (v) {
      const helics = this.helicopters.filter( ({ id, passengers }) =>
        this.tripInfo.helicopters.includes(id) && v <= passengers
      ).map(({ id }) => id);
      if (!helics.includes(this.helicopter))
        this.helicopter = helics[0]
    },
    helicopter (v) {
      // axios.get('./disabled_times.json')
      axios.get(`/api/booking/free-date.json?ID=${v}`)  
        .then(({ data: { disabledDates } }) => {
          this.disabledDates = [...disabledDates]
        })
    }
  },
  computed: {
    tripInfo () {
      return this.trips.find(trip => trip.id === this.trip);
    },
    filteredHelicopters () {
      return this.helicopters.filter( ({ id, passengers }) =>
        this.tripInfo.helicopters.includes(id) && this.passengers <= passengers
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
  methods: {
    sendForm (v) {
      const data = JSON.stringify({
        tripId: this.trip,
        passengers: this.passengers,
        helicopterId: this.helicopterId,
        date: this.date,
        time: this.time,
        present: this.present,
        name: this.name,
        telephone: this.telephone,
        email: this.email,
        message: this.message,
        deliveryId: this.delivery,
        isOnlinePaymernt: v
      })
      axios.post('/api/booking.json', data)
        .then(({ data }) => {
          if (data.success) {
            window.location = data.location
          } else {
            alert(data.message)
          }
        })
        .catch(() => alert('Что-то пошло не так'))
    },
    disableDate (date) {
      const today = new Date();
      today.setHours(0,0,0,0);
      if (date < today) return true
      const disabledDates = this.disabledDates.filter(({ time }) => !time.length).map(({ date }) => date)
      if (disabledDates.findIndex(dateT => {
        const p = dateT.split('.');
        return p[0] == date.getDate() && p[1] == (date.getMonth() + 1) && p[2] == date.getFullYear();
      }) !== -1) return true
      return false
    },
    disableTime (date) {
      const curDateTimes = this.disabledDates.filter(({ date: dateT, time }) => {
        if (!time.length) return false
        const p = dateT.split('.');
        const t = this.date.split('.')
        return p[0] == t[0] && p[1] == t[1] && p[2] == t[2];
      }).map(({ time }) => time).flat()
      const minutes = `${100 + date.getMinutes()}`.slice(1)
      const time = `${date.getHours()}:${minutes}`
      return curDateTimes.includes(time)
    }
  },
  async created () {
    const { data } = await axios.get('/helitours_info.json');
    this.trips = [...data.trips];
    this.helicopters = [...data.helicopters];
    // this.disabledDates = [...data.disabledDates];
    this.deliveries = [...data.deliveryMethods];
    const tripMeta = document.querySelector('meta[name="tripId"]');
    const helicopterId = document.querySelector('meta[name="helicopterId"]');
    this.passengers = 1;
    if (tripMeta)
      this.trip = Number.parseInt(tripMeta.getAttribute('content'));
    else
      this.trip = this.trips[0].id;
    if (helicopterId)
      this.helicopter = Number.parseInt(helicopterId.getAttribute('content'));
    else
      this.helicopter = this.trips.find(({ id }) => id === this.trip).helicopters[0];
  },
});