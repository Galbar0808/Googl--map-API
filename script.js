let map;
let service;
let infowindow;

function initMap() {
    const initialLocation = { lat: -25.344, lng: 131.036 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: initialLocation,
    });

    infowindow = new google.maps.InfoWindow();

    document.getElementById('getAtmsBtn').addEventListener('click', () => {
        const location = document.getElementById('locationInput').value;
        if (location) {
            findPlaces(location, 'atm');
        }
    });

    document.getElementById('getRestaurantsBtn').addEventListener('click', () => {
        const location = document.getElementById('locationInput').value;
        if (location) {
            findPlaces(location, 'restaurant');
        }
    });
    document.getElementById('getStoresBtn').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    if (location) {
        findPlaces(location, 'store');
    }
});

document.getElementById('getHospitalsBtn').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    if (location) {
        findPlaces(location, 'hospital');
    }
});

}

function findPlaces(location, type) {
    console.log(`Searching for ${type}s in ${location}`); // Debug log
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const pos = results[0].geometry.location;
            map.setCenter(pos);

            const request = {
                location: pos,
                radius: '500',
                type: [type],
            };

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    clearMarkers();
                    for (let i = 0; i < results.length; i++) {
                        const place = results[i];
                        createMarker(place);
                    }
                } else {
                    console.error('Хайлт амжилтгүй: ' + status); // Error log
                    alert('Хайлт амжилтгүй: ' + status);
                }
            });
        } else {
            console.error('Байршил олдсонгүй: ' + status); // Error log
            alert('Байршил олдсонгүй: ' + status);
        }
    });
}

let markers = [];

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    markers.push(marker);

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map, marker);
    });
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}
