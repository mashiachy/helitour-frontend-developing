<template>
  <div>
    <v-col cols="6">
      <v-btn
        class="mb-2"
        @click="clickCreateTrip"
      >
        Создать маршрут
      </v-btn>
      <v-select
        label="Редактировать маршрут"
        :items="trips"
        v-model="currentTripId"
        @input="inputEditTrip"
      ></v-select>
    </v-col>
    <v-divider v-if="currentTripId" class="mb-4"></v-divider>
    <TripInfo
      ref="tripInfo"
      v-if="currentTripId"
      v-bind="currentTrip"
      class="mb-4"
    ></TripInfo>
    <v-divider v-if="isChanges" class="mb-4"></v-divider>
    <v-col cols="6">
      <div class="d-flex">
        <v-btn
          v-if="isChanges"
          color="primary"
          @click="saveEdits"
          class="mr-2"
        >
          Сохранить изменения
        </v-btn>
        <v-btn
          v-if="isChanges"
          @click="cancelEdits"
        >
          Отменить изменения
        </v-btn>
      </div>
    </v-col>
  </div>
</template>

<script>
import { BASE_TRIP_OBJECT } from '@/constants';
import { mapGetters, mapActions } from 'vuex';
import { eventBus } from '../main';
import TripInfo from './TripInfo';

export default {
  name: 'MapController',

  components: { TripInfo },

  data () {
    return {
      currentTripId: null
    }
  },

  computed: {
    trips () {
      return this.tripsInfo.map(({ id, name }) => ({
        value: id,
        text: name
      }))
    },
    currentTrip () {
      let r = this.$store.getters.tripById(this.currentTripId)
      if (r) {
        const { path, ...data } = r
        return {
          ...data,
          wayPath: path
        }
      } else {
        return {
          id: this.currentTripId,
          ...BASE_TRIP_OBJECT
        }
      }
    },
    ...mapGetters(['tripsInfo', 'idForNewTrip', 'isChanges'])
  },

  methods: {
    clickCreateTrip () {
      eventBus.$emit('createTrip')
      this.currentTripId = this.idForNewTrip
      eventBus.$emit('setNewMapInfo')
      eventBus.$emit('setMapInfo', {
        id: this.currentTripId
      })
    },
    inputEditTrip (tripIid) {
      const { id } = this.$store.getters.tripById(tripIid)
      eventBus.$emit('editTrip', id)
      eventBus.$emit('setMapInfo', {
        id
      })
    },
    setNullCurrentTrip () {
      this.currentTripId = null
      eventBus.$emit('setNewMapInfo')
    },
    ...mapActions(['saveEdits', 'cancelEdits'])
  },

  created () {
    eventBus.$on('cancelEdits', this.setNullCurrentTrip)
  },

  beforeDestroy() {
    eventBus.$off('cancelEdits', this.setNullCurrentTrip)
  }
}
</script>