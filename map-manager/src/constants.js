export const API_KEY = 'AIzaSyBUevELRNQrstYsf6nlw74wsrukteZiguc'

export const DEFAULT_DRAGGABLE_CURSOR = 'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default'

export const MAP_CONFIG = {
  center: { lat: 50.434341, lng: 30.527756 },
  zoom: 14,
  disableDefaultUI: true,
  clickableIcons: false,
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
export const MAP_ELEMENT_MIXIN = {
  render: (h) => h(),

  props: {
    map: {
      type: Object,
      required: true
    },
    google: {
      type: Object,
      required: true
    }
  }
}

export const MAP_MARKER_CONFIG = (google) => ({
  draggable: false,
  clickable: false,
  icon: {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#0facd0',
    fillOpacity: 1,
    anchor: new google.maps.Point(0,0),
    strokeWeight: 0,
    scale: 10
  }
})

export const MAP_POLYLINE_CONFIG = {
  strokeColor: '#0facd0',
  strokeOpacity: 1,
  strokeWeight: 3
}

export const MAP_POLYGON_CONFIG = {
  strokeColor: '#0facd0',
  strokeOpacity: 1,
  strokeWeight: 3,
  fillColor: '#0facd0',
  fillOpacity: 0,
  draggable: false,
  geodesic: false,
  clickable: false
}

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

export const EARTH_RADIUS = 6378137.0

export const INIT_DOUGLAS_PEUCKER = (map, google) => {
  google.maps.Polygon.prototype.douglasPeucker = function(tolerance) {
    let res = null;
    tolerance = tolerance * Math.pow(2, 20 - map.getZoom());
    if(this.getPath() && this.getPath().getLength()) {
      const points = this.getPath().getArray();

      const Line = function( p1, p2 ) {
        this.p1 = p1;
        this.p2 = p2;

        this.distanceToPoint = function( point ) {
          let m = ( this.p2.lat() - this.p1.lat() ) / ( this.p2.lng() - this.p1.lng() ),
            b = this.p1.lat() - ( m * this.p1.lng() ),
            d = [];
          d.push( Math.abs( point.lat() - ( m * point.lng() ) - b ) / Math.sqrt( Math.pow( m, 2 ) + 1 ) );
          d.push( Math.sqrt( Math.pow( ( point.lng() - this.p1.lng() ), 2 ) + Math.pow( ( point.lat() - this.p1.lat() ), 2 ) ) );
          d.push( Math.sqrt( Math.pow( ( point.lng() - this.p2.lng() ), 2 ) + Math.pow( ( point.lat() - this.p2.lat() ), 2 ) ) );
          return d.sort((a, b) => a - b)[0];
        };
      };

      const douglasPeucker = function( points, tolerance ) {
        if ( points.length <= 2 ) {
          return [points[0]];
        }
        let returnPoints = [],
          line = new Line( points[0], points[points.length - 1] ),
          maxDistance = 0,
          maxDistanceIndex = 0,
          p;
        for(let i = 1; i <= points.length - 2; i++) {
          const distance = line.distanceToPoint(points[i]);
          if( distance > maxDistance ) {
            maxDistance = distance;
            maxDistanceIndex = i;
          }
        }
        if (maxDistance >= tolerance) {
          p = points[maxDistanceIndex];
          line.distanceToPoint( p, true );
          returnPoints = returnPoints.concat(douglasPeucker(points.slice( 0, maxDistanceIndex + 1), tolerance));
          returnPoints = returnPoints.concat(douglasPeucker(points.slice( maxDistanceIndex, points.length ), tolerance));
        } else {
          p = points[maxDistanceIndex];
          line.distanceToPoint( p, true );
          returnPoints = [points[0]];
        }
        return returnPoints;
      };
      res = douglasPeucker(points, tolerance);
      res.push(points[points.length - 1 ]);
      this.setPath(res);
    }
    return this;
  }
}