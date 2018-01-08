  var latlong = {};
  var geocoder = new google.maps.Geocoder();
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $('.loadCases').removeClass('hide');
        $('.no-location').addClass('hide');
        latlong = {lat:lat,lng:lng};
        $('.loadCases').trigger('loadmycases');
        codeLatLng(lat, lng);
      }, function () {
        $('.loadCases').addClass('hide');
        $('.no-location').removeClass('hide');
      }
    );
  }

  function codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
           $('#search').attr('value',results[0].formatted_address);
        } else {
          alert("Geocoder failed due to: " + status);
        }
      }
    });
  }

  var Addressautocomplete = new google.maps.places.Autocomplete((document.getElementById('search')),{types: ['geocode']});
  Addressautocomplete.addListener('place_changed', function () {
    var place = Addressautocomplete.getPlace();
    var latlng = place.geometry.location;
    latlong = {lat:latlng.lat(),lng:latlng.lng()};
  });

  if(!latlong.lat || !latlong.lng){
    $('.loadCases').addClass('hide');
    $('.no-location').removeClass('hide');
  }

  $('.loadCases').on('loadmycases',function (event) {
    var limit = $(this).data('limit');
    $.get('/api/v1/loadcases',{limit:limit,latlong:latlong},function(data){
      $('.loadCases').html(data);
    });
  })

  $('button.btn-srch').click(function (e) {
    e.preventDefault();
    $('.loadCases').trigger('loadmycases');
  })
