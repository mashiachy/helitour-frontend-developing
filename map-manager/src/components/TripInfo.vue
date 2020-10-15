<template>
  <div>
    <v-col cols="6">
      <h3 class="mb-2">Экскурсия ID: {{ tripId }}</h3>
      <v-text-field
        label="Название маршрута"
        v-model="tripName"
      ></v-text-field>
      <v-btn
        class="mb-4"
        @click="clickDrawButton"
      >
        {{ isPolyEditMode ? 'Выход из режима рисования' : 'Рисование маршрутa' }}
      </v-btn>
      <v-data-table
        :headers="markerHeaders"
        :items="tripMarkers"
        class="elevation-1 mb-4"
        @click:row.self="toggleActiveMarker"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Маркеры</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mb-2" v-bind="attrs" v-on="on">
                  Новый маркер
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.id"
                          label="ID"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Название"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Отменить
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Точно хотите удалить этот маркер?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Отменить</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.name="{ item, value }">
          <span :class="{ bold: item.id === activeMarker }">{{ value }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="drawMarkerItem(item)">
            mdi-lead-pencil
          </v-icon>
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <div class="d-flex">
        <v-btn
          color="primary"
          class="mr-2"
          :disabled="!isEdits"
          @click="saveTrip"
        >Сохранить</v-btn>
        <v-btn
          :disabled="!isEdits"
          @click="setDefaults"
        >Восстановить данные</v-btn>
      </div>
    </v-col>
  </div>
</template>

<script>
import { MARKERS_TABLE_HEADER } from '@/constants';
import { eventBus } from '@/main';

export default {
  name: 'TripInfo',

  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      default: 'Новый маршрут'
    },
    wayPath: {
      type: Array,
      default: () => []
    },
    markers: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      tripId: this.id,
      tripName: this.name,
      tripPath: [...this.wayPath],
      tripMarkers: [...this.markers],
      markerHeaders: MARKERS_TABLE_HEADER,
      activeMarker: null,
      editedIndex: -1,
      dialog: false,
      dialogDelete: false,
      editedItem: {
        id: 0,
        name: 'Новый маркер',
        latLng: { lat: 0, lng: 0 }
      },
      defaultItem: {
        id: 0,
        name: 'Новый маркер',
        latLng: { lat: 0, lng: 0 }
      },
      isMarkerEditMode: false,
      editingMarker: null,
      isPolyEditMode: false
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Новый маркер' : 'Редактирование маркера'
    },
    isEdits () {
      if (this.name !== this.tripName ) return true
      if (this.markers.length !== this.tripMarkers.length) return true
      if (this.wayPath.length !== this.tripPath.length) return true
      if (JSON.stringify(this.markers) !== JSON.stringify(this.tripMarkers)) return true
      if (JSON.stringify(this.wayPath) !== JSON.stringify(this.tripPath)) return true
      return false
    }
  },

  created () {
    eventBus.$on('toggleMarkerSetMode', this.toggleMarkerEditMode)
    eventBus.$on('drawn', this.setPoly)
    eventBus.$on('drawerOn', this.enableDrawPolyMode)
    eventBus.$on('drawerOff', this.disableDrawPolyMode)
  },

  beforeDestroy () {
    eventBus.$off('toggleMarkerSetMode', this.toggleMarkerEditMode)
    eventBus.$off('drawn', this.setPoly)
    eventBus.$off('drawerOn', this.enableDrawPolyMode)
    eventBus.$off('drawerOff', this.disableDrawPolyMode)
  },

  mounted () {
    this.setDefaults()
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    id () {
      this.setDefaults()
    },
    activeMarker (v) {
      eventBus.$emit('toggleActiveMarker', v)
    },
    tripMarkers (v) {
      this.activeMarker = null
      eventBus.$emit('setMapInfo', {
        markers: v.map(({ id, latLng }) => ({ id, latLng }))
      })
    },
    tripPath (v) {
      this.activeMarker = null
      eventBus.$emit('setMapInfo', {
        path: v
      })
    }
  },

  methods: {
    enableDrawPolyMode () {
      this.isPolyEditMode = true
    },
    disableDrawPolyMode () {
      this.isPolyEditMode = false
    },
    toggleMarkerEditMode () {
      if (this.isMarkerEditMode) {
        eventBus.$off('settedMarker', this.setMarker)
      } else {
        eventBus.$on('settedMarker', this.setMarker)
      }
    },
    setMarker (latLng) {
      const m = Object.assign({ ...this.tripMarkers.find(({ id }) => id === this.editingMarker) }, { latLng })
      this.$set(this.tripMarkers, this.tripMarkers.findIndex(({ id }) => id === this.editingMarker), m)
    },
    setPoly (path) {
      this.tripPath = [ ...path ]
    },
    toggleActiveMarker ({ id }) {
      if (this.activeMarker === id) {
        this.activeMarker = null
      } else {
        this.activeMarker = id
      }
    },
    setDefaults () {
      this.tripId = this.id
      this.tripName = this.name
      this.tripPath = [...this.wayPath]
      this.tripMarkers = [...this.markers]
      this.activeMarker = null
    },
    clickDrawButton () {
      eventBus.$emit('toggleDrawMode')
    },
    editItem (item) {
      this.editedIndex = this.tripMarkers.indexOf(item)
      this.editedItem = { ...item }
      this.dialog = true
    },
    drawMarkerItem ({ id }) {
      eventBus.$emit('toggleMarkerSetMode', id)
      this.editingMarker = id
    },
    deleteItem (item) {
      this.editedIndex = this.tripMarkers.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.tripMarkers.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.tripMarkers[this.editedIndex], this.editedItem)
      } else {
        this.tripMarkers.push(this.editedItem)
      }
      this.close()
    },
    saveTrip () {
      if (!this.isEdits) return
      this.$store.dispatch('updateTrip', {
        id: this.tripId,
        name: this.tripName,
        path: [ ...this.tripPath ],
        markers: [ ...this.tripMarkers ]
      })
    }
  }
}
</script>

<style lang="sass">
.bold
  font-weight: bold
</style>