<h1>My App Title</h1>
<p>An interactive Google maps project based on Forest Hills Queens New York. It comes with preloaded locations using the <span style="color: blue">FourSquare</span>
api, and styled using <span style="color: blue">Snazzy Maps</span>. After browsing through the preloaded locations feel free to search the area using the search bar which
use the <span style="color: blue">Google Places</span>api to return nearby results, never know what you might find in Forest Hills.</p>
<h3 style="text-decoration: underline">Code Sample</h3>

<h4>Knockout data-binding</h4>
```
//pushes newly created markers to the AppViewModel
 vm = new AppViewModel();
 vm.createListings.push(marker);
 
//Knockout AppViewModel to populate created markers title into the list-view
function AppViewModel(marker) {
    var self = this;
    self.createListings = ko.observableArray();
}

```
<h4>Google Maps</h4>
```
//function to create markers in various points through out the application
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
        })
```
<h3 style="text-decoration: underline">SOURCES</h3>
<ul>
    <li style="list-style-type: none"><a href="http://knockoutjs.com" target="_blank">Knockout JS</a></li>
    <li style="list-style-type: none"><a href="https://developers.google.com/maps/documentation/javascript/" target="_blank">Google Maps Api</a></li>
    <li style="list-style-type: none"><a href="https://jquery.com/" target="_blank">jQuery</a></li>
    <li style="list-style-type: none"><a href="https://snazzymaps.com/" target="_blank">Snazzy Maps</a></li>
</ul>
