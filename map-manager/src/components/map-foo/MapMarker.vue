<script>
import { MAP_MARKER_CONFIG, MAP_ELEMENT_MIXIN } from '@/constants';

export default {
  name: 'MapMarker',

  mixins: [ MAP_ELEMENT_MIXIN ],

  props: {
    latLng: {
      type: Object,
      default: () => null
    },
    pulse: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    pulse (v) {
      v ? this.startAnimate() : this.stopAnimate()
    },
    latLng (v) {
      this.marker.setPosition(v)
    }
  },

  data () {
    return {
      marker: null,
      animateInterval: null,
      i: 1
    }
  },

  created () {
    this.marker = new this.google.maps.Marker({
      ...MAP_MARKER_CONFIG(this.google),
      map: this.map,
      position: this.latLng ? this.latLng : this.map.getCenter()
    })
  },

  beforeDestroy () {
    this.marker.setMap(null)
  },

  methods: {
    startAnimate () {
      this.setDefaultScale()
      this.animateInterval = setInterval(this.animateHandler, 10)
    },
    stopAnimate () {
      clearInterval(this.animateInterval)
      this.animateInterval = null
      this.setDefaultScale()
    },
    animateHandler () {
      const s = this.marker.getIcon();
      s.scale = s.scale + this.i * 0.1
      this.marker.setIcon(s)
      const f = Math.floor(s.scale)
      if (f === 15) this.i = -1
      if (f === 10) this.i = 1
    },
    setDefaultScale () {
      this.i = 1
      const s = this.marker.getIcon()
      s.scale = 10
      this.marker.setIcon(s)
    }
  }
}
</script>