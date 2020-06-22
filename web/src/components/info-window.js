/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';

function InfoWindow({ title, content, image }) {
  return (
    <div>
      <div className="">
        {image ? (
          <div className="" title="Contemplative Reptile">
            <img src={image} alt="" />
          </div>
        ) : null}
        <div>
          <h4>{title}</h4>
        </div>
      </div>
    </div>
  );
}

export default InfoWindow;
