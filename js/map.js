//Standardzoom der Karte je nach Ausgabegerät festlegen
function setInitialZoom() {
    var viewportWidth = window.innerWidth;
    var initZoom;
    if (viewportWidth < [800]) {
        initZoom = 10;
    } else {
        initZoom = 9;
    }
    return initZoom;
}

// Die eigentliche Karte initialisieren
function main() {

    // Globale Variablen definieren
    var new_event_marker;
    var copy;

    // etwas in die Infobox schreiben
    document.getElementById('infotext').innerHTML = '<center><p><b>Klicken Sie auf die Karte.</b></p></center>';

    // Bounding Box festlegen
    var bounds = [
        [46.4227, 5.9985],
        [50.639, 11.9861]
    ];

    // Kartenoptionen bestimmen
    var mapOptions = {
        center: [49.1426930, 9.2108790],
        zoom: setInitialZoom(),
        minZoom: 7,
        maxZoom: 17,
        zoomControl: false,
        zoomDelta: .25,
        zoomSnap: .25,
        attributionControl: true,
        legends: false,
        layer_selector: false,
        maxBounds: bounds
    };

    // Karte und Basemap initialisieren
    var map = L.map('map', mapOptions);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoiZGFoaWx6ZW4zMiIsImEiOiJjaXZ5OWwxam8wMDFqMnpxOXc4Y3l5dXd1In0.S9lbvSNNnpsOs4BXCzZoVg',
    }).addTo(map);


    // Die Marker abrufen und clustern
    var hausarztMarker = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15,
        maxClusterRadius: 100,
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
        maxClusterRadius: 100,
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
        maxClusterRadius: 100,
        iconCreateFunction: function(cluster) {
            return L.divIcon({
                html: '<span class="markerText">' + cluster.getChildCount() +
                    '</span>',
                className: 'zahnarztMarker',
                iconSize: L.point(40, 40)
            });
        }
    });

    var ha = L.geoJson(hausaerzte_region, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: greenIcon
            });
        },
        onEachFeature: onEachFeature
    });

    var fa = L.geoJson(fachaerzte_region, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: blueIcon
            });
        },
        onEachFeature: onEachFeature
    });

    var za = L.geoJson(zahnaerzte_region, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: orangeIcon
            });
        },
        onEachFeature: onEachFeatureZahn
    });

    var gemeinden = L.geoJson(gemeinden).addTo(map);

    // Layer mit Cluster erstellen
    hausarztMarker.addLayer(ha);
    facharztMarker.addLayer(fa);
    zahnarztMarker.addLayer(za);

    // Events für Buttons festlegen, Hausärzte, Fachärzte oder Zahnärzte auswählen
    var hausarztClick = function() {
        document.getElementById('infotext').innerHTML = '<center><p><b>Klicken Sie auf die Karte.</b></p></center>';
        document.querySelector('.ha').style.backgroundColor = 'rgba(40, 173, 37, .6)';
        document.querySelector('.fa').style.backgroundColor = '';
        document.querySelector('.za').style.backgroundColor = '';
        copy = L.geoJSON(hausaerzte_region);
        map.removeLayer(facharztMarker);
        map.removeLayer(zahnarztMarker);
        map.addLayer(hausarztMarker);
    };

    var facharztClick = function() {
        document.getElementById('infotext').innerHTML = '<center><p><b>Klicken Sie auf die Karte.</b></p></center>';
        document.querySelector('.fa').style.backgroundColor = 'rgba(45, 132, 203, .6)';
        document.querySelector('.ha').style.backgroundColor = '';
        document.querySelector('.za').style.backgroundColor = '';
        copy = L.geoJSON(fachaerzte_region);
        map.removeLayer(hausarztMarker);
        map.removeLayer(zahnarztMarker);
        map.addLayer(facharztMarker);
    };

    var zahnarztClick = function() {
        document.getElementById('infotext').innerHTML = '<center><p><b>Klicken Sie auf die Karte.</b></p></center>';
        document.querySelector('.za').style.backgroundColor = 'rgba(203, 133, 43, .6)';
        document.querySelector('.ha').style.backgroundColor = '';
        document.querySelector('.fa').style.backgroundColor = '';
        copy = L.geoJSON(zahnaerzte_region);
        map.removeLayer(facharztMarker);
        map.removeLayer(hausarztMarker);
        map.addLayer(zahnarztMarker);

    };

    document.querySelector('.ha').addEventListener('click', hausarztClick);
    document.querySelector('.fa').addEventListener('click', facharztClick);
    document.querySelector('.za').addEventListener('click', zahnarztClick);
    hausarztClick();

    // Event ausführen, wenn auf die Karte geklickt wird
    function mapClick(e) {
        var lat = e.latlng.lat;
        var lon = e.latlng.lng;

        if (typeof(new_event_marker) === 'undefined') {
            new_event_marker = new L.marker(e.latlng, {
                draggable: true,
                icon: redIcon
            });
            new_event_marker.addTo(map);

        } else {
            new_event_marker.setLatLng(e.latlng);
        }

        var nearest = leafletKnn(copy).nearest(L.latLng(lat, lon), 1);
        var near1 = leafletKnn(copy).nearest(L.latLng(lat, lon), 10000, 1000);
        var near5 = leafletKnn(copy).nearest(L.latLng(lat, lon), 10000, 5000);
        var near10 = leafletKnn(copy).nearest(L.latLng(lat, lon), 10000, 10000);
        var near20 = leafletKnn(copy).nearest(L.latLng(lat, lon), 10000, 20000);
        document.getElementById('infotext').innerHTML = '<center><p><b>Nächster Arzt:<br> ' + nearest[0].layer.feature.properties.name + '</p></b>' +
            'Ärzte im Umkreis von 1km: ' + near1.length + '<br>' +
            'Ärzte im Umkreis von 5km: ' + near5.length + '<br>' +
            'Ärzte im Umkreis von 10km: ' + near10.length + '<br>' +
            'Ärzte im Umkreis von 20km: ' + near20.length + '<br></center>';
    }
    map.on('click', mapClick);


    // Popups bestimmen    
    function onEachFeature(feature, layer) {
        layer.on('click', function(e) {
            document.getElementById('infotext').innerHTML = '<center><p><b>Praxis ' + feature.properties.praxis + '</b></p><p>' + feature.properties.straße + ' in ' + feature.properties.plz_ort + '</center>';
        });
    }

    function onEachFeatureZahn(feature, layer) {
        layer.on('click', function(e) {
            document.getElementById('infotext').innerHTML = '<center><p><b>' + feature.properties.name + '</b></p><p>' + feature.properties.straße + ' in ' + feature.properties.plz_ort + '</center>';
        });
    }

    // add swoopy arrow
    new L.SwoopyArrow([49.3224120, 9.3540690], [49.1426930, 9.2108790], {
        text: 'Heilbronn',
        color: '#000000',
        textClassName: 'swoopy-arrow',
        minZoom: 4,
        maxZoom: 12,
        weight: 1,
        iconAnchor: [25, 15]
    }).addTo(map);

    new L.SwoopyArrow([49.1050590, 9.5682240], [49.2116813, 9.4723779], {
        text: 'Öhringen',
        color: '#000000',
        textClassName: 'swoopy-arrow',
        minZoom: 4,
        maxZoom: 12,
        weight: 1,
        iconAnchor: [15, 0]
    }).addTo(map);

    new L.SwoopyArrow([49.2176650, 8.7068970], [49.1379830, 8.9092340], {
        text: 'Eppingen',
        color: '#000000',
        textClassName: 'swoopy-arrow',
        minZoom: 4,
        maxZoom: 12,
        weight: 1,
        iconAnchor: [55, 10]
    }).addTo(map);



// Scroll-Trap verhindern, indem bestimmte Interaktionen erst nach Buttonklick verfügbar sind.
    const activate = document.querySelector('#activate-btn');
    activate.addEventListener('click', () => {
        if (enabled) {
            activate.innerHTML = 'Karte aktivieren';
            disableMap();
        } else {
            activate.innerHTML = 'Karte deaktivieren';
            enableMap();
        }
        enabled = !enabled;
    });


    function disableMap() {
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.tap) map.tap.disable();
        document.getElementById('map').style.cursor = 'default';
        document.getElementById('activate-btn').style.backgroundColor = 'rgb(247, 255, 0)';
    }

    function enableMap() {
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        if (map.tap) map.tap.enable();
        document.getElementById('map').style.cursor = 'grab';
        document.getElementById('activate-btn').style.backgroundColor = 'rgba(255, 255, 255, .6)';
    }

    let enabled = false;
    disableMap();

}

window.onload = main();



