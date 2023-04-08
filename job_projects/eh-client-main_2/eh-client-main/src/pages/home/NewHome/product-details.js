import React,{useState,useEffect} from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import ProductSlider from './shop-components/product-slider-v1';
import ProductDetails from './shop-components/shop-details';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';
import { Properties } from '../../../services';

const Product_Details = (props) => {
    const [property,setProperty]=useState({})
	useEffect(() => {
	if(!props.match.params.id) return
	const getProperty=async()=>{
		const data=await Properties.getProperty(props.match.params.id)
    	data&&setProperty(data)
	}
    getProperty()
	}, [props.match.params.id])

    return <div>
        <Navbar />
        <PageHeader headertitle="Product Details" customclass="mb-0" />
{        property.marketing_images&&property.marketing_images.length!=0&&<ProductSlider images={property.marketing_images?property.marketing_images:[]}/>}
        <ProductDetails property={property} />
        <CallToActionV1 />
        <Footer />
    </div>
}

export default Product_Details

