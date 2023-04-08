import React ,{useEffect,useState}from 'react'
import { useHistory,Link } from 'react-router-dom'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import {GOOGLE_MAP_API_KEY} from '../../../../config/constant'
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

import {Trusts,Addresses,Contacts} from '../../../../services/'
import { connect } from 'react-redux';
import Autocomplete from "react-google-autocomplete";
import { InfoWindow } from "react-google-maps";
import httpService from '../../../../services/httpService'
import {Properties } from '../../../../services'
const Map= compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `75%` ,width:"100%"}} />,
    containerElement: <div style={{ height: `75vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(({addresses,center,zoom,history,isOpen,setIsOpen}) =>
(addresses.length!==0)&&<GoogleMap
    defaultZoom={zoom}
    zoom={zoom}
    zoomOnClick
    defaultCenter={center}
    center={center}
    options= {{
      gestureHandling: 'greedy'
    }}
  >    
  {/* shows the address of trusts */}
  <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={60}
      >
          {addresses.map((address,index)=><Marker onMouseOver={()=>{
            setIsOpen(index)
          }
          } onMouseLeave={()=>setIsOpen(null)} key={index} position={{ lat: parseInt(address.latitude), lng: parseInt(address.longitude) }} >
          {(isOpen==index) && <InfoWindow
          onCloseClick={()=>setIsOpen(null)}
            >
              <div style={{ opacity: 0.75, padding: `12px` }}>
              <div onClick={()=>history.push(`/user/product-details/${address.id}`)}  style={{  fontColor: `#08233B`,cursor:'pointer' }}  href="#properties-id">
                  <h6> {address.street} {address.city},{address.state}</h6>
                </div>
              </div>
            </InfoWindow>}
          </Marker>)}
  </MarkerClusterer>
    </GoogleMap>
)

const TrustMap=(props) =>{
  const [addresses, setAddresses] = useState([])
  const [center, setCenter] = useState({lng:-97.389669,lat:42.950392})
  const [isSelected,setIsSelected]= useState(false)
  const [zoom, setZoom] = useState(4)
  const [isOpen,setIsOpen]= useState(null)
  const history= useHistory()
  useEffect(() => {
    const source=httpService.getSource()
   const getAddresses=async()=>{
        const addressForTrust=await Properties.getProperties()
        setAddresses(addressForTrust)
   }
   getAddresses()
   return () => source.cancel();
  }, [props.trustList])

//   useEffect(() => {
//     if(addresses.length!==0) setCenter({ lat: parseInt(addresses[0].latitude), lng:  parseInt(addresses[0].longitude)})
//    }, [addresses])

  const handlePlaceSelection=(place) => {
    console.log({place})
    const {lat ,lng}=place.geometry.location
    console.log('lat',lat(),'lng',lng())
    setCenter({ lat:lat(), lng:lng()})
    setIsSelected(true)
    setZoom(6)
  }
  return <Map isSelected={isSelected}  setIsOpen={setIsOpen} isOpen={isOpen} history={history} addresses={addresses} handlePlaceSelection={handlePlaceSelection} center={center} zoom={zoom}/>
}


const mapStateToProps = state => ({
  trustList: state.trustReducer.trustList,
  addressList:state.addressReducer.addressList
})

export default connect(mapStateToProps, null)(TrustMap)
