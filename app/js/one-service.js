import {webp, headerPopup, vhFix, instagramSlider} from './base';
import Swiper, {Pagination} from "swiper";

webp();
headerPopup();
vhFix();

Swiper.use(Pagination);

instagramSlider();