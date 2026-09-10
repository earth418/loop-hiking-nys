import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.7.0/dist/maplibre-gl.mjs';
import dectrails from "./DEC_Trails.json" with {type: 'json'};

const map = new maplibregl.Map({
    container: 'map',
    zoom: 6,
    center: [-72.9150899566626, 42.25956997955441],
});

map.setStyle({
        "version": 8,
        "projection": {"type":"globe"},
        "sources": {
            "satelliteSrc": {
                "type": "raster",
                "tiles": [
                    "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"
                ],
                "tileSize": 256
            },

            "terrainSrc": {
                "type": "raster-dem",
                "url": 'https://tiles.mapterhorn.com/tilejson.json'
            },

            "hillshadeSrc": {
                "type": "raster-dem",
                "url": 'https://tiles.mapterhorn.com/tilejson.json'
            },
            "dectrails_json": {
                "type": "geojson",
                "data": dectrails
            }
        },
        "layers": [{
                "id": "satellite",
                "type": "raster",
                "source": "satelliteSrc"
            },
            {
                "id": "hillshade",
                "type": "hillshade",
                "source": "hillshadeSrc",
                "layout": { visibility: "visible"},
                "paint": { "hillshade-shadow-color": "#483624"}
            },
            {
                'id': 'dectrails',
                'type': 'line',
                'source': 'dectrails_json',
                'paint': {
                    'line-color': '#ffffff',
                    'line-opacity': 0.4,
                    'line-width': 15,
                }
            }
        ],

        "terrain": {
            "source":"terrainSrc",
            "exaggeration":1
        }
    }
);

map.addControl(
    new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true
    })
);


map.addControl(
    new maplibregl.GlobeControl()
);

map.addControl(
    new maplibregl.TerrainControl({
        source: 'terrainSource',
        exaggeration: 1
    })
);

// map.addLayer({
//     'id': 'dectrails',
//     'type': 'line',
//     'source': 'dectrails_json',
//     'paint': {
//         'fill-color': '#888888',
//         'fill-opacity': 0.4,
//     }
// })

let mapdiv = document.getElementById("map");
mapdiv.addEventListener('click', (w) => {
    console.log(w);
    
    console.log(map(w));
});


// LineString
// MultiLineString

console.log(dectrails[0]);


// function handleFileSelect(evt) {
//     const file = evt.target.files[0]; // Read first selected file

//     const reader = new FileReader();

//     reader.onload = function (theFile) {
//         // Parse as (geo)JSON
//         const geoJSONcontent = JSON.parse(theFile.target.result);

//         // Add as source to the map
//         map.addSource('uploaded-source', {
//             'type': 'geojson',
//             'data': geoJSONcontent
//         });

//         map.addLayer({
//             'id': 'uploaded-polygons',
//             'type': 'fill',
//             'source': 'uploaded-source',
//             'paint': {
//                 'fill-color': '#888888',
//                 'fill-outline-color': 'red',
//                 'fill-opacity': 0.4
//             },
//             // filter for (multi)polygons; for also displaying linestrings
//             // or points add more layers with different filters
//             'filter': ['==', '$type', 'Polygon']
//         });
//     };

//     // Read the GeoJSON as text
//     reader.readAsText(file, 'UTF-8');
// }

// document
//     .getElementById('file')
//     .addEventListener('change', handleFileSelect, false);