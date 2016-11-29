let map;
const Model = {
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
    markers: [],
}

function appViewModel() {
    const self = this;
    //doesnt work with Model.markers.title or hard coded Model.locations.title
    self.createListings = [{ name: Model.markers.title }];

}


function initMap() {
    const forestHills = { lat: 40.7181, lng: -73.8448 }
    map = new google.maps.Map(document.getElementById('map'), {
        center: forestHills,
        zoom: 14,
    });
    for (let i = 0; i < Model.locations.length; i++) {
        createMarker(Model.locations[i].location, Model.locations[i].title, Model.locations[i].content)
    }

    //creates marker function to call whenever I need to create a marker
    //also works in animating marker upon being clicked
    function createMarker(position, title, content) {
        let marker = new google.maps.Marker({
            position: position,
            title: title,
            content: content,
            map: map,
            icon: 'http://maps.google.com/mapfiles/marker_yellow.png',
            animation: google.maps.Animation.DROP
        })
        Model.markers.push(marker);
        let contentStr;
        for (let i = 0; i < Model.markers.length; i++) {
            contentStr = '<div>' + Model.markers[i].title + '</div>' + '<div>' + Model.markers[i].content + '</div>';
        }
        let bounds = new google.maps.LatLngBounds();
        //pushes new created marker into markers array in model
        let infowindow = new google.maps.InfoWindow({});
        //listener to animate marker upon click changes icon color and animation 
        //sets infowindow content when maker is clicked and opens infowindow
        marker.addListener('click', function() {
            if (this.getAnimation() !== null) {
                this.setAnimation(null);
                this.setIcon('http://maps.google.com/mapfiles/marker_yellow.png');
                infowindow.close(map, this);
            } else {
                $(this).addClass('clickable');
                this.setAnimation(google.maps.Animation.BOUNCE);
                this.setIcon('http://maps.google.com/mapfiles/marker_purple.png');
                infowindow.setContent(contentStr);
                infowindow.open(map, this);
                bounds.extend(this.position)
            }
        });
    }
    ko.applyBindings(new appViewModel());

}