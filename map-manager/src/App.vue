<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-img
        alt="Helitour Logo"
        class="shrink mx-auto"
        contain
        src="./assets/logo.png"
        transition="scale-transition"
        width="80"
      />
    </v-app-bar>

    <v-main>
      <div class="main-wrapper d-flex align-content-stretch">
        <v-col cols="6">
          <Map />
        </v-col>
        <v-col class="map-controller-wrapper" cols="6">
          <MapController />
        </v-col>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import Map from './components/Map';
import MapController from "./components/MapController";

export default {
  name: 'App',

  components: {
    Map, MapController
  },

  data: () => ({
    //
  }),

  created () {
    this.$store.dispatch('loadTrips')
  }
};
</script>

<style lang="sass">
html
  overflow-y: unset
  max-height: 100vh

.main-wrapper
  height: calc(100vh - 65px)

.map-controller-wrapper
  max-height: 100%
  overflow-y: auto
</style>