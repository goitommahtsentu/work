import React, { Component } from 'react';
import { Link } from 'react-router-dom';
 

class Testimonial extends Component {

    render() {

        let publicUrl = process.env.PUBLIC_URL+'/'
        let imagealt = 'image'

    return <div className="ltn__testimonial-area section-bg-1--- bg-image-top pt-115 pb-70" data-bs-bg={publicUrl+"assets/img/bg/20.jpg"}>
			  <div className="container">
			    <div className="row">
			      <div className="col-lg-12">
			        <div className="section-title-area ltn__section-title-2--- text-center">
			          <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">Our Testimonial</h6>
			          <h1 className="section-title">Clients Feedback</h1>
			        </div>
			      </div>
			    </div>
			    <div className="row ltn__testimonial-slider-5-active slick-arrow-1">
			      <div className="col-lg-4">
			        <div className="ltn__testimonial-item ltn__testimonial-item-7">
			          <div className="ltn__testimoni-info">
			            <p><i className="flaticon-left-quote-1" />
							"I didn't think it was possible to own a home right now... I want to thank you so much! Now
							that I am a homeowner, I'm inspired by the process. I'm interested in getting a real estate
							license myself!"</p>
			            <div className="ltn__testimoni-info-inner">
			              <div className="ltn__testimoni-img">
			                <img src={publicUrl+"assets/img/testimonial/1.jpg"} alt="#" />
			              </div>
			              <div className="ltn__testimoni-name-designation">
			                <h5>The Metcalf couple</h5>
			                <label>EasyHomes Family</label>
			              </div>
			            </div>
			          </div>
			        </div>
			      </div>
			      <div className="col-lg-4">
			        <div className="ltn__testimonial-item ltn__testimonial-item-7">
			          <div className="ltn__testimoni-info">
			            <p><i className="flaticon-left-quote-1" /> 
			              "This house will be as cute as a button after we make repairs...
							We're so happy to have this be our home" </p>
			            <div className="ltn__testimoni-info-inner">
			              <div className="ltn__testimoni-img">
			                <img src={publicUrl+"assets/img/testimonial/2.jpg"} alt="#" />
			              </div>
			              <div className="ltn__testimoni-name-designation">
			                <h5>Martin Harris</h5>
			                <label>EasyHomes Family</label>
			              </div>
			            </div>
			          </div>
			        </div>
			      </div>
			      <div className="col-lg-4">
			        <div className="ltn__testimonial-item ltn__testimonial-item-7">
			          <div className="ltn__testimoni-info">
			            <p><i className="flaticon-left-quote-1" />
							"We had lost our home a few years ago and didn't think we would ever have a home again...
							Thank you so much for giving us hope! We're already mowing the lawn in anticipation of the
							close!" </p>
			            <div className="ltn__testimoni-info-inner">
			              <div className="ltn__testimoni-img">
			                <img src={publicUrl+"assets/img/testimonial/3.jpg"} alt="#" />
			              </div>
			              <div className="ltn__testimoni-name-designation">
			                <h5>The Hogue couple</h5>
			                <label>EasyHomes Family</label>
			              </div>
			            </div>
			          </div>
			        </div>
			      </div>
			      <div className="col-lg-4">
			        <div className="ltn__testimonial-item ltn__testimonial-item-7">
			          <div className="ltn__testimoni-info">
			            <p><i className="flaticon-left-quote-1" /> 
			              You've helped us own a home and achieve so much!</p>
			            <div className="ltn__testimoni-info-inner">
			              <div className="ltn__testimoni-img">
			                <img src={publicUrl+"assets/img/testimonial/4.jpg"} alt="#" />
			              </div>
			              <div className="ltn__testimoni-name-designation">
			                <h5>Bryan Earhart</h5>
			                <label>EasyHomes Family</label>
			              </div>
			            </div>
			          </div>
			        </div>
			      </div>
			      {/*  */}
			    </div>
			  </div>
			</div>

        }
}

export default Testimonial