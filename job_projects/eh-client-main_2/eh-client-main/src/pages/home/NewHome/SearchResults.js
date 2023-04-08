import React,{useEffect,useState} from 'react'
import { Properties } from '../../../services';
import ProSlider from './section-components/product-slider-v1';
import Navbar from './global-components/navbar';
import CardElement from   './CardElement'

export default function SearchResults(props) {
  const search= new URLSearchParams(props.location?.search)
  const [filterBy,setFilterBy]=useState({
    min:parseInt(search.get('min')),
    max:parseInt(search.get('max')),
    city:search.get('city'),
    state:search.get('state')
  })
  const [propertiesState,setPropertiesState]=useState([])
  const filterFun=(property,filterBy)=>{
     if(!filterBy.city &&filterBy.state&&filterBy.max) return property.state==filterBy.state && property.pi_approved_price >=filterBy.min && property.pi_approved_price <=filterBy.max
     else if(filterBy.city &&!filterBy.state&&filterBy.max)  return property.city==filterBy.city && property.pi_approved_price >=filterBy.min && property.pi_approved_price <=filterBy.max
     else if(filterBy.city &&filterBy.state&&!filterBy.max) return property.state==filterBy.state && property.pi_approved_price >=filterBy.min
     else return property.city==filterBy.city && property.state==filterBy.state && property.pi_approved_price >=filterBy.min && property.pi_approved_price <=filterBy.max

    }
  useEffect(() => {
      const getProperites=async()=>{
          const data=await Properties.getProperties()
          data&&setPropertiesState(data.filter((property)=>filterFun(property,filterBy)))
      }
      getProperites()
  }, [])

  return (
    <div> 
              <Navbar/>
              <h1 style={{textAlign:'center'}}> Search Results</h1>
          <div style={{display:'flex'}}>
       {
        (propertiesState.length!=0)&&propertiesState.map((property,index)=>(
              <CardElement property={property} key={index} />
        ))
     }
          </div>
 
  </div>
  )
}
