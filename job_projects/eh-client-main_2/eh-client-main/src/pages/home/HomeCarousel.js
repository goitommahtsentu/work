import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import './carousel.css'
const MyCarousel =()=> {
    return (
<Carousel 

  variant="dark" 
  style={{
      height:400,
      width:'100vw',
      backgroundImage:'url(https://media.istockphoto.com/photos/businessman-using-a-computer-for-property-sales-listings-realtor-picture-id1335050734)',
      display:'flex',
      alignItems:'center',
  }}
  fade
  className="homecarousel"
  >
  <Carousel.Item 
  >
      <div className="introSlideCaption" style={{marginLeft:'200px'}}>
											<h1 class="text-uppercase fontNeuron">Latest Family Home</h1>
											<div class="introSlideCaptionHolder">
												<address class="text-primary">
													<span class="icn"><i class="fi flaticon-pin-1"></i></span>
													<p>PO Box 16122 Collins Street West Victoria 8007 Australia</p>
												</address>
												<h2 class="fontNeuron">$ 390,000 <strong class="fwNormal textUnit">/ monthly</strong></h2>
												<div class="btnsWrap">
													<a href="#" class="btn btn-success btnSmall" tabindex="0">For Sale</a>
													<a href="#" class="btn btn-info btnSmall" tabindex="0">Featured</a>
												</div>
											</div>
										
    </div>
  </Carousel.Item>
  <Carousel.Item 
  >
       <div className="introSlideCaption" style={{marginLeft:'200px'}}>
        <h1 className="text-uppercase fontNeuron">Mordern Family Home 3</h1>
        <div className="introSlideCaptionHolder">
            <address className="text-primary">
                <span className="icn"><i className="fi flaticon-pin-1"></i></span>
                <p>PO Box 16122 Collins Street West Victoria 8007 Australia</p>
            </address>
            <h2 className="fontNeuron">$ 490,000 <strong className="fwNormal textUnit">/ monthly</strong></h2>
            <div className="btnsWrap">
                <a href="#" className="btn btn-success btnSmall" tabindex="0">For Sale</a>
                <a href="#" className="btn btn-info btnSmall" tabindex="0">Featured</a>
            </div>
        </div>
    </div>
  </Carousel.Item>
</Carousel>
    )
}

export default MyCarousel;