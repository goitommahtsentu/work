import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import Datetime from 'react-datetime';
import moment from 'moment';
import fieldToUpper from "../../components/Custom/fieldToUpper";
import { useHistory } from 'react-router-dom';


// Import Modals
import AddressModal from '../address/modals/AddressModal';

// Import Store

import {Trusts,Lanes,Addresses} from '../../services'
import httpService from '../../services/httpService';

import { useDispatch } from 'react-redux';
import { updateTrustList } from '../../store/action_calls';

import {connect} from 'react-redux'

const CreateReact = props => {

    const [trustState, setTrustState] = useState({});
    const [trustOptionsState, setTrustOptionsState] = useState({});
    const [stageState, setStageState] = useState([])
    const [addressState, setAddressState] = useState([])

    const history = useHistory();
    const dispatch=useDispatch()
    // This will allow new values entered in the modal to go in
    const newAddress = id => {
        setTrustState({
            ...trustState,
            "address_id": id
        })
    }

    const CreateTrust = async(body) => {
        const data=await Trusts.createTrust(body)
        if(!data) return
        dispatch(updateTrustList(data))
        console.log(data)
        history.replace(`/trust/${data.id}`)
   }

     useEffect(()=>{
        Object.keys(props.addressList).length!==0&&setAddressState(Object.values(props.addressList))
    },[props.addressList]);
    
     useEffect(() => {
        const source=httpService.getSource()
        const getStage = async() => {
            const data=await Lanes.getStage()
            setStageState(data)
      
          }
        getStage()
        return () => source.cancel();
     }, []);
     
     const handleDates = (event, name) => {
         // console.log("From date", moment(event._d).format("MM/DD/YYYY"))
         // console.log("From name", name)
         
         
         setTrustState({
             ...trustState,
             [name]: moment(event._d).format("YYYY-MM-DD")
            })
        };
        
        const handleEdit = (event) => {
            // console.log("Event", event)
            const { name, value } = event.target
            setTrustState({
                ...trustState,
                [name]: value
            })
        }
        
        useEffect(() => {
            const source=httpService.getSource()
            const getOptions = async() => {
                const data=await Trusts.getOptions(source)
                data&&setTrustOptionsState(data.actions.POST)
        
            }
            getOptions()
            return () => source.cancel();
    }, [])

    console.log("Trust", trustState)

    const onSubmit = () => {
        CreateTrust(trustState)
    }



    return (
        <Card>
            <Card.Header>
                <Row>

                    <Col>
                        <Form.Group as={Row}>
                            <Col sm={8}>
                                {/* -------------------- /api/trust/trust/ - name -------------------- */}
                                <Form.Label className={"mb-2"} >Trust Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    size="lg"
                                    onChange={handleEdit}
                                    onInput={fieldToUpper}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col className="float-right">
                        <div className="float-right" style={{ display: "flex" }}>

                            <OverlayTrigger overlay={<Tooltip>Create New Trust</Tooltip>} style={{ float: "right" }}>

                                <Button className="shadow-1 theme-bg border border-0" onClick={onSubmit}>
                                    Save
                                </Button>

                            </OverlayTrigger>

                        </div>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <Form>
                            <Form.Group as={Row}>
                                <Form.Label className={"mb-n5"} column sm={4}>Address</Form.Label>
                                <Col sm={7}>
                                    {/* -------------------- /api/trust/trust/ - address -------------------- */}
                                    <Form.Control
                                        type="address_id"
                                        name="address_id"
                                        value={trustState.address_id ? trustState["address_id"] : ''}
                                        onChange={handleEdit}
                                        as="select">
                                        <option value=""></option>
                                        {addressState &&
                                            addressState.map(data => (
                                                <option value={data.id} key={data.id}>{data.display_address}</option>
                                            ))
                                        }
                                    </Form.Control>
                                </Col>
                                <Col sm={1}>
                                    <AddressModal id={trustState.id} newAddress={id => newAddress(id)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                {/* -------------------- /api/trust/trust/ - trustee -------------------- */}
                                <Form.Label className={"mb-n5"} column sm={4}>Trustee</Form.Label>
                                <Col sm={8}>
                                    {/* /api/trust - trustee */}
                                    <Form.Control
                                        name="trustee_type"
                                        onChange={handleEdit}
                                        as="select">
                                        {trustOptionsState.trustee_type &&
                                            trustOptionsState.trustee_type.choices.map(data => (
                                                <option value={data.value} key={data.value}>{data.display_name}</option>
                                            ))
                                        }
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                {/* This is going to point to users app */}
                                {/* It will check for employee status of users in order to generate this group to select from */}
                                {/* For now it is just a CharField in order to get data */}
                                <Form.Label className={"mb-n5"} column sm={4}>EasyHomes Sales Manager</Form.Label>
                                <Col sm={8}>
                                    {/* /api/trust - sale_manager */}
                                    <Form.Control disabled={false} as="select">
                                        <option>Charlotte Wallet</option>
                                        <option>Jessica Hollingsworth</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label className={"mb-n5"} column sm={4}>Lockbox code</Form.Label>
                                <Col sm={8}>
                                    {/* -------------------- /api/trust/trust/ - lockbox -------------------- */}
                                    <Form.Control
                                        name="lockbox"
                                        onChange={handleEdit} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label className={"mb-n5"} column sm={4}>Properties Assigned Vendor</Form.Label>
                                <Col sm={8}>
                                    {/* -------------------- /api/trust/trust/ - assigned_vendor -------------------- */}
                                    {/* I also don't think this will be a dropdown */}
                                    <Form.Control disabled={false} as="select">
                                        <option>Mike the Plumber</option>
                                        <option>Red Roof Tommy</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column sm={4}>Set Up & Repair Step</Form.Label>
                            <Col sm={8}>
                                {/* -------------------- /api/trust/trust/ - repair_stage_id -------------------- */}
                                {/* This will pull from another place, it is a simple CharField for now */}
                                <Form.Control

                                    type="set_up_stage_id"
                                    name="set_up_stage_id"
                                    value={trustState.set_up_stage_id ? trustState["set_up_stage_id"] : ''}
                                    onChange={handleEdit}
                                    as="select">
                                    {stageState &&
                                        stageState.map(data => (
                                            <option value={data.id} key={data.id}>{data.stage}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            {/* -------------------- /api/trust/trust/ - trust_create_date -------------------- */}
                            <Form.Label className={"mb-n5"} column sm={4}>Trust Creation Date</Form.Label>
                            <Col sm={8}>
                                <Datetime
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    name="trust_create_date"
                                    onChange={event => handleDates(event, "trust_create_date")} />

                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            {/* -------------------- /api/trust/trust/ - purchase_date -------------------- */}
                            <Form.Label className={"mb-n5"} column sm={4}>Purchased Date</Form.Label>
                            <Col sm={8}>
                                <Datetime
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    name="purchase_date"
                                    onChange={event => handleDates(event, "purchase_date")} />


                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            {/* -------------------- /api/trust/trust/ - deed_record_date -------------------- */}
                            <Form.Label className={"mb-n5"} column sm={4}>Deed Recorded Date</Form.Label>
                            <Col sm={8}>

                                <Datetime
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    name="trust_create_date"
                                    onChange={event => handleDates(event, "trust_create_date")} />

                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            {/* -------------------- /api/trust/trust/ - insured_amount -------------------- */}
                            <Form.Label className={"mb-n5"} column sm={4}>Amount Ins For</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    className="form-control"
                                    type="number"
                                    name="insured_amount"
                                    onChange={handleEdit} />
                            </Col>
                        </Form.Group>

                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}


const mapStateToProps = state => ({
    addressList:state.addressReducer.addressList
})

export default connect(mapStateToProps, null)(CreateReact)