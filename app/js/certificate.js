import Swiper, { Pagination } from 'swiper';
import { webp, headerPopup, vhFix, excursionsSlider, questionsManager } from './base';

webp();
headerPopup();
vhFix();
questionsManager();

Swiper.use(Pagination);

excursionsSlider();