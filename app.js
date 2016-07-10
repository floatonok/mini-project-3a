/* globals L $ */
$(document).ready(function () {
  // DRAWING THE MAP
  var mymap = L.map('mapid').setView([0, 0], 2)

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(mymap)

  // L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmxvYXRvbm9rIiwiYSI6ImNpcWM2eGk2ZjAxbXdmb25wZHliOTVyczkifQ.0EhN9Rbwy2iPWLH1GeHdkw', {
  //   attribution: 'Map data &copy; <a href='http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  //   maxZoom: 18,
  //   accessToken: 'pk.eyJ1IjoiZmxvYXRvbm9rIiwiYSI6ImNpcWM2eml6bDAxb3Vmcm0xdnQ0ZzBoazMifQ.e712oBJUID9CAIrO1PmPbw'
  // }).addTo(mymap)

  // ------------- GEOMETRY TYPE: POLYGON -------------
  // var states = [{
  //   'type': 'Feature',
  //   'properties': {'party': 'Republican'},
  //   'geometry': {
  //     'type': 'Polygon',
  //     'coordinates': [[
  //             [99.60, 51.05],
  //             [99.609375, 61.495014243336605],
  //             [113.984375, 61.495014243336605],
  //             [113.984375, 51.05119274780004],
  //             [99.609375, 51.05119274780004]
  //     ]]
  //   }
  // }]
  //
  // L.geoJson(states, {
  //   style: function (feature) {
  //     switch (feature.properties.party) {
  //       case 'Republican': return {color: '#ff0000'}
  //       case 'Democrat': return {color: '#0000ff'}
  //     }
  //   }
  // }).addTo(mymap)

  // ------------- GEOMETRY TYPE: POINT -------------
  var geojsonMarkerOptions = {
    radius: 8,
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    fillColor: markerColor
  }

  // var states2 = [{
  //   'type': 'Feature',
  //   'geometry': {
  //     'type': 'Point',
  //     'coordinates':
  //             [-120.85361111111, 38.969166666667]
  //   }
  // }]

  // L.geoJson(states2, {
  //   pointToLayer: function (feature, latlng) {
  //     return L.circleMarker(latlng, geojsonMarkerOptions)
  //   }
  // }).addTo(mymap)

  // ------------- AJAX REQUEST -------------
  var allColors = []
  var eventColor = {id: null, color: null}
  var markerColor

  $.ajax({
    type: 'GET',
    url: 'http://eonet.sci.gsfc.nasa.gov/api/v2.1/categories',
    dataType: 'json'
  }).done(function (data) {
    data.categories.forEach(function (datum) {
      eventColor.id = datum.id
      eventColor.color = Math.floor(Math.random() * 16777215).toString(16)
      allColors.push(eventColor)
    })
  })

  $.ajax({
    type: 'GET',
    url: 'http://eonet.sci.gsfc.nasa.gov/api/v2.1/events',
    dataType: 'json'
  }).done(function (data) {
    data.events.forEach(function (datum) {
      allColors.forEach(function (color) {
        if (datum.categories[0].id === color.id) {
          console.log(color.color)
          markerColor = color.color
        }
      })
      var geometry = datum.geometries
      var circle = L.geoJson(geometry, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions)
        }
      }).addTo(mymap)
      var date = new Date(geometry[0].date).toDateString()
      circle.bindPopup(datum.title + '<br>' + date)
      circle.addEventListener('click', function (e) {
        e = e || window.event
        $('#title').empty()
        $('#date').empty()
        $('#description').empty()
        $('#source').empty()

        $('#title').append(datum.title)
        $('#date').append('CATEGORY: ' + datum.categories[0].title + ' | ' + date)
        $('#description').append(datum.description)
        $('#source').append('<a href="' + datum.sources[0].url + '">[Source]</a>')
      })
    })
  })
})
