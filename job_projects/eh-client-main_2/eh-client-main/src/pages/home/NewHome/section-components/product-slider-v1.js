import React, { useEffect,useRef,useState } from 'react';
import { Link } from 'react-router-dom';
import CardElement from '../CardElement';
export default function ProductSliderV1 ({properties,name}) {   
	console.log(properties) 
   const ref=useRef(false)
   const getSlide=()=>{
	   const SlideElement=(
		   <>
		<div  className="row ltnde__product-slider-item-four-active-full-width slick-arrow-1 " id="customslide" >
		{/* ltn__product-item */}
		{
			 properties.map((property,index)=>(
             <CardElement property={property} key={index} />
			 ))
		}
		</div>
				<span ref={(properties.length!=0)?ref:null} />
				</>
	   )
	   return SlideElement
   }

   useEffect(()=>{
	   console.log({refValue:ref.current})
	if(ref.current) {
		console.log('first',ref.current)
	 if(ref.current=='second') return
	 console.log('second',ref.current)
	 const $ = window.$;    	
	 let publicUrl = process.env.PUBLIC_URL+'/'
	 const minscript = document.createElement("script");
	 minscript.async = true;
	 minscript.src = publicUrl + "assets/js/main.js";
	//  document.body.appendChild(minscript);
	 $('.ltnde__product-slider-item-four-active-full-width').slick({
		arrows: true,
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 4,
		slidesToScroll: 1,
		prevArrow: '<a class="slick-prev"><i class="fas fa-arrow-left" alt="Arrow Icon"></i></a>',
		nextArrow: '<a class="slick-next"><i class="fas fa-arrow-right" alt="Arrow Icon"></i></a>',
		responsive: [
			{
				breakpoint: 1800,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 1400,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 992,
				settings: {
					arrows: false,
					dots: true,
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 768,
				settings: {
					arrows: false,
					dots: true,
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 575,
				settings: {
					arrows: false,
					dots: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});
		ref.current='second'
	}

},[ref.current])

	
	return <div id="properties-id">
	
			<div className="pt-115 pb-90 plr--7 ltn__product-slider-area  ltn__product-gutter" id='parent1'>
			  <div className="container-fluid">
			    <div className="row ">
			      <div className="col-lg-12">
			        <div className="section-title-area ltn__section-title-2--- text-center">
			          <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">Properties</h6>
			          <h1 className="section-title">{name}</h1>
			        </div>
			      </div>
			    </div>
			    {
                   getSlide()
				}
				  </div>
				  </div>

			<div className="ltn__modal-area ltn__add-to-cart-modal-area">
				<div className="modal fade" id="liton_wishlist_modal" tabIndex={-1}>
					<div className="modal-dialog modal-md" role="document">
					<div className="modal-content">
						<div className="modal-header">
						<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
						</div>
						<div className="modal-body">
						<div className="ltn__quick-view-modal-inner">
							<div className="modal-product-item">
							<div className="row">
								<div className="col-12">
								<div className="modal-product-img">
									<img src={"/"+"assets/img/product/7.png"} alt="#" />
								</div>
								<div className="modal-product-info go-top">
									<h5><Link to={`/user/product-details/`}>Brake Conversion Kit</Link></h5>
									<p className="added-cart"><i className="fa fa-check-circle" />  Successfully added to your Wishlist</p>
									<div className="btn-wrapper">
									<Link to="/wishlist" className="theme-btn-1 btn btn-effect-1">View Wishlist</Link>
									</div>
								</div>
								{/* additional-info */}
								<div className="additional-info d-none">
									<p>We want to give you <b>10% discount</b> for your first order, <br />  Use discount code at checkout</p>
									<div className="payment-method">
									<img src={"/"+"assets/img/icons/payment.png"} alt="#" />
									</div>
								</div>
								</div>
							</div>
							</div>
						</div>
						</div>
					</div>
					</div>
				</div>
			</div>

			<div className="ltn__modal-area ltn__quick-view-modal-area">
				<div className="modal fade" id="quick_view_modal" tabIndex={-1}>
					<div className="modal-dialog modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
						<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
							{/* <i class="fas fa-times"></i> */}
						</button>
						</div>
						<div className="modal-body">
						<div className="ltn__quick-view-modal-inner">
							<div className="modal-product-item">
							<div className="row">
								<div className="col-lg-6 col-12">
								<div className="modal-product-img">
									<img src={"/"+"assets/img/product/4.png"} alt="#" />
								</div>
								</div>
								<div className="col-lg-6 col-12">
								<div className="modal-product-info">
									<div className="product-ratting">
									<ul>
										<li><a href="#"><i className="fas fa-star" /></a></li>
										<li><a href="#"><i className="fas fa-star" /></a></li>
										<li><a href="#"><i className="fas fa-star" /></a></li>
										<li><a href="#"><i className="fas fa-star-half-alt" /></a></li>
										<li><a href="#"><i className="far fa-star" /></a></li>
										<li className="review-total"> <a href="#"> ( 95 Reviews )</a></li>
									</ul>
									</div>
									<h3>Brake Conversion Kit</h3>
									<div className="product-price">
									<span>$149.00</span>
									<del>$165.00</del>
									</div>
									<div className="modal-product-meta ltn__product-details-menu-1">
									<ul>
										<li>
										<strong>Categories:</strong> 
										<span className="go-top">
											<Link to="/blog">Parts</Link>
											<Link to="/blog">Car</Link>
											<Link to="/blog">Seat</Link>
											<Link to="/blog">Cover</Link>
										</span>
										</li>
									</ul>
									</div>
									<div className="ltn__product-details-menu-2">
									<ul>
										<li>
										<div className="cart-plus-minus">
											<input type="text" defaultValue="02" name="qtybutton" className="cart-plus-minus-box" />
										</div>
										</li>
										<li>
										<a href="#" className="theme-btn-1 btn btn-effect-1" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
											<i className="fas fa-shopping-cart" />
											<span>ADD TO CART</span>
										</a>
										</li>
									</ul>
									</div>
									<hr />
									<div className="ltn__social-media">
									<ul>
										<li>Share:</li>
										<li><a href="#" title="Facebook"><i className="fab fa-facebook-f" /></a></li>
										<li><a href="#" title="Twitter"><i className="fab fa-twitter" /></a></li>
										<li><a href="#" title="Linkedin"><i className="fab fa-linkedin" /></a></li>
										<li><a href="#" title="Instagram"><i className="fab fa-instagram" /></a></li>
									</ul>
									</div>
								</div>
								</div>
							</div>
							</div>
						</div>
						</div>
					</div>
					</div>
				</div>
			</div>

			<div className="ltn__modal-area ltn__add-to-cart-modal-area">
				<div className="modal fade" id="add_to_cart_modal" tabIndex={-1}>
					<div className="modal-dialog modal-md" role="document">
					<div className="modal-content">
						<div className="modal-header">
						<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
						</div>
						<div className="modal-body">
						<div className="ltn__quick-view-modal-inner">
							<div className="modal-product-item">
							<div className="row">
								<div className="col-12">
								<div className="modal-product-img">
									<img src={"/"+"assets/img/product/1.png"} alt="#" />
								</div>
								<div className="modal-product-info go-top">
									<h5 className="go-top"><Link to={`/user/product-details/`}>Brake Conversion Kit</Link></h5>
									<p className="added-cart"><i className="fa fa-check-circle" />Successfully added to your Cart</p>
									<div className="btn-wrapper">
									<Link to="/cart" className="theme-btn-1 btn btn-effect-1">View Cart</Link>
									<Link to="/checkout" className="theme-btn-2 btn btn-effect-2">Checkout</Link>
									</div>
								</div>
								{/* additional-info */}
								<div className="additional-info d-none">
									<p>We want to give you <b>10% discount</b> for your first order, <br />  Use discount code at checkout</p>
									<div className="payment-method">
									<img src={"/"+"assets/img/icons/payment.png"} alt="#" />
									</div>
								</div>
								</div>
							</div>
							</div>
						</div>
						</div>
					</div>
					</div>
				</div>
			</div>
		   </div>
        }
