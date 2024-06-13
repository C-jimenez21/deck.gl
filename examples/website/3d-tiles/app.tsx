import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import {Tile3DLayer, TerrainLayer, TerrainLayerProps} from '@deck.gl/geo-layers';
import {CesiumIonLoader} from '@loaders.gl/3d-tiles';

import type {MapViewState} from '@deck.gl/core';
import type {Tileset3D} from '@loaders.gl/tiles';

//const ION_ASSET_ID = 2613221;
//const ION_TOKEN ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMzY4MjgwYy0wZGM5LTQ2OTktYjJjMC1kODVjZDkwNmRjY2EiLCJpZCI6MjIwOTA5LCJpYXQiOjE3MTc3ODc3Mzl9.q6nBbouyAPrPbTsTw_kQbOiEdq7dHG4tJCsHaP9_cCE';

/**
 * * Información sobre la SUIZA Agrosavia
 */

const ION_ASSET_ID = 1914727
const ION_TOKEN ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYTcxYTlkZC0zYTdmLTQyNGUtODYwYi05N2M1OTIxOTUxYWMiLCJpZCI6MTQ1NjI4LCJpYXQiOjE2ODc4MTIwMzF9.H6ztE0sqw4LWolRomlPycS-hfHotvhttIOOs9c1x0LM';
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

//  latitude: 7.3703,
//  longitude: -73.17751,


//Creacion de initial view para las dos nubes de puntos
 const info_initial_view = [{
  latitude: 7.3703,
  longitude: -73.17751,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 10
},
{
  latitude: 6.8635025124,
  longitude: -73.4127310823,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 10
}
 ]




const INITIAL_VIEW_STATE: MapViewState = info_initial_view[0]



export default function App({
  mapStyle = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
  //mapStyle = 'mapbox://styles/mapbox/streets-v9',
  //mapStyle ='mapbox://styles/mapbox/satellite-streets-v12',
  updateAttributions
}: {
  mapStyle?: string;
  updateAttributions?: (attributions: any) => void;
}) {
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);

  const onTilesetLoad = (tileset: Tileset3D) => {
    // Recenter view to cover the new tileset
    const {cartographicCenter, zoom} = tileset;
    setInitialViewState({
      ...INITIAL_VIEW_STATE,
      longitude: cartographicCenter[0],
      latitude: cartographicCenter[1],
      zoom
    });

    if (updateAttributions) {
      updateAttributions(tileset.credits && tileset.credits.attributions);
    }
  };

  const tile3DLayer = new Tile3DLayer({
    id: 'tile-3d-layer',
    pointSize: 0.5,
    data: TILESET_URL,
    onTileLoad: (tileHeader) => console.log(tileHeader),
    loader: CesiumIonLoader,
    loadOptions: {
      'cesium-ion': {
      accessToken: ION_TOKEN
        }
    },
    onTilesetLoad
  });
  
  /**
   * * Informacion sobre Villa monica -> FEDECACAO 
   * 
   */
  
  const ION_ASSET_ID_2 = 1991971; //1991971
  const ION_TOKEN_2 ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmN2EwZGU3Ny05NjQ1LTRiMjYtOWRhYS1hM2YxNmZmMGVlMjgiLCJpZCI6MTUxMzU5LCJpYXQiOjE2ODkzNDc3NzN9.QYsd7dI2gCS0cQWu0TJzeHX1BFAPHNr1R9nLejhopRk';
  const TILESET_URL_2 = `https://assets.ion.cesium.com/${ION_ASSET_ID_2}/tileset.json`;

  const tile3DLayer02 = new Tile3DLayer({
    id: 'tile-3d-layer',
    pointSize: 0.5,
    data: TILESET_URL_2,
    onTileLoad: (tileHeader) => console.log(tileHeader),
    loader: CesiumIonLoader,
    loadOptions: {
      'cesium-ion': {
      accessToken: ION_TOKEN_2
        }
    },
    onTilesetLoad
  });



  /**
   * * Superficie usando GPT
   */

 const TERRAIN_IMAGE_URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
 const SURFACE_IMAGE_URL = 'https://s3.amazonaws.com/elevation-tiles-prod/normal/{z}/{x}/{y}.png';
  
  

  const terrainLayer = new TerrainLayer({
    id: 'terrain-layer',
    minZoom: 0,
    maxZoom: 23,
    strategy: 'no-overlap',
    elevationDecoder: {
      rScaler: 256,
      gScaler: 1,
      bScaler: 1 / 256,
      offset: -32768
    },
    elevationData: TERRAIN_IMAGE_URL,
    texture: SURFACE_IMAGE_URL,
    wireframe: false,
    color: [255, 255, 255]
  });

  /**
   * * Superficie usando example
   *  @link https://github.com/visgl/deck.gl/blob/9.0-release/examples/website/terrain/app.tsx
   */

  const MAPBOX_TOKEN = 'pk.eyJ1IjoiY3Jpc3RpYW5qamMyMSIsImEiOiJjbHg1MzAyMGQxODZ6MmtvbWllOW5ua2Z1In0.Qsq2nHiZHqM5WBHdxz2PfQ'
  const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;
  
  //const TERRAIN_IMAGE = `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`;
 //const TERRAIN_IMAGE = `https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain.png`;
 //const TERRAIN_IMAGE = `https://tile.opentopomap.org/{z}/{x}/{y}.png`;
// const TERRAIN_IMAGE = `https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png`;

  const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${MAPBOX_TOKEN}`;
  
  // https://docs.mapbox.com/help/troubleshooting/access-elevation-data/#mapbox-terrain-rgb
// Note - the elevation rendered by this example is greatly exagerated!
const ELEVATION_DECODER: TerrainLayerProps['elevationDecoder'] = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10009
};

const Terrain_layer_02 = new TerrainLayer({
  id: 'terrain',
  minZoom: 0,
  maxZoom: 23,
  strategy: 'no-overlap',
  elevationDecoder: ELEVATION_DECODER,
  elevationData: TERRAIN_IMAGE,
  texture: SURFACE_IMAGE,
  wireframe: false,
  color: [255, 255, 255]
});


  return (
     <DeckGL layers={[
      tile3DLayer, 
      //tile3DLayer02,
      //terrainLayer, 
      Terrain_layer_02,
    ]
      } initialViewState={initialViewState} controller={true}>
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  );
}

export function renderToDOM(container: HTMLDivElement) {
  createRoot(container).render(<App />);
}
