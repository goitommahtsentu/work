import React from 'react'
import { FiHome } from 'react-icons/fi'
import {FcTodoList} from 'react-icons/fc'
import './ourservices.css'
import Property from './house.png'
import Rental from './rent.png'

export default function OurServices() {
    return (
        <div>
         <section className="servicesFetaureBlock container">
						<h1 className="fontNeuron blockH text-uppercase"><span className="bdrBottom">OUR</span> <span className="textSecondary">SERVICE</span></h1>
						<ul className="servicesFetauresList list-unstyled text-center">
							<li>
								<a href="#">
									<span className="icnHolder roundedCircle"><FiHome /></span>
									<h2 className="fontNeuron text-capitalize">Saling Service</h2>
								</a>
							</li>
							<li>
								<a href="#">
									<span className="icnHolder roundedCircle">
									<img  src={Rental} style={{height:'1em',width:'1em'}} alt="propery"/>
										</span>
									<h2 className="fontNeuron text-capitalize">Renting Service</h2>
								</a>
							</li>
							<li>
								<a href="#">
									<span className="icnHolder roundedCircle"><FcTodoList /></span>
									<h2 className="fontNeuron text-capitalize">Property Listing</h2>
								</a>
							</li>
							<li>
								<a href="#">
									<span className="icnHolder roundedCircle">
									<img  src={Property} style={{height:'1em',width:'1em'}} alt="propery"/>
									</span>
									<h2 className="fontNeuron text-capitalize">Property Management</h2>
								</a>
							</li>
						</ul>
					</section>   
        </div>
    )
}
