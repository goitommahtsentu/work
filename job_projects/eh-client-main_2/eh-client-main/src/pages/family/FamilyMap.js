import React ,{useEffect,useState}from 'react'
import { useHistory,Link } from 'react-router-dom'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import {GOOGLE_MAP_API_KEY} from '../../config/constant'
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

import {Trusts,Addresses,Contacts} from '../../services'
import { connect } from 'react-redux';
import Autocomplete from "react-google-autocomplete";
import { InfoWindow } from "react-google-maps";
import httpService from '../../services/httpService'
const Map= compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `75%` ,width:"100%"}} />,
    containerElement: <div style={{ height: `75vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(({addresses,isSelected,handlePlaceSelection,center,zoom,history,isOpen,setIsOpen,setIsOpenContact,isOpenContact}) =>
( addresses.length!==0)&&<GoogleMap
    defaultZoom={zoom}
    zoom={zoom}
    zoomOnClick
    defaultCenter={center}
    center={center}
    options= {{
      gestureHandling: 'greedy'
    }}
  >
    {/* search for places and show the results on the map */}
      <div style={{marginLeft:100, padding:20}}>
                        <Autocomplete
                        style={{
                            padding:10,
                            width: "60%",
                            margin:'20 15',
                            position:'absolute',
                            top:0,
                            left:30
                        }}
                        apiKey={GOOGLE_MAP_API_KEY}
                        onPlaceSelected={handlePlaceSelection}
                        options={{
                            types: ["geocode", "establishment"]
                         }}
                        />

                </div>

                {/* this marks the result of the search */}
        {
          isSelected&&<Marker  icon= {{url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",  scaledSize: new window.google.maps.Size(50, 50),  
         origin: new window.google.maps.Point(0,0),
         anchor: new window.google.maps.Point(0, 0)}} position={{ lat:center.lat, lng: center.lng }} />
        }
       
  {/* shows the address of trusts */}
  <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={60}
      >
          {addresses.map((address,index)=><Marker onMouseOver={()=>{
            setIsOpen(index)
            setIsOpenContact(null)
          }
          } onMouseLeave={()=>setIsOpen(null)} key={index} position={{ lat: address.latitude, lng: address.longitude }} >
          {(isOpen==index) && <InfoWindow
          onCloseClick={()=>setIsOpen(null)}
            >
              <div style={{ opacity: 0.75, padding: `8px` }}>
                    <div style={{ fontColor: `#08233B` }}  onClick={()=>history.push(`/family/${address.id}`)}>
                    <h3>{address.full_name}</h3>
                    <h6>{address.text_phone}</h6>
                    <h6>{address.primary_email}</h6>
                    <p> {address.full_address}</p>
                    </div>
                  </div>
            </InfoWindow>}
          </Marker>)}
  </MarkerClusterer>
    </GoogleMap>
)

const TrustMap=(props) =>{
  const [addressForContactState, setAddressForContact] = useState([])
  const [addresses, setAddresses] = useState([])
  const [center, setCenter] = useState({lat:0,lng:0})
  const [isSelected,setIsSelected]= useState(false)
  const [zoom, setZoom] = useState(4)
  const [isOpen,setIsOpen]= useState(null)
  const [isOpenContact,setIsOpenContact]= useState(null)
  const history= useHistory()
  useEffect(() => {
    const source=httpService.getSource()
   const getAddresses=async()=>{
       const addressesData=Object.values(props.addressList)
        const trustsData=Object.values(props.familyList)
         const addressForFamily=trustsData.reduce((results,trust)=>{
        const trustAddress= addressesData&&addressesData.find(address=>trust.address_id==address.id)
          if(trustAddress){
            console.log(trustAddress)
           results.push({
             ...trust,
             latitude:trustAddress.latitude,
             longitude:trustAddress.longitude
            })
          }
          return results
          
        },[])        
        setAddresses(addressForFamily)
   }
   getAddresses()
   return () => source.cancel();
  }, [props.familyList])

  useEffect(() => {
    if(addresses.length!==0) setCenter({ lat: addresses[0].latitude, lng:  addresses[0].longitude})
   }, [addresses])

  const handlePlaceSelection=(place) => {
    console.log({place})
    const {lat ,lng}=place.geometry.location
    console.log('lat',lat(),'lng',lng())
    setCenter({ lat:lat(), lng:lng()})
    setIsSelected(true)
    setZoom(6)
  }
  console.log(addresses,addressForContactState)
  return <Map isSelected={isSelected} setIsOpenContact={setIsOpenContact} isOpenContact={isOpenContact}  setIsOpen={setIsOpen} isOpen={isOpen} history={history} addresses={addresses} handlePlaceSelection={handlePlaceSelection} center={center} zoom={zoom}/>
}


const mapStateToProps = state => ({
  familyList: state.familyReducer.familyList,
  addressList:state.addressReducer.addressList
})

export default connect(mapStateToProps, null)(TrustMap)
