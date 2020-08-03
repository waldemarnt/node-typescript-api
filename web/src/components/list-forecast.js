/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import React, { Fragment } from 'react';
import {
  Arrow,
  Aside,
  Loading,
  SectionForecastList,
  Star,
  SunriseSVG,
  Table,
  SelectTimeButton,
} from './lib';

function ListForecast({ forecast, filterListItems, isLoading }) {
  const [hour, setHour] = React.useState(null);

  const listItems = forecast.filter(filterListItems).slice(0, 5);

  const forecastList = listItems.reduce((forecastByDay, item) => {
    const date = new Date(item.time);
    const day = new Intl.DateTimeFormat('en-GB', {
      month: 'numeric',
      day: 'numeric',
    }).format(date);
    const time = new Intl.DateTimeFormat('en-GB', { hour: 'numeric' }).format(
      date
    );
    forecastByDay[item.time]
      ? forecastByDay[item.time].forecast.push(...item.forecast)
      : (forecastByDay[item.time] = { forecast: [...item.forecast] });
    forecastByDay[item.time].day = day;
    forecastByDay[item.time].time = time;
    return forecastByDay;
  }, {});

  let initialHour = null;
  let newDay = false;
  if (!hour) {
    setHour(Object.keys(forecastList)[0]);
  }

  const timeSelection = Object.keys(forecastList).map((itemHour) => {
    if (!initialHour) {
      initialHour = parseInt(forecastList[itemHour].time);
    } else if (parseInt(forecastList[itemHour].time) < initialHour && !newDay) {
      newDay = true;
    } else {
      newDay = false;
    }
    return (
      <Fragment key={itemHour}>
        {newDay && <SunriseSVG />}
        <SelectTimeButton
          isActive={itemHour === hour}
          handleClick={() => setHour(itemHour)}
        >
          {forecastList[itemHour].time}h
        </SelectTimeButton>
      </Fragment>
    );
  });

  return (
    <SectionForecastList>
      <Aside>{timeSelection}</Aside>
      <Table>
        <thead>
          <tr>
            <th>Beach</th>
            <th>Rating</th>
            <th>Swell</th>
            <th>Wave</th>
            <th>Wind</th>
          </tr>
        </thead>
        <tbody>
          {hour &&
            forecastList &&
            forecastList[hour] &&
            forecastList[hour]?.forecast.length &&
            forecastList[hour].forecast.map((beach, i) => (
              <tr key={`${hour}-${i}`}>
                <td>{beach.name}</td>
                <td>
                  <Star stars={beach.rating} />
                </td>
                <td>
                  <Arrow deg={beach.swellDirection} /> {beach.swellHeight}m{' '}
                  {beach.swellPeriod}s
                </td>
                <td>
                  <Arrow deg={beach.waveDirection} /> {beach.waveHeight}m
                </td>
                <td>
                  <Arrow deg={beach.windDirection} />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {isLoading ? <Loading /> : null}
    </SectionForecastList>
  );
}
export { ListForecast };
