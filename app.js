/* globals L $ */
$(document).ready(function () {
  // DRAWING THE MAP

  var mymap = L.map('mapid').setView([0, 0], 2)

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(mymap)

  // AJAX REQUEST

  var allColors = []
  // var eventColor = {id: null, color: null}
  var markerColor

  $.ajax({
    type: 'GET',
    url: 'http://eonet.sci.gsfc.nasa.gov/api/v2.1/categories',
    dataType: 'json'
  }).done(function (data) {
    data.categories.forEach(function (datum) {
      // allColors.push({id: datum.id, title: datum.title, color: '#' + Math.floor(Math.random() * 16777215).toString(16)})
      switch (datum.id) {
        case 6:
          allColors.push({id: datum.id, title: datum.title, color: '#348899'})
          break
        case 7:
          allColors.push({id: datum.id, title: datum.title, color: '#962D3E'})
          break
        case 16:
          allColors.push({id: datum.id, title: datum.title, color: '#261722'})
          break
        case 9:
          allColors.push({id: datum.id, title: datum.title, color: '#76A68F'})
          break
        case 14:
          allColors.push({id: datum.id, title: datum.title, color: '#325943'})
          break
        case 19:
          allColors.push({id: datum.id, title: datum.title, color: '#D99C52'})
          break
        case 15:
          allColors.push({id: datum.id, title: datum.title, color: '#979C9C'})
          break
        case 10:
          allColors.push({id: datum.id, title: datum.title, color: '#E54661'})
          break
        case 17:
          allColors.push({id: datum.id, title: datum.title, color: '#553285'})
          break
        case 18:
          allColors.push({id: datum.id, title: datum.title, color: '#998A2F'})
          break
        case 12:
          allColors.push({id: datum.id, title: datum.title, color: '#35478C'})
          break
        case 13:
          allColors.push({id: datum.id, title: datum.title, color: '#002D40'})
          break
        case 8:
          allColors.push({id: datum.id, title: datum.title, color: '#FF7F66'})
          break
      }
      console.log(allColors)
    })
    allColors.forEach(function (col) {
      // var complement = invertColor(col.color)
      $('#list').append('<li>' + '<div style="background-color:' + col.color + '; width: 105px; height: 35px;">' + col.title + '</div>' + '</li>')
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
          markerColor = color.color
          console.log(markerColor)
        }
      })
      var geometry = datum.geometries
      if (geometry[0].type === 'Point') {
        var circle = L.geoJson(geometry, {
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 15,
              color: markerColor,
              weight: 1,
              opacity: 1,
              fillOpacity: 0.4,
              fillColor: markerColor
            })
          }
        }).addTo(mymap)
      } else {
        circle = L.geoJson(geometry, {
          style: {
            'color': markerColor,
            'weight': 2,
            'opacity': 1,
            fillOpacity: 0.4
          }
        }).addTo(mymap)
      }
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
