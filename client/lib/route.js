let map, directionsService, directionsRenderer;
let sourceAutocomplete, desAutocomplete;

export function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 23.8041, lng: 90.4152 },
    zoom: 13,
  });

  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // sourceAutocomplete = new google.maps.places.Autocomplete(document.getElementById('source'));
  // desAutocomplete = new google.maps.places.Autocomplete(document.getElementById('dest'));
}

export function calcRoute(srclat, srclng, destlat, deslng) {
  // var source = document.getElementById('source').value;
  // var dest = document.getElementById('dest').value;

  let request = {
    // origin: { lat: 23.8103, lng: 90.4125 }, // Use dynamic coordinates based on user input if needed
    origin: { lat: srclat, lng: srclng }, // Use dynamic coordinates based on user input if needed
    // destination: { lat: 22.3569, lng: 91.7832 }, // Use dynamic coordinates based on user input if needed
    destination: { lat: destlat, lng: deslng }, // Use dynamic coordinates based on user input if needed
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: new Date(),
      trafficModel: 'pessimistic',
    },
  };

  directionsService.route(request, function (result, status) {
    if (status === "OK") {
      // const output = document.querySelector("#output");
      // output.innerHTML =
      //   "<div class='alert-info'>From: " +
      //   source + ".</br>To: " +
      //   dest + ".</br> Driving distance: " +
      //   result.routes[0].legs[0].distance.text +
      //   ".</br>Duration: " + result.routes[0].legs[0].duration.text + ".</div>";
      directionsRenderer.setDirections(result);
    } else {
      console.error('Directions request failed due to ' + status);
    }
  });
}
