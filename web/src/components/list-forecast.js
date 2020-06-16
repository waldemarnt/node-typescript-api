/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'
import React from 'react'
import {Section, Star, Arrow, Table} from './misc'
import {useAddBeachToForecast, useForecast, useBeaches} from '../utils/forecast-hooks';

function ListForecast({filterListItems, noListItems, noFilteredlistitems}) {
    const listItems = useForecast().filter(filterListItems);
    
    const [hour, setHour] = React.useState(null)

    if (!listItems.length) {
        return (<div>{noListItems}</div>)
    }

    // todo: not sure if this is useful...
    // if (!filteredlistitems.length) {
    //     return (
    //         <div>
    //             {noFilteredlistitems}
    //         </div>
    //     )
    // }

    const forecastList = listItems.reduce((forecastByDay, item) => {
        const date = new Date(item.time);
        const day = new Intl.DateTimeFormat('en-GB', {month: 'numeric', day: 'numeric'}).format(date);
        const time = new Intl.DateTimeFormat('en-GB', {hour: 'numeric'}).format(date);
        forecastByDay[item.time] ? forecastByDay[item.time].forecast.push(...item.forecast) : forecastByDay[item.time] = {forecast: [...item.forecast]};
        forecastByDay[item.time].day = day;
        forecastByDay[item.time].time = time;
        return forecastByDay
    }, {});

    let day = null;
    const timeSelection = Object.keys(forecastList).map(itemHour => {  
        if (!hour) {
            setHour(itemHour)
        }

        if (day !== forecastList[itemHour].day) {
            day = forecastList[itemHour].day;
        } else {
            day = null;
        }

        return (
            <>
                {day && <span>{day}</span>}
                <button key={itemHour} onClick={() => setHour(itemHour)}>{forecastList[itemHour].time}</button>
            </>
        )
    })

    return (       
        <Section>
            { timeSelection }
            <h4>Beaches by rating</h4>
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
                {
                    hour && forecastList && forecastList[hour] && forecastList[hour]?.forecast.length &&
                    forecastList[hour].forecast.map( (beach, i) => (
                        <tr key={`${hour}-${i}`}>
                            <td>{beach.name}</td>
                            <td><Star stars={beach.rating} /></td>
                            <td><Arrow deg={beach.swellDirection}/> {beach.swellHeight}m {beach.swellPeriod}s</td>
                            <td><Arrow deg={beach.waveDirection}/> {beach.waveHeight}m</td>
                            <td><Arrow deg={beach.windDirection}/></td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
        </Section>
    )
}
export {ListForecast}
