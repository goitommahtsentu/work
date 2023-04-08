import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';





import {getAddress} from '../../../store/action_calls';

import {Addresses} from '../../../services'
import { GOOGLE_MAP_API_KEY } from '../../../config/constant';

import Autocomplete from "react-google-autocomplete";
import httpService from '../../../services/httpService';

import { useDispatch} from 'react-redux';
import { updateAddressList } from '../../../store/action_calls';

const AddressModal = props => {
    const [isLarge, setIsLarge] = useState(false);
    const [addressState, setaddressState] = useState({});
    const [addressOptionsState, setAddressOptionsState] = useState({});

    // extract addresses from google autocomplete returned object on selection
    const handlePlaceSelection=(place) => {
        let address={}
     place.address_components.forEach(element => {
         let type=element.types[0]
         if (type === "locality") {
             let city =element['long_name'];
             console.log('city',city)
             address["city"]=city
         } else if (type === "administrative_area_level_1") {
             let state = element['long_name'];
             console.log('state',state)
             address["state"]=state
         } 
         else if (type === "administrative_area_level_2") {
             let county = element['long_name'];
             console.log('state',county)
            address["county"]=county
     }
         else if (type === "country") {
             let country = element['long_name'];
             console.log('country',country)
              address["country"]=country
         }
         else if (type === "postal_code") {
             let postal_code = element['long_name'];
             console.log('country',postal_code)
             address["zipcode"]=postal_code
         }  else if (type === "street_address" || type==="street_number" || type==="route") {
            console.log('type of street',type) 
            let street_1 = element['long_name'];
             console.log('street_1',street_1)
             address.street_1?address["street_1"]+=" " + street_1:address["street_1"]=street_1
         }  
     })
     const {lat ,lng}=place.geometry.location
     address['longitude']=lng()
     address['latitude']=lat()
     console.log(place.address_components)
     setaddressState(prev=>{return {...prev,...address}})
 
 }

 
 const handleEdit = (event) => {
        
        // console.log("Event", event)
        const { name, value } = event.target
        setaddressState({
            ...addressState,
            [name]: value
        })
    }
   const dispatch=useDispatch()
    const createAddress = async(body) =>  {
        const data=await Addresses.createAddress(body)
        data&&dispatch(updateAddressList(data))
        setIsLarge(false)
        props.newAddress(data.id)
        console.log("Create", data)
    }

    useEffect(() => { 
        const source=httpService.getSource()
        const getOptions = async() =>  {
            const data=await Addresses.getOptions(source)
            data&&setAddressOptionsState(data.actions.POST)
            
        }
        setaddressState({
            ...addressState,
        })
        getOptions()
        return () => source.cancel();
    }, [])

    const onSubmit = () => {
        createAddress(addressState)
        setaddressState({})
        setIsLarge(false)
    }


    return (
        <React.Fragment>
            <OverlayTrigger overlay={<Tooltip>Create New Address</Tooltip>} style={{ float: "right" }}>
                <Button className=" bg-transparent m-1 border-0" size="sm" onClick={() => setIsLarge(true)} style={{ float: "right" }}>
                    <i className="feather icon-plus fa-2x text-dark mx-n3" />
                </Button>
            </OverlayTrigger>
            <Modal size="lg" show={isLarge} onHide={() => setIsLarge(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">New Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                 <div style={{marginLeft:80,marginBottom:20}}>
                        <Autocomplete
                        style={{
                            padding:10,
                            width: "80%",
                            margin:'20 15'
                        }}
                        apiKey={GOOGLE_MAP_API_KEY}
                        onPlaceSelected={handlePlaceSelection}
                        options={{
                            types: ["geocode", "establishment"]
                         }}
                        />

                </div>           
                    <Form>
                        {/* this input field for address selection of the react-google-autocomplete */}
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Street 1</Form.Label>
                            <Col>
                                <Form.Control
                                    name="street_1"
                                    value={addressState.street_1}
                                    onChange={handleEdit} 

                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Street 2</Form.Label>
                            <Col>
                                <Form.Control
                                    name="street_2"
                                    value={addressState.street_2}
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>City</Form.Label>
                            <Col>
                                <Form.Control
                                    name="city"
                                    value={addressState.city}
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>County</Form.Label>
                            <Col>
                                <Form.Control
                                    name="county"
                                    value={addressState.county}
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>State</Form.Label>
                            <Col>
                                <Form.Control
                                    name="state"
                                    value={addressState.state}
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Postal Code</Form.Label>
                            <Col>
                                <Form.Control
                                    name="zipcode"
                                    value={addressState.zipcode}
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Country</Form.Label>
                            <Col>
                                <Form.Control
                                    name="country"
                                    value={addressState.country}
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Latitude</Form.Label>
                            <Col>
                                <Form.Control
                                    name="latitude"
                                    value={addressState.latitude}
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Longitude</Form.Label>
                            <Col>
                                <Form.Control
                                    name="longitude"
                                    value={addressState.longitude}
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col className="float-right">
                            <div className="float-right" style={{ display: "flex" }}>
                                <OverlayTrigger overlay={<Tooltip>Discard Changes</Tooltip>} style={{ float: "right" }}>
                                    <Button className="shadow-1 theme-bg border border-0"  onClick={() => setIsLarge(false)}>
                                        Cancel
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Save Changes</Tooltip>} style={{ float: "right" }}>
                                    <Button className="shadow-1 theme-bg border border-0" type="submit" onClick={onSubmit} >
                                        Save
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};



export default AddressModal;