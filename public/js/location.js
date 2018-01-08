  var latlong = {};
  var queryString = {};
  var geocoder = new google.maps.Geocoder();
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $('.loadCases').removeClass('hide');
        $('.no-location').addClass('hide');
        latlong = {lat:lat,lng:lng};
        queryString.latlong = latlong;
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
    queryString.latlong = latlong;
  });

  if(!latlong.lat || !latlong.lng){
    $('.loadCases').addClass('hide');
    $('.no-location').removeClass('hide');
  }

  $('.loadCases').on('loadmycases',function (event) {
    queryString.limit = $(this).data('limit');
    $.get('/api/v1/loadcases',queryString,function(data){
      $('.loadCases').html(data);
    });
  })

  $('a.category').click(function(e){
    e.preventDefault();
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');
    queryString.category = $(this).data('category');
    $('.loadCases').trigger('loadmycases');
  })
  $('button.btn-srch').click(function (e) {
    e.preventDefault();
    $('.loadCases').trigger('loadmycases');
  })

  $('select#sortDate').change(function () {
    if(queryString.sortAmount) delete queryString.sortAmount;
    queryString.sortDate = $(this).find('option:selected').val();
    $('.loadCases').trigger('loadmycases');
  })
  $('select#sortAmount').change(function () {
    if(queryString.sortDate) delete queryString.sortDate;
    queryString.sortAmount = $(this).find('option:selected').val();
    $('.loadCases').trigger('loadmycases');
  })
