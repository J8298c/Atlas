var map;
var vm;
var markers =[];
var marker;

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
        console.log(currentItem)
    }
    self.hideAllMarkers = function(currentItem){
        var marker = currentItem;
        google.maps.event.trigger(marker, 'click');
        console.log('click did they disappear')
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
	//create marker function to pass response from different apis
	function createMarkers(streetAddress, name, contact, location, streetViewAddress){
		var streetView = "https://maps.googleapis.com/maps/api/streetview?size=300X300&location="+streetViewAddress;
		var contentString = '<div><img src="'+streetView+'"><div class="marker-title">'+name+'</div><div class="marker-location">'+streetAddress+'<br>'+contact+'</div></div>'; 
		//creates new marker instance
		marker = new google.maps.Marker({
			position: location,
			title: name,
			content: contentString,
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
                console.log(foursquareResponse[10].location);
        		if(markers.length === 0){
                    for(var i = 0; i < foursquareResponse.length; i++){
        			    createMarkers(foursquareResponse[i].location.formattedAddress, foursquareResponse[i].name, foursquareResponse[i].contact.formattedPhone, foursquareResponse[i].location, foursquareResponse[i].location.labeledLatLng);
                        console.log(foursquareResponse[i].contact.formattedPhone);
                        // vmFeeder(foursquareResponse[i].name, foursquareResponse[i].categories);  
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
            console.log('clicked');
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
    

    function hideAllMarkers(){
        for(var i = 0; i < markers.length; i++){
            markers.setVisible(false);
        }
    }

	//handles calls on the search bar which are hooked up to street places to give users
    //another source for venues

    $('.submitBtn').on('click', function(){ //on submit will clear out all the markers currently on map
        markers.setMap(null);
        console.log('Clearing out all those peskyu markers')
    });
    ko.applyBindings(vm);
}