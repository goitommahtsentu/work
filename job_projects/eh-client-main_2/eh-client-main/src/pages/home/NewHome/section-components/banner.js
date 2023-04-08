import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TrustMap from '../Components/TrustMap';

class Banner extends Component {

    render() {

        let publicUrl = process.env.PUBLIC_URL+'/'
        let imagealt = 'image'

    return    <div className="ltn__slider-area ltn__slider-3 " style={{marginTop: -100}}>
				  <div className="ltn__slide-one-active slick-slide-arrow-1 slick-slide-dots-1">
				    <div className="ltn__slide-item ltn__slide-item-2 ltn__slide-item-3-normal ltn__slide-item-3">
				      <div className="ltn__slide-item-inner">
				        <div className="container">
				          <div className="row">
				            <div className="col-lg-12 align-self-center">
				              <div className="slide-item-info">
				                <div className="slide-item-info-inner ltn__slide-animation">
				                  <div className="slide-video mb-50 d-none">
				                    <a className="ltn__video-icon-2 ltn__video-icon-2-border" href="https://www.youtube.com/embed/tlThdr3O5Qo" data-rel="lightcase:myCollection">
				                      <i className="fa fa-play" />
				                    </a>
				                  </div>
				                  <h6 className="slide-sub-title white-color--- animated"><span><i className="fas fa-home" /></span> EasyHomes</h6>
				                  <h1 className="slide-title animated ">Find Your Dream <br /> House By Us</h1>
				                  <div className="slide-brief animated">
				                    <p>The properties being offered here are Owner Financed on a Contract for Deed
										  with NO Balloon payment and NO prepayment penalty! (Traditional financing and
										  cash buyers are also welcome).</p>
				                  </div>
				                  <div className="btn-wrapper animated ">
				                    	<Link to="/about" className="theme-btn-1 btn btn-effect-1 go-top">Give Us A Call</Link>
				                    <a className="ltn__video-play-btn bg-white" href="https://www.youtube.com/embed/2Ul5D7xVTAA?autoplay=1&showinfo=0" data-rel="lightcase">
				                      <i className="icon-play  ltn__secondary-color" />
				                    </a>
				                  </div>
								</div>
							  </div>
								<div className="slide-item-img slide-img-right" >
									<TrustMap />
				                {/* <img className="shadow-1" style={{  borderRadius: 20, objectFit: "cover"}} src={"https://equityandhelp.com/wp-content/uploads/2022/02/21.png"} alt="#" /> */}
				              </div>
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
				    {/* ltn__slide-item */}
				    <div className="ltn__slide-item ltn__slide-item-2  ltn__slide-item-3-normal ltn__slide-item-3">
				      <div className="ltn__slide-item-inner  text-right text-end">
				        <div className="container">
				          <div className="row">
				            <div className="col-lg-12 align-self-center">
				              <div className="slide-item-info">
				                <div className="slide-item-info-inner ltn__slide-animation">
				                  <h6 className="slide-sub-title white-color--- animated"><span><i className="fas fa-home" /></span> Real Estate Agency</h6>
				                  <h1 className="slide-title animated ">No Banks Involved<br />No Credit Needed</h1>
				                  <div className="slide-brief animated">
									  <p>The properties being offered here are Owner Financed on a Contract for Deed
										  with NO Balloon payment and NO prepayment penalty! (Traditional financing and
										  cash buyers are also welcome).</p>
				                  </div>
				                  <div className="btn-wrapper animated">
				                    <Link to="/service" className="theme-btn-1 btn btn-effect-1">OUR SERVICES</Link>
				                    <Link to="/about" className="btn btn-transparent btn-effect-3">LEARN MORE</Link>
				                  </div>
				                </div>
				              </div>
				              <div className="slide-item-img slide-img-left">
				                <img className="shadow-1" style={{  borderRadius: 50, objectFit: "cover"}} src={"https://equityandhelp.com/wp-content/uploads/2022/02/21.png"} alt="#" />
				              </div>
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
				    {/*  */}
				  </div>
			</div>
        }
}

export default Banner