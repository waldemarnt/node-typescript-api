import React from 'react';

function InfoWindow({title, content, image}) {
  return (
    <div>
      <div className="">
        { image ? (<div className="" title="Contemplative Reptile">
          <img src={image} alt="" />
        </div> ) : null }
        <div>
          <div>
            {title}
          </div>
          <div>
            {content}
          </div>
        </div>
        <div>
          <button>
            Share
          </button>
          <button>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}


export default InfoWindow;