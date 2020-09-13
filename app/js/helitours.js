import Swiper, { Pagination } from 'swiper';
import { webp, headerPopup, vhFix, instagramSlider } from './base';

webp();
headerPopup();
vhFix();

Swiper.use(Pagination);

instagramSlider();