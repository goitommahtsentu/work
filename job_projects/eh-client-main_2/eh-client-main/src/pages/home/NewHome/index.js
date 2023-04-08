import React,{useState,useEffect} from 'react';
import Navbar from './global-components/navbar';
import Banner from './section-components/banner';
import SearchForm from './section-components/search-form';
import Aboutv1 from './section-components/about-v1';
import Counter from './section-components/counter-v1';
import AboutV2 from './section-components/about-v2';
import Featuresv1 from './section-components/features-v1';
import ProSlider from './section-components/product-slider-v1';
import Apartment from './section-components/apartment-v1';
import VideoV1 from './section-components/video-v1';
import Category from './section-components/category-v1';
import Testimonial from './section-components/testimonial-v1';
import BlogSlider from './blog-components/blog-slider-v1';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';
// import './assets/css/plugins.css'

import { Properties } from '../../../services';
// import './assets/css/plugins.css'

const Home_V1 = () => {
    const [propertiesState,setPropertiesState]=useState([])
    useEffect(() => {
        const getProperites=async()=>{
            const data=await Properties.getProperties()
            data&&setPropertiesState(data)
        }
        getProperites()
    }, [])

 

    return <div>

        <Navbar/>
        <Banner />
        <SearchForm propertiesState={propertiesState} />
        {/*<Aboutv1 />*/}
        <Counter />
        {/*<AboutV2 />*/}
       {
           (propertiesState.length!=0)&&<ProSlider properties={propertiesState}   name='Featured Listings'/>

       } 
        <VideoV1 />
        <Testimonial />
        {/*<BlogSlider customClass="section-subtitle-2"/>*/}
        <CallToActionV1 />
        <Footer />
    </div>
}

export default Home_V1

