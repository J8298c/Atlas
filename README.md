# foresthills_mapApp
Udacity neighborhood project using Google Maps API and Foursquare
```
//Used to create markers in multiple locations by passing only the required parameters
    function createMarker(location, name, formattedAddress) {
        var streetViewURL = 'https://maps.googleapis.com/maps/api/streetview?size=300x300&location=';
        //move content str below create marker && just use created marker position and name as props
        for (var i = 0; i < Model.markers[0].length; i++) {
            content = '<div><img src="' + streetViewURL + formattedAddress + '">' + '<div class="marker-title">' + name + '</div>';
        }
        var marker = new google.maps.Marker({
            position: location,
            title: name,
            content: content,
            map: map,
            icon: 'http://maps.google.com/mapfiles/marker_yellow.png',
            animation: google.maps.Animation.DROP
        });
```
