import React from 'react'
import { Link } from 'react-router-dom';
import { currencyFormatterForPublic } from '../../../components/AgGrid/currencyFormatter';
export default function CardElement({property}) {
  return (
    <div>
        			  <div className="col-lg-12 slide-item-visible">
				<div className="ltn__product-item ltn__product-item-4 text-center---">
				  <div className="product-img go-top">
					<Link to={`/user/product-details/${property.id}`}><img src={property.marketing_images.length>0?property.marketing_images[0].photo:"../../../../assets/img/trust-photo-placeholder.jpg"} alt="#" 
					  style={{width:'100%',height:'18rem',objectFit:'fill',objectPosition:'center'}}
					/></Link>
					<div className="product-badge">
					  <ul>
						<li className="sale-badge bg-green">{property.saleBage?property.saleBage:'For Sale'}</li>
					  </ul>
					</div>
					<div className="product-img-location-gallery">
					  <div className="product-img-location">
						<ul>
						  <li>
							<Link to="/contact"><i className="flaticon-pin" /> {property.street} {property.county  } {property.city  } , {property.state  } {property.zipcode  }</Link>
						  </li>
						</ul>
					  </div>
					  <div className="product-img-gallery go-top">
						<ul>
						  <li>
							<Link to={`/user/product-details/${property.id}`}><i className="fas fa-camera" /> 4</Link>
						  </li>
						  <li>
							<Link to={`/user/product-details/${property.id}`}><i className="fas fa-film" /> 2</Link>
						  </li>
						</ul>
					  </div>
					</div>
				  </div>
				  <div className="product-info">
					<div className="product-price">
					  <span>{currencyFormatterForPublic(property.pi_approved_price)}</span>
					</div>
					<h2 className="product-title go-top"><Link to={`/user/product-details/${property.id}`}>{property.name}</Link></h2>
					<div className="product-description">
					  <p>{property.property_description}</p>
					</div>
					<ul className="ltn__list-item-2 ltn__list-item-2-before">
					  <li><span>{property.beds} <i className="flaticon-bed" /></span>
						Bedrooms
					  </li>
					  <li><span>{property.baths} <i className="flaticon-clean" /></span>
						Bathrooms
					  </li>
					  <li><span>{property.square_footage} <i className="flaticon-square-shape-design-interface-tool-symbol" /></span>
						square Ft
					  </li>
					</ul>
				  </div>
				  <div className="product-info-bottom">
					<div className="real-estate-agent">
					  <div className="agent-img go-top">
						<Link to="/team-details"><img src={"/"+"assets/img/blog/author.jpg"} alt="#" /></Link>
					  </div>
					  <div className="agent-brief go-top">
						<h6><Link to="/team-details">{property.agenetName}</Link></h6>
						<small>{property.agentType}</small>
					  </div>
					</div>
					<div className="product-hover-action">
					  <ul>
						<li>
						  <a href="#" title="Quick View" data-bs-toggle="modal" data-bs-target="#quick_view_modal">
							<i className="flaticon-expand" />
						  </a>
						</li>
						<li>
						  <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
							<i className="flaticon-heart-1" /></a>
						</li>
						<li>
							<span className="go-top">
							<Link to={`/user/product-details/${property.id}`} title="Product Details">
								<i className="flaticon-add" />
							</Link>
							</span>
						</li>
					  </ul>
					</div>
				  </div>
				</div>
			  </div>
    </div>
  )
}
