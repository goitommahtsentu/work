import React from 'react'
import './findhome.css'
import SelectComponent from './SelectComponent'
import OtherFeaturies from './OtherFeaturies'
export default function FindHome() {
    return (
            <form action="#" className="bgWhite findFormBlock hasShadow">
						<div className="container">
							<h2 className="fontNeuron">FIND YOUR <span className="text-info">HOME</span></h2>
							<hr className="sep elemenBlock" />
							<div className="row">
								<div className="col-xs-12 col-sm-6 col-md-3">
									<div className="form-group">
										<input type="text" style={{backgroundColor:'white',height:'50px'}} className="form-control elemenBlock" placeholder="Enter Your Keyword…" />
									</div>
								</div>
								<div className="col-xs-12 col-sm-6 col-md-3">
									<div className="form-group">
										<input type="text" style={{backgroundColor:'white',height:'50px'}} className="form-control elemenBlock" placeholder="Location" />
									</div>
								</div>
								<div className="col-xs-12 col-sm-6 col-md-3">
                                <SelectComponent options={['For Rent','For Sell','House','Property','Real Estate']} />
								</div>
								<div className="col-xs-12 col-sm-6 col-md-3">
									<div className="form-group">
										<div className="price-wrapper">Price Range: From <b className="startValue">$500</b> to <b className="endValue">$500,000</b></div>
										<div className="slider slider-horizontal" id=""><div className="slider-track"><div className="slider-track-low" style={{left: "0px", width: "19.9199%"}}></div><div className="slider-selection" style={{left:" 19.9199%", width: "60.0601%"}}></div><div className="slider-track-high" style={{right: "0px", width:" 20.02%"}}></div></div><div className="tooltip tooltip-main top" role="presentation" style={{left: "49.9499%"}}><div className="tooltip-arrow"></div><div className="tooltip-inner">100000 : 400000</div></div><div className="tooltip tooltip-min top" role="presentation" style={{left: "19.9199%", display: "none"}}><div className="tooltip-arrow"></div><div className="tooltip-inner">100000</div></div><div className="tooltip tooltip-max top" role="presentation" style={{left: "79.98%", display: "none"}}><div className="tooltip-arrow"></div><div className="tooltip-inner">400000</div></div><div className="slider-handle min-slider-handle round" role="slider" aria-valuemin="500" aria-valuemax="500000" aria-valuenow="100000" tabIndex="0" style={{left: "19.9199%"}}></div><div className="slider-handle max-slider-handle round" role="slider" aria-valuemin="500" aria-valuemax="500000" aria-valuenow="400000" tabIndex="0" style={{left: "79.98%"}}></div></div><input onChange={()=>console.log('hell0')} id="price-range" type="text" className="span2" value="100000,400000" data-slider-min="500" data-slider-max="500000" data-slider-step="10" data-slider-value="[100000,400000]" data-value="100000,400000" style={{display: "none"}} />
									</div>
								</div>
								<div className="col-xs-12 col-sm-6 col-md-3">
									<div className="row">
										<div className="col-xs-6">
                                        <SelectComponent options={['Beds 1','Beds 2','Beds 3','Beds 4','Beds 5']}  width="116px"/>
                                    	</div>
										<div className="col-xs-6">
                                        <SelectComponent options={['Baths 1','Baths 2','Baths 3','Baths 4','Baths 5']} width="116px" />
                                  </div>
									</div>
								</div>
								<div className="col-xs-12 col-sm-6 col-md-3">
									<div className="form-group">
										<input onChange={()=>console.log('hell0')} style={{backgroundColor:'white',height:'50px'}} type="text" className="form-control elemenBlock" placeholder="Area Min... (Sq Ft)" />
									</div>
								</div>
								<div className="col-xs-12 col-sm-6 col-md-3">
                               <SelectComponent options={['Parking 1','Parking 2','Parking 3','Parking 4','Parking 5']} />
							</div>
                            </div>
							<OtherFeaturies />
							
						</div>
					</form>
    )
}
