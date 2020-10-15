<template>
  <div class="map-container">
    <div ref="googleMap" class="map"></div>
    <template v-if="google">
      <MapMarker
        v-for="marker in info.markers"
        :key="marker.id"
        :google="google"
        :map="map"
        :latLng="marker.latLng"
        :pulse="marker.id === activeMarkerId"
      />
      <MapDrawer
        :google="google"
        :map="map"
        :mapEl="$refs['googleMap']"
        $ref="drawer"
      />
      <MapPolygon
        :google="google"
        :map="map"
        :pathV="info.path"
        v-if="info.path"
      />
    </template>
    <v-alert
      v-if="isSomeModeActive"
      class="alert mb-4"
      border="left"
      colored-border
      color="primary"
      elevation="2"
    >
      {{ alertLabel }}
    </v-alert>
  </div>
</template>

<script>
import { Loader } from 'google-maps';
import { API_KEY, MAP_CONFIG, INIT_DOUGLAS_PEUCKER } from '@/constants';
import { eventBus } from "@/main";
import MapMarker from '@/components/map-foo/MapMarker';
import MapDrawer from '@/components/map-foo/MapDrawer';
import MapPolygon from '@/components/map-foo/MapPolygon';

export default {
  name: 'Map',

  components: { MapMarker, MapDrawer, MapPolygon },

  data () {
    return {
      google: null,
      map: null,
      drawingPolyline: false,
      drawingMarker: false,
      info: null,
      activeMarkerId: null,
      currentListener: null,
      editingMarkerId: null
    }
  },

  // TODO: Сделать прослушиватели для режимов редактирования
  watch: {

  },

  async mounted () {
    const loader = new Loader(API_KEY, {})
    this.google = await loader.load()
    this.initializeMap()
  },

  created () {
    eventBus.$on('toggleDrawMode', this.toggleDrawingMode)
    eventBus.$on('toggleMarkerSetMode', this.toggleMarkerMode)
    eventBus.$on('setNewMapInfo', this.setDefaultInfo)
    eventBus.$on('setMapInfo', this.setInfo)
    eventBus.$on('toggleActiveMarker', this.toggleActiveMarker)
    eventBus.$on('drawerOff', this.drawerOff)
  },

  beforeDestroy () {
    eventBus.$off('toggleDrawMode', this.toggleDrawingMode)
    eventBus.$off('toggleMarkerSetMode', this.toggleMarkerMode)
    eventBus.$off('setNewMapInfo', this.setDefaultInfo)
    eventBus.$off('setMapInfo', this.setInfo)
    eventBus.$off('toggleActiveMarker', this.toggleActiveMarker)
    eventBus.$on('drawerOff', this.drawerOff)
  },

  methods: {
    initializeMap () {
      this.map = new this.google.maps.Map(this.$refs['googleMap'], MAP_CONFIG)
      this.setDefaultInfo()
      INIT_DOUGLAS_PEUCKER(this.map, this.google)
    },
    drawerOff () {
      if (this.drawingPolyline) {
        this.drawingPolyline = false
      }
      eventBus.$off('drawn', this.handlePolyLineDrawn)
    },
    toggleDrawingMode () {
      if (this.drawingMarker) eventBus.$emit('toggleMarkerSetMode')
      this.drawingPolyline = !this.drawingPolyline
      if (this.drawingPolyline) {
        eventBus.$emit('drawerOn')
        eventBus.$on('drawn', this.handlePolyLineDrawn)
      } else {
        eventBus.$emit('drawerOff')
        eventBus.$off('drawn', this.handlePolyLineDrawn)
      }
    },
    handlePolyLineDrawn (path) {
      eventBus.$emit('settedPoly', path)
    },
    toggleActiveMarker (id) {
      if (this.activeMarkerId === id) {
        this.activeMarkerId = null
      } else {
        this.activeMarkerId = id
      }
    },
    toggleMarkerMode (id) {
      if (this.drawingPolyline) eventBus.$emit('toggleDrawMode')
      this.drawingMarker = !this.drawingMarker
      if (this.drawingMarker) {
        this.editingMarkerId = id
        this.currentListener = this.map.addListener('click', ({ latLng }) => {
          eventBus.$emit('settedMarker', { lat: latLng.lat(), lng: latLng.lng() })
          eventBus.$emit('toggleMarkerSetMode')
        })
      } else {
        this.editingMarkerId = null
        if (this.currentListener) this.google.maps.event.removeListener(this.currentListener)
        this.currentListener = null
      }
    },
    setDefaultInfo () {
      this.info = {
        path: null,
        markers: []
      }
      this.activeMarkerId = null
      if (this.currentListener) this.google.maps.event.removeListener(this.currentListener)
      this.currentListener = null
      if (this.drawingMarker) eventBus.$emit('toggleMarkerSetMode')
      if (this.drawingPolyline) eventBus.$emit('toggleDrawMode')
    },
    setInfo (payload) {
      Object.assign(this.info, payload)
      if (this.drawingMarker) eventBus.$emit('toggleMarkerSetMode')
      if (this.drawingPolyline) eventBus.$emit('toggleDrawMode')
    }
  },

  computed: {
    isSomeModeActive () {
      return this.drawingPolyline || this.drawingMarker
    },
    alertLabel () {
      if (this.drawingPolyline) return 'Режим рисования маршрута'
      if (this.drawingMarker) return 'Режим указания метки'
      return ''
    }
  }
}
</script>

<style lang="sass">
.map-container, .map
  width: 100%
  height: 100%
.map-container
  position: relative
.alert
  position: absolute !important
  bottom: 0
  left: 50%
  transform: translateX(-50%)
</style>