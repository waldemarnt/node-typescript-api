/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
// import React from 'react';
import { render } from 'react-dom';
import InfoWindow from './info-window';

let infoWindow = null;

window.map = undefined;

function createInfoWindow(e, map, marker, name) {
  infoWindow = new window.google.maps.InfoWindow({
    content: '<div id="infoWindow" />',
    // position: { lat: e.latLng.lat(), lng: e.latLng.lng()},
    maxWidth: 200,
  });

  infoWindow.addListener('domready', (e) => {
    render(
      <InfoWindow title={name} content="" />,
      document.getElementById('infoWindow')
    );
  });

  infoWindow.open(map, marker);
}

function Map({ beaches }) {
  // const listItems = useListItems();
  // const beaches = listItems[0].forecast;

  if (!beaches) return null;

  const { lat, lng } = beaches[0];
  const zoom = 10;

  const options = {
    center: { lat, lng },
    zoom,
  };

  if (!window.google) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `https://maps.google.com/maps/api/js?key=AIzaSyBB854Viw6N2qgak_TT-C91kHKky82POYw`;
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
    //can't access google.maps until it's finished loading
    s.addEventListener('load', (e) => {
      onScriptLoad();
    });
  } else {
    onScriptLoad();
  }

  function onMapLoad(map) {
    const markers = [];
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
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((marker) => bounds.extend(marker.getPosition()));
    map.setCenter(bounds.getCenter());

    map.fitBounds(bounds); // https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers
  }

  function onScriptLoad() {
    window.map = new window.google.maps.Map(
      document.getElementById('map'),
      options
    );
    onMapLoad(window.map);
  }

  return <div css={{width: '100%', height: '100%'}} id="map" />;
}

export { Map };
