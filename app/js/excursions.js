import { webp, headerPopup, vhFix } from './base';

webp();
headerPopup();
vhFix();

import Vue from 'vue';
import axios from 'axios';

const app = new Vue({
  el: '#app',
  data () {
    return {
      newCards: [],
      endedCards: false,
    };
  },
  methods: {
    async clickMore () {
      const { data } = await axios.get('/excursions.json');
      if ('excursions' in data) data.excursions.forEach(exc => this.newCards.push(exc));
      if ('ended' in data) this.endedCards = data.ended;
    },
  },
});