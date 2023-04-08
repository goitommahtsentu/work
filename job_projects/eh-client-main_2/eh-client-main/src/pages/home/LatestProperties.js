import React from 'react'
import Card from './Card'
export default function LatestProperties() {
    return (
        <div>
       <section className="latestPostsBlock container">
						<header className="row rowHead">
							<div className="col-xs-12 col-sm-5">
								<h1 className="fontNeuron blockH text-uppercase"><span className="bdrBottom">LATEST</span> <span className="textSecondary">PROPERTIES</span></h1>
							</div>
						</header>
						<div className="isoContentHolder" style={{position: "relative", height: "1079.97px"}}>
							<div className="row">
								<div className="col-xs-12 col-sm-6 col-md-4 col isoCol sale" style={{position: "absolute", left:" 0px", top: "0px"}}>
									<Card />
								</div>
                                <div className="col-xs-12 col-sm-6 col-md-4 col isoCol sale" style={{position: "absolute", left:" 389px", top: "0px"}}>
									<Card />
								</div>

                                <div className="col-xs-12 col-sm-6 col-md-4 col isoCol sale" style={{position: "absolute", left:" 779px", top: "0px"}}>
									<Card />
								</div>

                                <div className="col-xs-12 col-sm-6 col-md-4 col isoCol sale" style={{position: "absolute", left:" 0px", top: "539px"}}>
									<Card />
								</div>
                                <div className="col-xs-12 col-sm-6 col-md-4 col isoCol sale" style={{position: "absolute", left:" 389px", top: "539px"}}>
									<Card />
								</div>
                                <div className="col-xs-12 col-sm-6 col-md-4 col isoCol sale" style={{position: "absolute", left:" 779px", top: "539px"}}>
									<Card />
								</div>

							</div>
						</div>
						<div className="row text-center btnHolder">
							<a href="properties-detial.html" className="btn btn-primary btnPrimaryOutline text-capitalize fontNeuron">Show More Property</a>
						</div>
					</section>     
        </div>
    )
}
