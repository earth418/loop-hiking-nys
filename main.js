import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.7.0/dist/maplibre-gl.mjs';
import dectrails from "./DEC_Trails.json" with {type: 'json'};

const map = new maplibregl.Map({
    container: 'map',
    zoom: 6,
    center: [-75, 43],
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
            },
            "stateSrc": {
                "type": "geojson",
                "data": "https://nysgeohub.ny.gov/arcgis/rest/services/Boundaries/NYS_Civil_Boundaries/FeatureServer/0/query?where=1=1&outFields=*&returnGeometry=true&f=geojson"
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
                    'line-opacity': 0.8,
                    'line-width': 8,
                }
            },
            {
                "id": "state",
                "source": "stateSrc",
                "type": "fill",
                "paint": {
                    'fill-opacity' : 0.5,
                    'fill-color': '#ffffff'
                    // 'line-color': '#770000',
                    // 'line-opacity': 0.8,
                    // 'line-width': 8,
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

const Grid = new Map();
// let latlonToKey = (e) => new Int16Array([Math.round(e[0]), Math.round(e[1])]);
let latlonToKey = (e) => Math.round(e[0]) + "," + Math.round(e[1]);
const arr = dectrails["features"];

for (let i = 0; i < arr.length; ++i) {
    const coords = arr[i]["geometry"]["coordinates"];

    for (let j = 0; j < coords.length; ++j) {
        let key = latlonToKey(coords[j]);
        let pt_index = {"ftIndex": i, "coord": coords[j]};

        if (Grid.has(key)) {
            var keyarr = Grid.get(key);
            keyarr.push(pt_index);
            // Grid.set(key, keyarr);

        } else {
            Grid.set(key, [pt_index]);
        }
    }

}

console.log(Grid);

const PI = 3.14159;

function distance(ll1, ll2) {
    const R = 6371000;
    let [lat1, lon1] = ll1;
    let [lat2, lon2] = ll2;
    let φ1 = lat1 * PI/180;
    let φ2 = lat2 * PI/180;
    let Δφ = (lat2-lat1) * PI/180;
    let Δλ = (lon2-lon1) * PI/180;

    let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
}

function getClosestPts(point, numclosest) {
    // var k = latlonToKey(point);

    let mindists = [];
    let mindist_pts = [];
    for (let i = 0; i < numclosest; ++i) {
        mindists.push(1000000.0);
        mindist_pts.push(null);
    }

    // console.log("Hi!!");

    [-1, 0, 1].forEach((dx) => {
        [-1, 0, 1].forEach((dy) => {
            
            let dxdyk = latlonToKey([point[0] + dx, point[1] + dy]);
            // console.log(dxdyk);
            if (Grid.has(dxdyk)) {
                var gridSec = Grid.get(dxdyk);
                // console.log(gridSec);

                gridSec.forEach(element => {
                    let dist = distance(element.coord, point);
                    if (dist < mindist) {
                        mindist = dist;
                        mindist_pt = element;
                        // console.log(mindist);
                    }
                });
            }
        });
    });

    return mindist_pt;
}

// Calculating a list of intersections

for (let i = 0; i < arr.length; ++i) {
    const coords = arr[i]["geometry"]["coordinates"];

    // check ends!

    let sndclosest_start = getClosestPts(coords[0])[1];

    let sndclosest_end = getClosestPts(coords[-1])[1];

    for (let j = 0; j < coords.length; ++j) {
    }

}




map.on('click', (e) => {
    let loc = e.lngLat;
    // console.log(loc);
    
    let locll = [loc.lng, loc.lat];
    console.log(locll);
    console.log(getClosestPts(locll));

})

// let mapdiv = document.getElementById("map");
// mapdiv.addEventListener('click', (w) => {
//     console.log(w);
    
//     console.log(map(w));
// });


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