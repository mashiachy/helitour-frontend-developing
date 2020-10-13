<template>
  <div class="map-container">
    <div ref="googleMap" class="map"></div>
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
import { API_KEY, MAP_CONFIG } from '@/constants';
import { eventBus } from "@/main";

export default {
  name: 'Map',

  data () {
    return {
      google: null,
      map: null,
      drawingPolyline: false,
      drawingMarker: false
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
  },

  beforeDestroy () {
    eventBus.$off('toggleDrawMode', this.toggleDrawingMode)
    eventBus.$off('toggleMarkerSetMode', this.toggleMarkerMode)
  },

  methods: {
    initializeMap () {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(mapContainer, MAP_CONFIG)
    },
    toggleDrawingMode () {
      this.drawingPolyline = !this.drawingPolyline
      this.drawingMarker = false
    },
    toggleMarkerMode () {
      this.drawingMarker = !this.drawingMarker
      this.drawingPolyline = false
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