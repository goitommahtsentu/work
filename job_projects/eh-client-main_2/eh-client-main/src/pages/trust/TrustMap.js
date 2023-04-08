import React ,{useEffect,useState}from 'react'
import { useHistory,Link } from 'react-router-dom'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import {GOOGLE_MAP_API_KEY} from '../../config/constant'
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import { Typeahead } from 'react-bootstrap-typeahead';

import {Trusts,Addresses,Contacts} from '../../services/'
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
)(({handleSearch,addresses,isSelected,handlePlaceSelection,center,zoom,history,isOpen,setIsOpen,setIsOpenContact,isOpenContact,addressForContactState}) =>
(addressForContactState.length!=0 || addresses.length!==0)&&<GoogleMap
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
                <div style={{marginRight:10, padding:20,position:'absolute',top:-20,right:10,height:'5rem'}}>
                                             <Typeahead
                                                    id="assigned_vendor"
                                                    name="assigned_vendor"
                                                    labelKey="full_name"
                                                    onChange={handleSearch}
                                                    options={[
                                                       {
                                                         'full_name':'aab',
                                                         'assigned_vendor':1
                                                       },
                                                       {
                                                        'full_name':'dd',
                                                        'assigned_vendor':2
                                                      },
                                                      {
                                                        'full_name':'fff',
                                                        'assigned_vendor':3
                                                      }
                                                      ,
                                                      {
                                                        'full_name':'ere',
                                                        'assigned_vendor':4
                                                      }
                                                      ,                                                       {
                                                        'full_name':'ller',
                                                        'assigned_vendor':5
                                                      }

                                                    ]}
                                                    placeholder="Search Place ..."
                                                    // selected={autoCompleted}
                                            />
                </div>


                {/* this marks the result of the search */}
        {
          isSelected&&<Marker  icon= {{url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",  scaledSize: new window.google.maps.Size(50, 50),  
         origin: new window.google.maps.Point(0,0),
         anchor: new window.google.maps.Point(0, 0)}} position={{ lat:center.lat, lng: center.lng }} />
        }

            {/* shows contact address and their information */}
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={60}
      >
          {addressForContactState.map((contact,index)=><Marker onMouseOver={()=>{
                  setIsOpen(null)
                  setIsOpenContact(index)
          }}  key={index} 
          icon= {{url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",  scaledSize: new window.google.maps.Size(50, 50),  
          origin: new window.google.maps.Point(0,0),
          anchor: new window.google.maps.Point(0, 0)}}
          position={{ lat: contact.latitude, lng: contact.longitude }} >
          {(isOpenContact==index) && <InfoWindow
              onCloseClick={()=>setIsOpenContact(null)}
                >
                  <div style={{ opacity: 0.75, padding: `8px` }}>
                    <div style={{ fontColor: `#08233B` }}  onClick={()=>history.push(`/contact/${contact.id}`)}>
                    <h3>{contact.full_name}</h3>
                    <h6>{contact.text_phone}</h6>
                    <h6>{contact.primary_email}</h6>
                    <p> {contact.full_address}</p>
                    </div>
                  </div>
                </InfoWindow>}
              </Marker>)
            }
   </MarkerClusterer>
       
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
              <div style={{ opacity: 0.75, padding: `12px` }}>
                <div style={{  fontColor: `#08233B` }}  onClick={()=>history.push(`/trust/${address.id}`)}>
                  <h3> {address.name}</h3>
                    <h6>{address.full_address}</h6>
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
        const trustsData=Object.values(props.trustList)
        const contactsAddress=props.contactList?Object.values(props.contactList).filter(i=>i.tags_ids?.includes('tag_1')):[]
        // await Contacts.getContacts('?tag_ids[]=tag_1',source)
      //  const addressForMap=addressesData.filter(({id})=>trustsData.some(trust=>trust.address_id==id))

       const addressForTrust=trustsData.reduce((results,trust)=>{
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
        setAddresses(addressForTrust)
       const addressForContact=contactsAddress&&contactsAddress.reduce((results,contact)=>{
       const contactAddress= addressesData&&addressesData.find(address=>contact.address_id==address.id)
         if(contactAddress){
          results.push({
              ...contact,
              latitude:contactAddress.latitude,
              longitude:contactAddress.longitude
            })
         }
       return results

       },[])
       setAddressForContact(addressForContact)
   }
   getAddresses()
   return () => source.cancel();
  }, [props.trustList,props.contactList,props.addressList])

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

  const handleSearch=(place) => {
    console.log({place})
  }

  console.log(addresses,addressForContactState)
  return <Map handleSearch={handleSearch} isSelected={isSelected} setIsOpenContact={setIsOpenContact} isOpenContact={isOpenContact} addressForContactState={addressForContactState} setIsOpen={setIsOpen} isOpen={isOpen} history={history} addresses={addresses} handlePlaceSelection={handlePlaceSelection} center={center} zoom={zoom}/>
}


const mapStateToProps = state => ({
  trustList: state.trustReducer.trustList,
  addressList:state.addressReducer.addressList,
  contactList:state.contactReducer.contactList
})

export default connect(mapStateToProps, null)(TrustMap)
