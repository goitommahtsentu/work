import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import MultiRangeSlider from "multi-range-slider-react";


function SearchForm({propertiesState}){
	const [selected,setSelected]=useState({
		city:'',
		state:'',
		min:10000,
		max:100000
	})

	const [state,setState]=useState([])
	const [city,setCity]=useState([])
	 useEffect(() => {
		 if(propertiesState.length==0) return
		 const tmpState=Array.from(new Set(propertiesState.map(st=>st.state))).filter(i=>i)
		 setState(tmpState)
		 setSelected({...selected,state:tmpState[0]})
		 const cityTmp={}
		 propertiesState.forEach(element => {
			 if(cityTmp[element.state]){
				 cityTmp[element.state].push(element.city)
			 }else{
				 cityTmp[element.state]=[element.city]
			 }
		 });
	   setCity(cityTmp)
	 }, [propertiesState])

	const [minValue, set_minValue] = useState(10000);
	const [maxValue, set_maxValue] = useState(100000);
	const handleInput = (e) => {
		set_minValue(e.minValue);
		set_maxValue(e.maxValue);
	};

const [selection,setSelection]=useState('')



const handleChage=(e)=>{
		const {name,value}=e.target
		setSelected({...selected,[name]:value})
	}

  return <div className="ltn__car-dealer-form-area mt--65 mt-120 pb-115---">
			  <div className="container">
			    <div className="row">
			      <div className="col-lg-12">
			        <div className="ltn__car-dealer-form-tab">
			          <div className="ltn__tab-menu  text-uppercase d-none">
			            <div className="nav">
			              <a className="active show" data-bs-toggle="tab" href="#ltn__form_tab_1_1"><i className="fas fa-car" />Find A Car</a>
			              <a data-bs-toggle="tab" href="#ltn__form_tab_1_2" ><i className="far fa-user" />Get a Dealer</a>
			            </div>
			          </div>
			          <div className="tab-content bg-white box-shadow-1 position-relative pb-10">
			            <div className="tab-pane fade active show" id="ltn__form_tab_1_1">
			              <div className="car-dealer-form-inner">
			                <form action="#" className="ltn__car-dealer-form-box row">
			                  <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
			                    <select className="nice-select" name='state'   style={{display:'inline-block !important'}} onChange={handleChage}>
									{
									state?.map(st=>(<option value={st}>{st}</option>))	

									}
			                    </select>
			                  </div> 
			                  <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
			                    <select className="nice-select" name='city'  onChange={handleChage}>
								{
									city[selected.state?selected.state:state[0]]?.map(st=>(<option value={st}>{st}</option>))	
									
								}
								<option value=''>-----------------</option>
			                    </select>
			                  </div> 
			                  <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-calendar---- col-lg-3 col-md-6">
							  <MultiRangeSlider
									min={10000}
									max={100000}
									step={1000}
									label={true}
									preventWheel={false}
									minValue={minValue}
									maxValue={maxValue}
									onInput={(e) => {
										handleInput(e);
									}}
									ruler={false}
									
								/>
			                  </div>
			                  <div className="ltn__car-dealer-form-item ltn__custom-icon ltn__icon-calendar col-lg-3 col-md-6">
			                    <div className="btn-wrapper text-center mt-0 go-top">
			                      {/* <button type="submit" class="btn theme-btn-1 btn-effect-1 text-uppercase">Search Inventory</button> */}
			                      <Link to={`/user/search-result/?city=${selected.city}&state=${selected.state}&min=${minValue}&max=${maxValue}`} className="btn theme-btn-1 btn-effect-1 text-uppercase">Find Now</Link>
			                    </div>
			                  </div>
			                </form>
			              </div>
			            </div>
			            <div className="tab-pane fade" id="ltn__form_tab_1_2">
			              <div className="car-dealer-form-inner">
			                <form action="#" className="ltn__car-dealer-form-box row">
			                  <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
			                    <select className="nice-select">
			                      <option>Choose Area</option>
			                      <option>chicago</option>
			                      <option>London</option>
			                      <option>Los Angeles</option>
			                      <option>New York</option>
			                      <option>New Jersey</option>
			                    </select>
			                  </div> 
			                  <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
			                    <select className="nice-select">
			                      <option>Property Status</option>
			                      <option>Open house</option>
			                      <option>Rent</option>
			                      <option>Sale</option>
			                      <option>Sold</option>
			                    </select>
			                  </div> 
			                  <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-calendar---- col-lg-3 col-md-6">
			                    <select className="nice-select">
			                      <option>Property Type</option>
			                      <option>Apartment</option>
			                      <option>Co-op</option>
			                      <option>Condo</option>
			                      <option>Single Family Home</option>
			                    </select>
			                  </div>
			                  <div className="ltn__car-dealer-form-item ltn__custom-icon ltn__icon-calendar col-lg-3 col-md-6">
			                    <div className="btn-wrapper text-center mt-0 go-top">
			                      {/* <button type="submit" class="btn theme-btn-1 btn-effect-1 text-uppercase">Search Inventory</button> */}
			                      <Link to="/user/search-result/home" className="btn theme-btn-1 btn-effect-1 text-uppercase">Search Properties</Link>
			                    </div>
			                  </div>
			                </form>
			              </div>
			            </div>
			          </div>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
        }

export default SearchForm