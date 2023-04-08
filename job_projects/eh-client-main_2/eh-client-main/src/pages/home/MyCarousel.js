import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import {IoRepeat} from 'react-icons/io5'
import {FaShareAlt,FaHeart} from 'react-icons/fa'
const MyCarousel =({lastIndex=3})=> {

    const [isOnSocialMedia,setIsOnSocialMedia]=useState(false);
    const [isHovered, setIsHovered] = useState(false);
    return (
      <>
<Carousel 
  variant="dark" 
  >
  <Carousel.Item >
    <img
      className="d-block w-100"
      src="https://picsum.photos/1920/1080?random=1"
      alt="First slide"
    />
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://picsum.photos/1920/1080?random=2"
      alt="Second slide"
    />
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://picsum.photos/1920/1080?random=1"
      alt="Third slide"
    />
  </Carousel.Item>
</Carousel>
  <div className="carousel-overlay" style={{position:'absolute', top:0,left:0,height:"43%" ,width:"100%",zIndex:4000,
   transition: "all 0.15s ease"
    }}
   >
<div className="overly-icons" style={{
   position:'absolute',
   top:80,
   left:20
}}
onMouseLeave={()=>setIsHovered(false)}
>
{
  isHovered&&<ul className="propery-list-style socialmedia-container" 
        onMouseOver={()=>
          {
            setIsOnSocialMedia(true)
            setIsHovered(true)
        }}
        onMouseLeave={()=>
          {
            setIsOnSocialMedia(false)
            setIsHovered(false)
        }}
  style={{marginLeft:30,padding:10,display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
      <li><a href="#" className="socialmedia-icons-style" style={{paddingLeft:10}}><i className="fab fa-facebook-f"></i></a></li>
      <li><a href="#" className="socialmedia-icons-style" style={{paddingLeft:10}}><i className="fab fa-twitter"></i></a></li>
      <li><a href="#" className="socialmedia-icons-style" style={{paddingLeft:10}}><i className="fab fa-instagram"></i></a></li>
      <li><a href="#" className="socialmedia-icons-style" style={{paddingLeft:10}}><i className="fab fa-google"></i></a></li>
    </ul>
}

</div>
<div className="overly-icons" style={{
   position:'absolute',
   top:120,
   left:10
}}>

<IoRepeat  className="carousel-overlay-buttons-1"  size={40} style={{color:'white'}}  onMouseOver={()=>setIsHovered(false)} />

<FaShareAlt className="carousel-overlay-buttons-2" size={25} style={{color:'white'}} className="share-button-trigger" 
        onMouseOver={()=>setIsHovered(true)}
        // onMouseLeave={()=>setIsHovered(false)}
/>

</div>
</div>
</>
    )
}

export default MyCarousel;