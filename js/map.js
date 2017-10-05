// Zentrum der Karte je nach Ausgabegerät festlegen
function setInitialMapCenter() {

    var viewportWidth = window.innerWidth;
    var center;
    if (viewportWidth < [600]) {
        center = [49.1572359, 9.2995620];
    } else {
        center = [49.2476381, 9.3703079];
    }
    return center;
};

//Standardzoom der Karte je nach Ausgabegerät festlegen
function setInitialZoom() {
    var viewportWidth = window.innerWidth;
    var initZoom;
    if (viewportWidth < [600]) {
        initZoom = 10;
    } else {
        initZoom = 11;
    }
    return initZoom;
};

// Die eigentliche Karte initialisieren
function main() {
    var bounds = [
        [48.6111, 7.9321],
        [49.6958, 10.6952]
    ];

    var mapOptions = {
        center: setInitialMapCenter(),
        zoom: 10,
        minZoom: 7,
        maxZoom: 17,
        zoomControl: true,
        attributionControl: true,
        legends: false,
        layer_selector: false,
        maxBounds: bounds,
    };

    // Karte und Basemap initialisieren
    var map = L.map('map', mapOptions);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        id: 'mapbox.light',
        accessToken: "pk.eyJ1IjoiZGFoaWx6ZW4zMiIsImEiOiJjaXZ5OWwxam8wMDFqMnpxOXc4Y3l5dXd1In0.S9lbvSNNnpsOs4BXCzZoVg",
    }).addTo(map);


    var markers = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 15,
            maxClusterRadius: 120,
        });
    markers.addLayer(L.geoJson(aerzte));
    map.addLayer(markers);

}

window.onload = main()