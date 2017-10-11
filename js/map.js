//Standardzoom der Karte je nach Ausgabegerät festlegen
function setInitialZoom() {
    var viewportWidth = window.innerWidth;
    var initZoom;
    if (viewportWidth < [600]) {
        initZoom = 10;
    } else {
        initZoom = 8;
    }
    return initZoom;
};

function setInitialCenter() {
    var viewportWidth = window.innerWidth;
    var initCenter;
    if (viewportWidth < [600]) {
        initCenter = [49.1426930, 9.2108790]; //Heilbronn
    } else {
        initCenter = [48.6616040, 9.3501340]; //Baden-Württemberg
    }
    return initCenter;
};


// Die eigentliche Karte initialisieren
function main() {

    // Bounding Box festlegen
    var bounds = [
        [46.4227, 5.9985],
        [50.639, 11.9861]
    ];

    // Kartenoptionen bestimmen
    var mapOptions = {
        center: setInitialCenter(),
        zoom: setInitialZoom(),
        minZoom: 7,
        maxZoom: 17,
        zoomControl: false,
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


    // Die Marker abrufen und clustern
    var hausarztMarker = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15,
        maxClusterRadius: 80,
        iconCreateFunction: function(cluster) {
            return L.divIcon({
                html: '<span class="markerText">' + cluster.getChildCount() +
                    '</span>',
                className: 'hausarztMarker',
                iconSize: L.point(40, 40)
            });
        }
    });

    var facharztMarker = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15,
        maxClusterRadius: 80,
        iconCreateFunction: function(cluster) {
            return L.divIcon({
                html: '<span class="markerText">' + cluster.getChildCount() +
                    '</span>',
                className: 'facharztMarker',
                iconSize: L.point(40, 40)
            });
        }
    });

    var zahnarztMarker = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15,
        maxClusterRadius: 80,
        iconCreateFunction: function(cluster) {
            return L.divIcon({
                html: '<span class="markerText">' + cluster.getChildCount() +
                    '</span>',
                className: 'zahnarztMarker',
                iconSize: L.point(40, 40)
            });
        }
    });

    var ha = L.geoJson(hausaerzte, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: greenIcon,
            });
        },
        onEachFeature: onEachFeature,
    });

    var fa = L.geoJson(fachaerzte, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: blueIcon,
            });
        },
        onEachFeature: onEachFeature,
    });

    var za = L.geoJson(zahnaerzte, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: yellowIcon,
            });
        },
        onEachFeature: onEachFeature,
    });

    var alle = L.layerGroup([ha, fa, za]);

    hausarztMarker.addLayer(ha);
    facharztMarker.addLayer(fa);
    zahnarztMarker.addLayer(za);

    var mark;

    // Events für Buttons festlegen, Hausärzte, Fachärzte oder Zahnärzte auswählen
    var hausarztClick = function() {
        map.removeLayer(facharztMarker);
        map.removeLayer(zahnarztMarker);
        map.addLayer(hausarztMarker);
        map.on('click', function(e) {
            var lat = e.latlng.lat;
            var lon = e.latlng.lng;

            if (typeof(new_event_marker) === 'undefined') {
                new_event_marker = new L.marker(e.latlng, { draggable: true, icon: redIcon });
                new_event_marker.addTo(map);

            } else {
                new_event_marker.setLatLng(e.latlng);
            }

            var nearest = leafletKnn(ha).nearest(L.latLng(lat, lon), 1);
            var near1 = leafletKnn(ha).nearest(L.latLng(lat, lon), 10000, 1000);
            var near5 = leafletKnn(ha).nearest(L.latLng(lat, lon), 10000, 5000);
            var near10 = leafletKnn(ha).nearest(L.latLng(lat, lon), 10000, 10000);
            var near20 = leafletKnn(ha).nearest(L.latLng(lat, lon), 10000, 20000);
            console.log(nearest);
            console.log(near1.length);
            console.log(near5.length);
            document.getElementById("infotext").innerHTML = '<center><p><b>Nächster Hausarzt: ' + nearest[0].layer.feature.properties.name + '</p></b>' +
                'Hausärzte im Umkreis von 1km: ' + near1.length + '<br>' +
                'Hausärzte im Umkreis von 5km: ' + near5.length + '<br>' +
                'Hausärzte im Umkreis von 10km: ' + near10.length + '<br>' +
                'Hausärzte im Umkreis von 20km: ' + near20.length + '<br></center>';

        })
    }

    var facharztClick = function() {
        map.removeLayer(hausarztMarker);
        map.removeLayer(zahnarztMarker);
        map.addLayer(facharztMarker);
        map.on('click', function(e) {
            var lat = e.latlng.lat;
            var lon = e.latlng.lng;
                if (typeof(new_event_marker) === 'undefined') {
                    new_event_marker = new L.marker(e.latlng, { draggable: true, icon: redIcon });
                    new_event_marker.addTo(map);

                } else {
                    new_event_marker.setLatLng(e.latlng);
                }

                var nearest = leafletKnn(fa).nearest(L.latLng(lat, lon), 1);
                var near1 = leafletKnn(fa).nearest(L.latLng(lat, lon), 10000, 1000);
                var near5 = leafletKnn(fa).nearest(L.latLng(lat, lon), 10000, 5000);
                var near10 = leafletKnn(fa).nearest(L.latLng(lat, lon), 10000, 10000);
                var near20 = leafletKnn(fa).nearest(L.latLng(lat, lon), 10000, 20000);
                console.log(nearest);
                console.log(near1.length);
                console.log(near5.length);
                document.getElementById("infotext").innerHTML = '<center><p><b>Nächster Facharzt: ' + nearest[0].layer.feature.properties.name + '</p></b>' +
                    'Fachärzte im Umkreis von 1km: ' + near1.length + '<br>' +
                    'Fachärzte im Umkreis von 5km: ' + near5.length + '<br>' +
                    'Fachärzte im Umkreis von 10km: ' + near10.length + '<br>' +
                    'Fachärzte im Umkreis von 20km: ' + near20.length + '<br></center>';

        })
    }

    var zahnarztClick = function() {
        map.removeLayer(facharztMarker);
        map.removeLayer(hausarztMarker);
        map.addLayer(zahnarztMarker);
        map.on('click', function(e) {
            var lat = e.latlng.lat;
            var lon = e.latlng.lng;
                if (typeof(new_event_marker) === 'undefined') {
                    new_event_marker = new L.marker(e.latlng, { draggable: true, icon: redIcon });
                    new_event_marker.addTo(map);

                } else {
                    new_event_marker.setLatLng(e.latlng);
                }

                var nearest = leafletKnn(za).nearest(L.latLng(lat, lon), 1);
                var near1 = leafletKnn(za).nearest(L.latLng(lat, lon), 10000, 1000);
                var near5 = leafletKnn(za).nearest(L.latLng(lat, lon), 10000, 5000);
                var near10 = leafletKnn(za).nearest(L.latLng(lat, lon), 10000, 10000);
                var near20 = leafletKnn(za).nearest(L.latLng(lat, lon), 10000, 20000);
                console.log(nearest);
                console.log(near1.length);
                console.log(near5.length);
                document.getElementById("infotext").innerHTML = '<center><p><b>Nächster Zahnarzt: ' + nearest[0].layer.feature.properties.Name + '</p></b>' +
                    'Zahnärzte im Umkreis von 1km: ' + near1.length + '<br>' +
                    'Zahnärzte im Umkreis von 5km: ' + near5.length + '<br>' +
                    'Zahnärzte im Umkreis von 10km: ' + near10.length + '<br>' +
                    'Zahnärzte im Umkreis von 20km: ' + near20.length + '<br></center>';

        })
    }

    document.querySelector(".ha").addEventListener('click', hausarztClick);
    document.querySelector(".fa").addEventListener('click', facharztClick);
    document.querySelector(".za").addEventListener('click', zahnarztClick);
    hausarztClick();


    // Möglichkeit schaffen, ab Zoomstufe 12 eigenen Marker per Click anzulegen
    var new_event_marker;

    /*    function onMapClick() {
            map.on('click', function(e) {
                var lat = e.latlng.lat;
                var lon = e.latlng.lng;
                var currentZoom = map.getZoom();

                if (currentZoom > 10) {
                    if (typeof(new_event_marker) === 'undefined') {
                        new_event_marker = new L.marker(e.latlng, { draggable: true, icon: redIcon });
                        new_event_marker.addTo(map);

                    } else {
                        new_event_marker.setLatLng(e.latlng);
                    }

                    var nearest = leafletKnn(ha).nearest(L.latLng(lat, lon), 1);
                    var near1 = leafletKnn(ha).nearest(L.latLng(lat, lon), 10000, 1000);
                    var near5 = leafletKnn(ha).nearest(L.latLng(lat, lon), 10000, 5000);
                    var near10 = leafletKnn(ha).nearest(L.latLng(lat, lon), 10000, 5000);
                    var near20 = leafletKnn(ha).nearest(L.latLng(lat, lon), 10000, 5000);
                    console.log(nearest);
                    console.log(near1.length);
                    console.log(near5.length);
                }
            })
        }

        onMapClick();*/


    function onEachFeature(feature, layer) {
        layer.on('click', function(e) {
            document.getElementById("infotext").innerHTML = '<center><p><b>Praxis ' + feature.properties.praxis + '</b></p><p>' + feature.properties.straße + ' in ' + feature.properties.plz_ort + '</center>';
        });
    }

    // add swoopy arrow
    new L.SwoopyArrow([49.3224120, 9.3540690], [49.1426930, 9.2108790], {
        text: 'Heilbronn',
        color: '#000000',
        textClassName: 'swoopy-arrow',
        minZoom: 4,
        maxZoom: 9,
        factor: 0.75,
        wight: 10,
        iconAnchor: [25, 15]
    }).addTo(map);

}

window.onload = main()