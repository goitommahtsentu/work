import React, { useEffect,useRef,useState } from 'react';

const ProductSliderV1=(props)=> {
	const ref=useRef(false)
    const CarousalSlide=()=>{
     const SlideElement=(
		 <>
		 <div className="row   ltned__image-slider-5-active slick-arrow-1 slick-arrow-1-inner  ltn__no-gutter-all">
					{props.images.map((image,index)=><div className="col-lg-12" key={index}>
						<div className="ltned__img-slide-item-4">
							<a href={image.photo} data-rel="lightcase:myCollection">
							<img src={image.photo} alt="Image" 
							style={{width:'100%',height:'100%',objectFit:'fill',objectPosition:'center'}}
							/>
							</a>
						</div>
						</div>	
					)}
					</div>
					<span ref={(props.images.length!=0)?ref:null} />
		 </>
	 )
	 return SlideElement
	}
	useEffect(()=>{
	    if(ref.current) {
		if(ref.current=='second') return
		 console.log('second',ref.current)
		 const $ = window.$;    	
		 let publicUrl = process.env.PUBLIC_URL+'/'
		 const minscript = document.createElement("script");
		 minscript.async = true;
		 minscript.src = publicUrl + "assets/js/main.js";
		//  document.body.appendChild(minscript);
$('.ltned__image-slider-5-active').slick({
			 rtl: false,
			 arrows: true,
			 dots: false,
			 infinite: true,
			 speed: 300,
			 slidesToShow: 1,
			 slidesToScroll: 1,
			 centerMode: true,
			 centerPadding: '450px',
			 prevArrow: '<a class="slick-prev"><i class="fas fa-arrow-left" alt="Arrow Icon"></i></a>',
			 nextArrow: '<a class="slick-next"><i class="fas fa-arrow-right" alt="Arrow Icon"></i></a>',
			 responsive: [
				 {
					 breakpoint: 1600,
					 settings: {
						 slidesToShow: 1,
						 slidesToScroll: 1,
						 centerMode: true,
						 centerPadding: '250px',
					 }
				 },
				 {
					breakpoint: 1700,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						centerMode: true,
						centerPadding: '250px',
					}
				},
				 {
					 breakpoint: 1200,
					 settings: {
						 slidesToShow: 1,
						 slidesToScroll: 1,
						 centerMode: true,
						 centerPadding: '200px',
					 }
				 },
				 {
					 breakpoint: 992,
					 settings: {
						 arrows: false,
						 dots: true,
						 slidesToShow: 1,
						 slidesToScroll: 1,
						 centerMode: true,
						 centerPadding: '150px',
					 }
				 },
				 {
					 breakpoint: 768,
					 settings: {
						 arrows: false,
						 dots: true,
						 slidesToShow: 1,
						 slidesToScroll: 1,
						 centerMode: false,
						 centerPadding: '0px',
					 }
				 },
				 {
					 breakpoint: 580,
					 settings: {
						 arrows: false,
						 dots: true,
						 slidesToShow: 1,
						 slidesToScroll: 1,
						 centerMode: false,
						 centerPadding: '0px',
					 }
				 }
			 ]
		 })
			ref.current='second'
		}
    
	},[ref.current])

	  return (<div>
				{props.images.length!=0?(
					<>
					<div className="mb-90 ltn__img-slider-area ">
				<div className="container-fluid">
					{
						CarousalSlide()
					}
					</div>
					</div>
					</>
				):(<div>Loading...</div>
					)
					}
	 </div> 
	  );
        }

export default ProductSliderV1