import Swiper, { Pagination } from 'swiper';
import supportsWebP from 'supports-webp';

import { webp, headerPopup, vhFix, instagramSlider } from './base';

webp();
headerPopup();
vhFix();

Swiper.use(Pagination);

instagramSlider();