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
};

/*function setInitialCenter() {
    var viewportWidth = window.innerWidth;
    var initCenter;
    if (viewportWidth < [800]) {
        initCenter = [49.1426930, 9.2108790]; //Heilbronn
    } else {
        initCenter = [48.6616040, 9.3501340]; //Baden-Württemberg
    }
    return initCenter;
};*/

// Die eigentliche Karte initialisieren
function main() {

    // Globale Variablen definieren
    var new_event_marker;
    var copy;

    // etwas in die Infobox schreiben
    document.getElementById("infotext").innerHTML = "<center><p><b>Klicken Sie auf die Karte.</b></p></center>";

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
                icon: greenIcon,
            });
        },
        onEachFeature: onEachFeature,
    });

    var fa = L.geoJson(fachaerzte_region, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: blueIcon,
            });
        },
        onEachFeature: onEachFeature,
    });

    var za = L.geoJson(zahnaerzte_region, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: yellowIcon,
            });
        },
        onEachFeature: onEachFeatureZahn,
    });

    // Layer mit Cluster erstellen
    hausarztMarker.addLayer(ha);
    facharztMarker.addLayer(fa);
    zahnarztMarker.addLayer(za);

    // Events für Buttons festlegen, Hausärzte, Fachärzte oder Zahnärzte auswählen
    var hausarztClick = function() {
        document.getElementById("infotext").innerHTML = "<center><p><b>Klicken Sie auf die Karte.</b></p></center>";
        document.querySelector('.ha').style.backgroundColor = "rgba(40, 173, 37, .6)";
        document.querySelector('.fa').style.backgroundColor = "";
        document.querySelector('.za').style.backgroundColor = "";
        copy = L.geoJSON(hausaerzte_region);
        map.removeLayer(facharztMarker);
        map.removeLayer(zahnarztMarker);
        map.addLayer(hausarztMarker);
    }

    var facharztClick = function() {
        document.getElementById("infotext").innerHTML = "<center><p><b>Klicken Sie auf die Karte.</b></p></center>";
        document.querySelector('.fa').style.backgroundColor = "rgba(45, 132, 203, .6)";
        document.querySelector('.ha').style.backgroundColor = "";
        document.querySelector('.za').style.backgroundColor = "";
        copy = L.geoJSON(fachaerzte_region);
        map.removeLayer(hausarztMarker);
        map.removeLayer(zahnarztMarker);
        map.addLayer(facharztMarker);
    }

    var zahnarztClick = function() {
        document.getElementById("infotext").innerHTML = "<center><p><b>Klicken Sie auf die Karte.</b></p></center>";
        document.querySelector('.za').style.backgroundColor = "rgba(203, 197, 41, .6)";
        document.querySelector('.ha').style.backgroundColor = "";
        document.querySelector('.fa').style.backgroundColor = "";
        copy = L.geoJSON(zahnaerzte_region);
        map.removeLayer(facharztMarker);
        map.removeLayer(hausarztMarker);
        map.addLayer(zahnarztMarker);
    }

    document.querySelector(".ha").addEventListener('click', hausarztClick);
    document.querySelector(".fa").addEventListener('click', facharztClick);
    document.querySelector(".za").addEventListener('click', zahnarztClick);
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
        document.getElementById("infotext").innerHTML = '<center><p><b>Nächster Arzt: ' + nearest[0].layer.feature.properties.name + '</p></b>' +
            'Ärzte im Umkreis von 1km: ' + near1.length + '<br>' +
            'Ärzte im Umkreis von 5km: ' + near5.length + '<br>' +
            'Ärzte im Umkreis von 10km: ' + near10.length + '<br>' +
            'Ärzte im Umkreis von 20km: ' + near20.length + '<br></center>';
    }
    map.on('click', mapClick);

    // Popups bestimmen    
    function onEachFeature(feature, layer) {
        layer.on('click', function(e) {
            document.getElementById("infotext").innerHTML = '<center><p><b>Praxis ' + feature.properties.praxis + '</b></p><p>' + feature.properties.straße + ' in ' + feature.properties.plz_ort + '</center>';
        });
    }

    function onEachFeatureZahn(feature, layer) {
        layer.on('click', function(e) {
            document.getElementById("infotext").innerHTML = '<center><p><b>' + feature.properties.name + '</b></p><p>' + feature.properties.straße + ' in ' + feature.properties.plz_ort + '</center>';
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