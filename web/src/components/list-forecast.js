/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'
import React from 'react'
import {Section, Star, Arrow, Table, ErrorMessage, FullPageLoading} from './misc'
import {useAddBeachToForecast, useForecast, useBeaches} from '../utils/forecast-hooks';
import ErrorBoundary from 'react-error-boundary'

function ListForecast({ forecast, filterListItems}) {
    const [hour, setHour] = React.useState(null)
    
    const listItems = forecast.filter(filterListItems).slice(0, 5);
    
    const forecastList = listItems.reduce((forecastByDay, item) => {
        const date = new Date(item.time);
        const day = new Intl.DateTimeFormat('en-GB', {month: 'numeric', day: 'numeric'}).format(date);
        const time = new Intl.DateTimeFormat('en-GB', {hour: 'numeric'}).format(date);
        forecastByDay[item.time] ? forecastByDay[item.time].forecast.push(...item.forecast) : forecastByDay[item.time] = {forecast: [...item.forecast]};
        forecastByDay[item.time].day = day;
        forecastByDay[item.time].time = time;
        return forecastByDay
    }, {});

    let initialHour = null;
    let newDay = false;
    if (!hour) {
        setHour(Object.keys(forecastList)[0])
    }
    const timeSelection = Object.keys(forecastList).map(itemHour => {
        if (!initialHour) {
            initialHour = parseInt(forecastList[itemHour].time);
        } else if (parseInt(forecastList[itemHour].time) < initialHour && !newDay) {
            newDay = true
        }  else {
            newDay = false
        }

        return (
            <>
                {newDay && <svg css={{display: 'inline-block',
  width: '2em',
  height: '2em',
  strokeWidth: '0',
  stroke: '#f2d546',
  fill: '#f2d546',
  margin: '0 1em'}}viewBox="0 0 24 24">
<path d="M18 18c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243c0 0.552 0.448 1 1 1s1-0.448 1-1c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828c0 0.552 0.448 1 1 1s1-0.448 1-1zM3.513 10.927l1.42 1.42c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.42-1.42c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM1 19h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM21 19h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM19.067 12.347l1.42-1.42c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.42 1.42c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM23 21h-22c-0.552 0-1 0.448-1 1s0.448 1 1 1h22c0.552 0 1-0.448 1-1s-0.448-1-1-1zM8.707 6.707l2.293-2.293v4.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-4.586l2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-4-4c-0.092-0.092-0.202-0.166-0.324-0.217-0.245-0.101-0.521-0.101-0.766 0-0.118 0.049-0.228 0.121-0.324 0.217l-4 4c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>
</svg>}
                <button css={{
                    border: 'none',
                    background: hour === itemHour ? '#f2d546' : 'transparent',
                    margin:' 0 1em',
                    cursor: 'pointer',
                    fontWeight: hour === itemHour ? '600' : '400',
                    ':hover': {
                        textDecoration: 'underline'
                    },
                    ':focus': {
                        textDecoration: 'underline',
                        outline: 'none'
                    },
                }} key={itemHour} onClick={() => setHour(itemHour)}>{forecastList[itemHour].time}h</button>
            </>        
        )
    })

    return (       
        <Section>
            <aside css={{
                padding: '2em',
                textAlign: 'center',
            }}>
                { timeSelection }
            </aside>
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
                    { hour && forecastList && forecastList[hour] && forecastList[hour]?.forecast.length && forecastList[hour].forecast.map( (beach, i) => (
                        <tr key={`${hour}-${i}`}>
                            <td>{beach.name}</td>
                            <td><Star stars={beach.rating} /></td>
                            <td><Arrow deg={beach.swellDirection}/> {beach.swellHeight}m {beach.swellPeriod}s</td>
                            <td><Arrow deg={beach.waveDirection}/> {beach.waveHeight}m</td>
                            <td><Arrow deg={beach.windDirection}/></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Section>
    )
}
export {ListForecast}
