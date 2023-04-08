import React,{useState} from 'react'

export default function OtherFeaturies() {
    const [clicked,setClicked]=useState(false)
    return (
        <div className="row orderRow"> 
        <div onClick={()=>setClicked(prev=>!prev)} className="col-xs-12 col-sm-3 order1">
        <a className="btnPlus otherFeaturesOpener text-capitalize collapsed" role="button" data-toggle="collapse" href="#otherFeaturescollapse" aria-expanded="false" aria-controls="otherFeaturescollapse">
										{!clicked?<i className="fas btnIcn fa-plus-circle text-info opener"></i>:
										<i className="fas fa-minus-circle closer btnIcn text-info"></i>
                                        }
										Others Features
									</a>
								</div>
		<div className="col-xs-12 order3">
									<div className={`otherFeaturesCollapse collapse ${clicked?'in':''}`} id="otherFeaturescollapse" aria-expanded="false" style={clicked?{}:{height: "0px"}}>
										<ul className="list-unstyled checkList text-primary">
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Air conditioning</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Cofee pot</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Fan</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Hi-fi</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Balcony</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Computer</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Fridge</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Internet</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Bedding</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Cot</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Grill</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Iron</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Cable TV</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Dishwasher</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Hairdryer</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Juicer</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Cleaning after exit</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">DVD</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Heating</span>
												</label>
											</li>
											<li>
												<label className="fwNormal customLabelCheck">
													<input onChange={()=>console.log('hell0')} type="checkbox" className="customFormInputReset" />
													<span className="fakeCheckbox"></span>
													<span className="fakeLabel">Lift</span>
												</label>
											</li>
										</ul>
			</div>
        </div>
        <div className="col-xs-12 col-sm-offset-6 col-sm-3 order2">
									<button type="button" className="btn btnSecondary text-uppercase fontNeuron pull-right">SEARCH</button>
								</div>
        </div>

    )
}
