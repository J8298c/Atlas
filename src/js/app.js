var map;
var vm;
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
    }],
    markers: []
};

// knockout ViewModel Obj
function AppViewModel(marker) {
    var self = this;
    self.createListings = ko.observableArray();
    //function to associates list title to marker to animate on click
    self.activateMarker = function(currentItem) {
        var marker = currentItem;
        google.maps.event.trigger(marker, 'click');
    };
    //function to filter throught categories and display selected category on list-view
  self.categories = ko.observableArray();

   
}

function initMap() {
    var forestHills = { lat: 40.7181, lng: -73.8448 }
    vm = new AppViewModel();
    map = new google.maps.Map(document.getElementById('map'), {
        center: forestHills,
        zoom: 15,
        mapTypeControl: false,
        styles: [{ "featureType": "administrative", "elementType": "all", "stylers": [{ "visibility": "on" }, { "lightness": 33 }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2e5d4" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#c5dac6" }] }, { "featureType": "poi.park", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": 20 }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#c5c6c6" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#e4d7c6" }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#fbfaf7" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#acbcc9" }] }]
    });
    //need to add foursquare request and hook it up to input box in html
    function getFourSquare() {
        var client_id = "ZBCPIT5VPYBTT2KNLCWMIJU4BAL4ANCO4MPJHLSJBOYB3D32";
        var client_secret = '2K5DPY4FG2DN2ZX4JSTWXHUN140LMR1JHGE04YCXOU0P303P';
        //userless request url passing in search query from
        //form input
        var fourSquareUrl = "https://api.foursquare.com/v2/venues/search" +
            "?client_id=" + client_id +
            "&client_secret=" + client_secret +
            "&v=20160815" +
            "&ll=" + 40.7181 + "," + -73.8448;
        $.ajax({
            url: fourSquareUrl,
            dataType: 'json',
        }).done(function(data) {
            var foursquareResponse = data.response.venues
            if (Model.markers.length === 0) {
                console.log('nothing in the marker')
                Model.markers.push(foursquareResponse);
                for(var i = 0; i < foursquareResponse.length; i ++){
                        vm.categories.push([foursquareResponse[i].name, foursquareResponse[i].categories.pluralName]);
                }
            }
            for (var i = 0; i < Model.markers[0].length; i++) {
                createMarker(Model.markers[0][i].location, Model.markers[0][i].name, Model.markers[0][i].location.formattedAddress, Model.markers[0][i].contact.formattedPhone);
            }
        }).fail(function() {
            for (var i = 0; i < Model.locations.length; i++) {
                createMarker(Model.locations[i].location, Model.locations[i].title, Model.locations[i].content)
            }
        })
    }
    getFourSquare();
    //creates marker function to call whenever I need to create a marker
    //also works in animating marker upon being clicked
    function createMarker(location, name, formattedAddress, contactInfo) {
        var streetViewURL = 'https://maps.googleapis.com/maps/api/streetview?size=300x300&location=';
        //move content str below create marker && just use created marker position and name as props
        for (var i = 0; i < Model.markers[0].length; i++) {
            content = '<div><img src="' + streetViewURL + formattedAddress + '">' + '<div class="marker-title">' + name + '</div>' + '<div class="marker-location">' + formattedAddress + '</div>' + '<div class="contact-info">' + contactInfo +'</div>';
        }
        var marker = new google.maps.Marker({
            position: location,
            title: name,
            content: content,
            map: map,
            icon: 'http://maps.google.com/mapfiles/marker_yellow.png',
            animation: google.maps.Animation.DROP
        });
        vm.createListings.push(marker);
        var bounds = new google.maps.LatLngBounds();
        //pushes new created marker into markers array in model
        var infowindow = new google.maps.InfoWindow({});
        //function to hide all current markers on map
        function hideMarker(){
            $('.remove').on('click', function(){
                console.log('poof theyre gone');
                for(var i = 0; i < Model.markers.length; i++){
                    marker.setVisible(false);
                }
            })
        }
        hideMarker()
        //function to set markers back on map after user clicks the hide marker
         function showMarker(){
            $('.show').on('click', function(){
                console.log('poof theyre back');
                for(var i = 0; i < Model.markers.length; i++){
                    marker.setVisible(true);
                }
            })
        }
        showMarker();
        //function that handles the marker actions when clicked
        //changes color of marker and changes markers animation
        function markerAnimate() {
            marker.addListener('click', function() {
                if (this.getAnimation() !== null) {
                    this.setAnimation(null);
                    this.setIcon('http://maps.google.com/mapfiles/marker_yellow.png');
                    infowindow.close(map, this);
                } else {
                    $(this).addClass('clickable');
                    this.setAnimation(google.maps.Animation.BOUNCE);
                    this.setIcon('http://maps.google.com/mapfiles/marker_purple.png');
                    infowindow.setContent(this.content);
                    infowindow.open(map, this);
                    bounds.extend(this.position)
                }
            });
        }
        
        markerAnimate();
        //clears all current markers to before dropinng in users search newly
        //created markers
        $('.submitBtn').on('click', function(){
            marker.setMap(null);
            console.log('Clearing those pesky markers out');
        })
    }
   
    var stringSearch;
    //sets up search for results wihin forest hills
    $('form').submit(function(e) {
        e.preventDefault();
        //grabs string search to be used as value 
        //for google places search query
        var stringSearch = $('input').val();
        console.log(stringSearch);
        vm.createListings.removeAll();
        getPlaces(stringSearch);
        $('input').val('');
    });
    //function using google places using stringSearch set in above as param
    function getPlaces(stringSearch) {
        var request = {
            location: { lat: 40.7194, lng: -73.8452 },
            radius: '100',
            query: stringSearch
        }
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                Model.markers = [];
                Model.markers.push(results);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i].geometry.location, results[i].name, results[i].formatted_address);
                }
            }
        }
    }
    ko.applyBindings(vm);
}