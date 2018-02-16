function startAutocomplete () {
  var input = document.getElementById('locality');
  // var options = {
  //   types: ['(regions)'],
  //   componentRestrictions: {country: "ES"}
  // };
  var options = {};

  var autocomplete = new google.maps.places.Autocomplete(input, options);

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    var place = autocomplete.getPlace();
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    // var placeId = place.place_id;

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      console.log(addressType);
      if (addressType === 'locality') {
        const val = place.address_components[i].long_name;
        document.getElementById('cityCreate').value = val;
      }
      if (addressType === 'postal_code') {
        const val = place.address_components[i].long_name;
        document.getElementById('zipCreate').value = val;
      }
      if (addressType === 'street_number') {
        const val = place.address_components[i].long_name;
        document.getElementById('streetnrCreate').value = val;
      }
      if (addressType === 'route') {
        const val = place.address_components[i].long_name;
        document.getElementById('streetCreate').value = val;
      }
      if (addressType === 'country') {
        const val = place.address_components[i].long_name;
        document.getElementById('countryCreate').value = val;
      }
    }
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
    // document.getElementById("location_id").value = placeId;
  });
}

startAutocomplete();
