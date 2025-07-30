import React from 'react';
import './homebanner.css';

const HomeBanner = () => {
  return (
    <div className="hero">
      <div className="hero-left">
  
        <div>
          <div className="hero-hand-icon">
            <p className='new'>New</p>
            <img src="/uploads/hand-holding-heart-solid.svg" alt="Hand Icon" />
          </div>
        <div className="ledft">
            <p id='collection'>Collections</p>
          <p className='every'>For Everyone</p>
        </div>
        </div>
        <div className="hero-latest-btn">
          <div>Latest Collection</div>
          <img src="/uploads/pexels-mariannaole-757889.jpg" alt="" />
        </div>
      </div>
      <div className="hero-right">
        <img src="/uploads/homebannerimage.jpg" alt="Hero" />
      </div>
    </div>
  );
};

export default HomeBanner;
