function startMap() {

// --- set up center for map
var ironhackBCN = {
    lat: 41.3977381,
    lng: 2.190471916};

// --- Map initialization
    var map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 15,
      // center: ironhackBCN
    }
  );

 // Add a marker for Ironhack Barcelona
  var IronHackBCNMarker = new google.maps.Marker({
    position: {
      lat: ironhackBCN.lat,
      lng: ironhackBCN.lng
    },
    map: map,
    title: "Barcelona Campus"
  });

// --- add a new random marker
  var myMarker = new google.maps.Marker({
      position: {
      lat: 30.3977381,
      lng: 4.190471916
      },
    map: map,
    title: "I'm here"
  });

// --- user geocalization
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center map with user location
      map.setCenter(user_location);

      // Add a marker for your user location
      var ironHackBCNMarker = new google.maps.Marker({
        position: {
          lat: user_location.lat,
          lng: user_location.lng
        },
        map: map,
        title: "You are here"
      });
    }, function () {
      console.log('Error in the geolocation service.');
    });
  } else {
    console.log('Browser does not support geolocation.');
  }

  // Geocodificación API service
  
  // var googleAddres = document.getElementById
  // google-addres


}



startMap();
