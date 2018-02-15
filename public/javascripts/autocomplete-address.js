function startAutocomplete() {

        var input = document.getElementById('locality');
        // var options = {
        //   types: ['(regions)'],
        //   componentRestrictions: {country: "ES"}
        // };
        var options = {}
    
        var autocomplete = new google.maps.places.Autocomplete(input, options);
    
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          var lat = place.geometry.location.lat();
          var lng = place.geometry.location.lng();
          var placeId = place.place_id;
          // to set city name, using the locality param
          var componentForm = {
            locality: 'short_name',
          };
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
              var val = place.address_components[i][componentForm[addressType]];
              document.getElementById("city").value = val;
            }
          }
          document.getElementById("latitude").value = lat;
          document.getElementById("longitude").value = lng;
          document.getElementById("location_id").value = placeId;
        });
}

startAutocomplete();