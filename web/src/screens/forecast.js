/** @jsx jsx */
/** @jsxFrag React.Fragment **/
import React from 'react';
import { jsx } from '@emotion/core';
import { useIsFetching } from 'react-query';
import { ListForecast } from '../components/list-forecast';
import {
  useAddBeachToForecast,
  useForecast,
  useBeaches,
} from '../utils/forecast-hooks';
import { useAsync } from '../utils/use-async';
import { Map } from '../components/map';
import {
  Button,
  BeachFormField,
  BeachFormInput,
  BeachFormSelect,
  Flag,
  FullPageLoading,
  MapWrapper,
} from '../components/lib';

function RegisterBeachForm({ onSubmit, submitButton, styles }) {
  const { isLoading, isError, error, run } = useAsync();

  function handleSubmit(event) {
    event.preventDefault();
    const { beachname, latitude, longitude, position } = event.target.elements;

    run(
      onSubmit({
        name: beachname.value,
        lat: parseFloat(latitude.value),
        lng: parseFloat(longitude.value),
        position: position.value,
      })
    );

    if (!isLoading && !isError) {
      event.target.reset();
    }
  }

  return (
    <div
      css={{
        boxSizing: 'border-box',
        ...styles,
      }}
    >
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        css={{
          backgroundColor: '#eee',
          padding: '1em',
        }}
      >
        <BeachFormField label="Beach name" block>
          <BeachFormInput
            label="Beach name"
            type="text"
            placeholder="Barra da Tijuca"
          />
        </BeachFormField>
        <BeachFormField label="Latitude">
          <BeachFormInput
            label="Latitude"
            type="text"
            placeholder="-23.000372"
            pattern="^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$"
          />
        </BeachFormField>
        <BeachFormField label="Longitude">
          <BeachFormInput
            label="Longitude"
            type="text"
            placeholder="-43.365894"
            pattern="^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$"
          />
        </BeachFormField>
        <BeachFormField label="Position">
          <BeachFormSelect
            label="Position"
            options={['North', 'South', 'East', 'West']}
          />
        </BeachFormField>

        <div css={{ display: 'flex', justifyContent: 'center' }}>
          {React.cloneElement(
            submitButton,
            { type: 'submit', isLoading, disabled: isLoading },
            ...(Array.isArray(submitButton.props.children)
              ? submitButton.props.children
              : [submitButton.props.children])
          )}
        </div>
        {isError ? <Flag type="error" message={error.message} /> : null}
      </form>
    </div>
  );
}

function ForecastScreen() {
  const beaches = useBeaches();
  const [handleAddBeach] = useAddBeachToForecast();
  const { forecast, status, error } = useForecast();
  const isFetching = useIsFetching();
  const isError = status === 'error';

  if (status === 'loading') {
    return (
      <FullPageLoading
        caption="Fetching beaches..."
        styles={{ backgroundColor: '#fff', zIndex: '10' }}
      />
    );
  }

  if (isError) {
    return (
      <>
        <RegisterBeachForm
          onSubmit={handleAddBeach}
          submitButton={<Button>Add beach</Button>}
        />
        <Flag message={error.message} type="text" />
      </>
    );
  }

  return (
    <>
      <div>
        <RegisterBeachForm
          onSubmit={handleAddBeach}
          submitButton={<Button>Add beach</Button>}
        />
        {forecast.length ? (
          <ListForecast
            forecast={forecast}
            isLoading={isFetching}
            filterListItems={(li) =>
              new Date(li.time).getHours() % 6 === 0 &&
              new Date(li.time).getHours() !== 0
            }
          />
        ) : (
          <Flag type="alert" message="No beaches added yet, let's start!" />
        )}
      </div>
      <MapWrapper>
        <Map beaches={beaches} />
      </MapWrapper>
    </>
  );
}

export { ForecastScreen };
