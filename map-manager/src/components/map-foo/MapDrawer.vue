<script>
import { MAP_ELEMENT_MIXIN, DEFAULT_DRAGGABLE_CURSOR, MAP_POLYLINE_CONFIG } from '@/constants';
import { eventBus } from '@/main';

export default {
  name: 'MapDrawer',

  mixins: [ MAP_ELEMENT_MIXIN ],

  props: [ 'mapEl' ],

  data () {
    return {
      mode: null,
      overlay: null,
      polyLine: null,
      parcelleHeig: null,
      mousePressed: null,
      listenerMouseDown: null,
      listenerMouseUp: null,
      listenerMouseMove: null
    }
  },

  created () {
    eventBus.$on('drawerOn', this.modeOn)
    eventBus.$on('drawerOff', this.modeOff)
  },

  beforeDestroy () {
    eventBus.$off('drawerOn', this.modeOn)
    eventBus.$off('drawerOff', this.modeOff)
  },

  methods: {
    processDraw ({ latLng }) {
      if (!this.mousePressed) return
      this.polyLine.getPath().push(latLng)
      this.parcelleHeig.push(new this.google.maps.LatLng(latLng.lat(), latLng.lng()))
    },
    startDraw () {
      this.mousePressed = true;
      this.polyLine.setPath(this.parcelleHeig)
      this.polyLine.setMap(this.map)
    },
    stopDraw () {
      this.mousePressed = false
      eventBus.$emit('drawn', this.parcelleHeig)

      eventBus.$emit('drawerOff')
    },
    modeOn () {
      this.mode = true
      this.parcelleHeig = []
      this.mousePressed = false
      this.overlay = new this.google.maps.OverlayView()
      this.overlay.draw = function () {}
      this.overlay.onAdd = function () {}
      this.overlay.onRemove = function () {}
      this.overlay.setMap(this.map)
      this.polyLine = new this.google.maps.Polyline(MAP_POLYLINE_CONFIG)
      this.map.setOptions({
        draggable: false,
        draggableCursor: 'url("pencil-cursor.png"), auto'
      })
      this.listenersOn()
    },
    modeOff () {
      this.overlay.setMap(null)
      this.overlay = null
      this.map.setOptions({
        draggable: true,
        draggableCursor: DEFAULT_DRAGGABLE_CURSOR
      })
      this.polyLine.setMap(null)
      this.polyLine = null
      this.listenersOff()
      this.mode = false
    },
    listenersOn () {
      this.listenerMouseDown = this.mapEl.addEventListener('mousedown', this.startDraw)
      this.listenerMouseUp = this.mapEl.addEventListener('mouseup', this.stopDraw)
      this.listenerMouseMove = this.google.maps.event.addListener(this.map, 'mousemove', this.processDraw)
    },
    listenersOff () {
      if (this.mode) {
        this.listenerMouseDown = this.mapEl.removeEventListener('mousedown', this.startDraw)
        this.listenerMouseUp = this.mapEl.removeEventListener('mouseup', this.stopDraw)
        this.google.maps.event.removeListener(this.listenerMouseMove)
        this.listenerMouseMove = null
      }
    }
  }
}
</script>