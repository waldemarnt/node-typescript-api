/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'
import React from 'react';

function InfoWindow({title, content, image}) {
  return (
    <div>
      <div className="">
        { image ? (<div className="" title="Contemplative Reptile">
          <img src={image} alt="" />
        </div> ) : null }
        <div>
          <h4>{title}</h4>
          {/* <div css={{textAlign: 'left'}}>
            <span css={{display: 'block'}}><b>Rating: </b>{content.rating}</span>
            <span css={{display: 'block'}}><b>Swell: </b>{content.swell}</span>
            <span css={{display: 'block'}}><b>Wave: </b>{content.wave}</span>
            <span css={{display: 'block'}}><b>Wind: </b>{content.wind}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}


export default InfoWindow;