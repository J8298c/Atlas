var map;
var vm;
var markers =[];
var marker;
var streetViewAddress;

var Model = {
    //Places of intrests hardcoded into app.js to work on failure from
    //foursquare api request so users still has some markers show up on map
    locations: [{
        title: 'Forest Park Carasouel',
        location: { lat: 40.7027, lng: -73.8493 },
        content: "Forest Park is a park in the New York City borough of Queens. It has an area of 538 acres, containing 165 acres of trees. The park is operated and maintained by the New York City Department of Parks and Recreation."
    }, {
        title: 'Target',
        location: { lat: 40.7210, lng: -73.8478 },
        content: "Retail chain offering home goods, clothing, electronics & more, plus exclusive designer collections."
    }, {
        title: 'Marthas Bakery',
        location: { lat: 40.7203, lng: -73.8460 },
        content: "Carrot cake, chocolate mousse, gelato, marble yogurt pound cake, very berry napoleon, Oreo cupcake, frozen mixed drinks, hot chocolate, coffee…this is only the beginning of what meets the eyes upon entering the newly expanded Martha’s Country Bakery in Forest Hills."
    }, {
        title: 'The Grill',
        location: { lat: 40.7208, lng: -73.8453 },
        content: 'Contemporary, brick-walled restaurant & bar with Mediterranean fare & weekday happy-hour specials.'
    }, {
        title: 'Pahal Zhan',
        location: { lat: 40.7194, lng: -73.8452 },
        content: "Pahal Zan is a cornerstone in the Forest Hills community and has been recognized for its outstanding Mediterranean cuisine, excellent service and friendly staff."
    }]
};

function AppViewModel(marker){
    var self = this;
    self.createListings = ko.observableArray();

    self.animateMarker = function(currentItem){
        var marker = currentItem;
        google.maps.event.trigger(marker, 'click');
    };

    self.categories = ko.observableArray();

    self.selectMarker = function(currentItem){
        var marker = currentItem;
        google.maps.event.trigger(marker, 'select', selectHandler);
        function selectHandler(e){
          console.log('you selected', e);
        }
        console.log('selected');
    }
    self.hideAllMarkers = function(){
        for(var i = 0; i < markers.length; i++){
          markers[i].setVisible(false);
        }
    }
    self.showAllMarkers = function(){
        for(var i = 0; i < markers.length; i++) {
          markers[i].setVisible(true);
        }
    }
}

function initMap(){
	var forestHills = {lat: 40.7181, lng: -73.8448};
    vm = new AppViewModel;
	map = new google.maps.Map(document.getElementById('map'), {
		center: forestHills,
		zoom: 15,
		mapTypeControl: false,
		styles: [{ "featureType": "administrative", "elementType": "all", "stylers": [{ "visibility": "on" }, { "lightness": 33 }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2e5d4" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#c5dac6" }] }, { "featureType": "poi.park", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": 20 }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#c5c6c6" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#e4d7c6" }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#fbfaf7" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#acbcc9" }] }]
	});
	// create marker function to pass response from different apis
  /*
@params markerPosition: position where the marker will be located
@params markerTitle: the title for the marker
@params streetViewAddress: address location passed into function to return a street view address
@params markerContent: content strings passed into function to create content for info windows
   */
	function createMarkers(markerPosition, markerTitle, markerContent){
		//creates new marker instance
		marker = new google.maps.Marker({
			position: markerPosition,
			title: markerTitle,
			content: markerContent,
			map: map,
			icon: 'http://maps.google.com/mapfiles/marker_yellow.png',
			animation: google.maps.Animation.DROP
		});
		markers.push(marker);
    vm.createListings.push(marker);
    vm.categories.push(marker);
	}
    /*
    @bounds sets map boundries
    @infowindow set variable to refer to google maps Infowindows
     */
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow({});

	/*
	 function to retrive data from foursquare api and create markers
	 .fail function takes hardcoded data in Model to pass and create markers if foursquare api
	 fails
	  */
	function getFourSquare() {
		var client_id = "ZBCPIT5VPYBTT2KNLCWMIJU4BAL4ANCO4MPJHLSJBOYB3D32";
		var client_secret = "2K5DPY4FG2DN2ZX4JSTWXHUN140LMR1JHGE04YCXOU0P303P";
		var foursquareUrl = "https://api.foursquare.com/v2/venues/search" +
            "?client_id=" + client_id +
            "&client_secret=" + client_secret +
            "&v=20160815" +
            "&ll=" + 40.7181 + "," + -73.8448;
        	$.ajax({
        		url: foursquareUrl,
        		dataType: "json"
        	}).done(function(data) {
        		var foursquareResponse = data.response.venues;
            console.log(foursquareResponse);
        		if(markers.length === 0){
                    for(var i = 0; i < foursquareResponse.length; i++){
                      var contentString = '<div><h5>'+ foursquareResponse[i].name + '</h5><br><div>' + foursquareResponse[i].location.formattedAddress + '</div><br><div>'+ foursquareResponse[i].contact.formattedPhone + '</div><br><div> FourSquare Check Ins: ' + foursquareResponse[i].stats.checkinsCount + ' Users Visitied: ' + foursquareResponse[i].stats.usersCount + '</div></div>';
        			        createMarkers(foursquareResponse[i].location, foursquareResponse[i].name, contentString);
                      animateMarker(marker);
        			}
        		}
        	}).fail(function(){
        		for(var i = 0; i < Model.locations.length; i++){
        		    createMarkers(Model.locations[i].location, Model.locations[i].title, Model.locations[i].content)
                }
			})
	}
	getFourSquare();

	function animateMarker() {
        marker.addListener('click', function(){
            if(this.getAnimation() !== null) {
                this.setAnimation(null);
                this.setIcon('http://maps.google.com/mapfiles/marker_yellow.png');
                infowindow.close(map, this);
            } else {
                $(this).addClass('clickable');
                this.setAnimation(google.maps.Animation.BOUNCE);
                this.setIcon('http://maps.google.com/mapfiles/marker_purple.png');
                infowindow.setContent(this.content);
                infowindow.open(map, this);
                bounds.extend(this.position);
            }
        });
    }
    $('.submitBtn').on('click', function(){
        for(var i = 0; i < markers.length; i++){
          markers[i].setMap(null);
        }
            console.log('Clearing those pesky markers out');
        });

        var stringSearch;
    //sets up search for results wihin forest hills
    $('form').submit(function(e) {
        e.preventDefault();
        //grabs string search to be used as value
        //for google places search query
        var stringSearch = $('input').val();
        vm.createListings.removeAll();
        markers = [];
        getPlaces(stringSearch);
        $('input').val('');
    });

    function getPlaces(stringSearch){
      var request = {
            location: { lat: 40.7194, lng: -73.8452 },
            radius: '100',
            query: stringSearch
        }
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);

        function callback(results, status) {
          console.log(results)
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                // markers.push(results);
                console.log(results);
                const phoneNumber = "not-listed"
                for (var i = 0; i < results.length; i++) {
                    // vm.categories.removeAll();
                    var contentStr = '<div><h5>' + results[i].name + '</h5><br><div>' + results[i].formatted_address + '</div><div>Open Now: ' + results[i].opening_hours.open_now + ' Price Level <strong>' + results[i].price_level + '</strong> Rating: <strong> ' + results[i].rating +'</strong> </div></div>';
                    createMarkers(results[i].geometry.location, results[i].name, contentStr);
                    animateMarker();
                }

            }
        }
    }
    //function createMarkers(streetAddress, name, contact, location, streetViewAddress)
    ko.applyBindings(vm);
}
