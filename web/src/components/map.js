/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { render } from 'react-dom';
import { GMAPS_API_KEY } from '../config';
import { Flag } from './lib';

let infoWindow = null;
window.map = undefined;

function createInfoWindow(e, map, marker, name) {
  infoWindow = new window.google.maps.InfoWindow({
    content: '<div id="infoWindow" />',
    maxWidth: 200,
  });

  infoWindow.addListener('domready', (e) => {
    render(<span>{name}</span>, document.getElementById('infoWindow'));
  });

  infoWindow.open(map, marker);
}

export const Map = ({ beaches }) => {
  if (!GMAPS_API_KEY) {
    return <Flag type="error" message="Missing GMAPS_API_KEY at `config.js`" />;
  }

  if (!beaches || !beaches.length) {
    return null;
  }

  const { lat, lng } = beaches[0];
  const zoom = 10;

  const options = {
    center: { lat, lng },
    zoom,
  };

  if (!window.google) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `https://maps.google.com/maps/api/js?key=${GMAPS_API_KEY}`;
    const x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
    s.addEventListener('load', (e) => {
      onScriptLoad();
    });
  } else {
    onScriptLoad();
  }

  function onMapLoad(map) {
    const markers = [];
    const bounds = new window.google.maps.LatLngBounds();

    beaches.forEach((beach, i) => {
      const { lat, lng, name } = beach;
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: name,
      });
      markers.push(marker);
      marker.addListener('click', (e) => {
        if (infoWindow) {
          infoWindow.close();
        }
        createInfoWindow(e, map, marker, name);
      });
    });

    markers.forEach((marker) => bounds.extend(marker.getPosition()));
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
  }

  function onScriptLoad() {
    window.map = new window.google.maps.Map(
      document.getElementById('map'),
      options
    );
    onMapLoad(window.map);
  }

  return <div id="map" />;
};
