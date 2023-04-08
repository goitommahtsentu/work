import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import AgencyCard from './AgencyCard'
import {IoIosArrowBack,IoIosArrowForward} from 'react-icons/io'
export default function OurAgents() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        prevArrow: <IoIosArrowBack to="prev" />,
        nextArrow: <IoIosArrowForward to="next" />,
        slidesToShow: 4,
        slidesToScroll: 1
      };
      return (
        <Slider {...settings}>
           <AgencyCard />
           <AgencyCard />
           <AgencyCard />
           <AgencyCard />
           <AgencyCard />
           <AgencyCard />
           <AgencyCard />
           <AgencyCard />
        </Slider>
      );
}
