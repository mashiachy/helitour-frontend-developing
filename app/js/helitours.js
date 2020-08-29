import Swiper, { Pagination } from 'swiper';
import supportsWebP from 'supports-webp';
import { instagramSlider, webp } from './base';

Swiper.use(Pagination);

webp();

instagramSlider();