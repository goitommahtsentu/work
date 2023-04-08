import React, { Component } from 'react';
import { Link } from 'react-router-dom';
 

class CounterV1 extends Component {

    render() {

        let publicUrl = process.env.PUBLIC_URL+'/'

    return <div className="ltn__counterup-area section-bg-1 pt-120 pb-70">
			  <div className="container">
			    <div className="row">
			      <div className="col-md-3 col-sm-6 align-self-center">
			        <div className="ltn__counterup-item text-color-white---">
			          <div className="counter-icon">
			            <i className="flaticon-buy-home" />
			          </div>
			          <h1><span className="counter">500</span><span className="counterUp-icon">+</span> </h1>
			          <h6>Families Helped</h6>
			        </div>
			      </div>
			      <div className="col-md-3 col-sm-6 align-self-center">
			        <div className="ltn__counterup-item text-color-white---">
			          <div className="counter-icon">
			            <i className="flaticon-house" />
			          </div>
			          <h1><span className="counter">50</span><span className="counterUp-icon">+</span> </h1>
			          <h6>Current Listings</h6>
			        </div>
			      </div>
			      <div className="col-md-3 col-sm-6 align-self-center">
			        <div className="ltn__counterup-item text-color-white---">
			          <div className="counter-icon">
			            <i className="flaticon-building" />
			          </div>
			          <h1><span className="counter">268</span><span className="counterUp-icon">+</span> </h1>
			          <h6>Cities</h6>
			        </div>
			      </div>
			      <div className="col-md-3 col-sm-6 align-self-center">
			        <div className="ltn__counterup-item text-color-white---">
			          <div className="counter-icon">
			            <i className="flaticon-maps-and-location" />
			          </div>
			          <h1><span className="counter">24</span><span className="counterUp-icon">+</span> </h1>
			          <h6>States</h6>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
        }
}

export default CounterV1