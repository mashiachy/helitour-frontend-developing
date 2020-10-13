export const API_KEY = 'AIzaSyBUevELRNQrstYsf6nlw74wsrukteZiguc'

export const MAP_CONFIG = {
  center: { lat: 50.434341, lng: 30.527756 },
  zoom: 14,
  disableDefaultUI: true,
  styles: [
    {
      featureType: 'poi',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'poi.park',
      stylers: [
        { visibility: 'on' }
      ]
    },
    {
      featureType: 'transit',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ]
}

// TODO: Сделать опции для линий и маркеров на карте

export const BASE_TRIP_OBJECT = {
  name: 'Новый маршрут',
  path: [],
  markers: []
}

export const MARKERS_TABLE_HEADER = [
  {
    text: 'ID',
    sortable: false,
    value: 'id'
  },
  {
    text: 'Label',
    value: 'name'
  },
  {
    text: 'Действия',
    value: 'actions',
    sortable: false
  }
]