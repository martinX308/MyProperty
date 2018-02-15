function startMap() {

// --- Map initialization
    var map = new google.maps.Map(
    document.getElementById('map'),
      {
        zoom: 13,
      }
    );

// --- Put a marker on the map for every property belonging to the user
  var locationStats = document.getElementsByClassName('location_stats');
  for (var i=0; i < locationStats.length; i++) {
    let latitude = parseFloat(locationStats[i].childNodes[1].innerText);
    let longitude = parseFloat(locationStats[i].childNodes[4].innerText);
    let marker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude
      },
      map: map,
      title: "Property"
    });
  }

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


}

startMap();
