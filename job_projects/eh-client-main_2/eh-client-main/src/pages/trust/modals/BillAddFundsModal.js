import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

import Datetime from 'react-datetime';
import moment from 'moment';


import {Bills,Contacts} from '../../../services';
import { Typeahead } from 'react-bootstrap-typeahead';
import httpService from '../../../services/httpService'

import { connect } from 'react-redux';
const BillAddFundsModal = props => {
    const [isLarge, setIsLarge] = useState(false);

    const [billState, setbillState] = useState({});
    const [optionsState, setOptions] = useState({});
    const [selected, setSelected] = useState([]);
    const [entitiesState, setEntitiesState] = useState([]);


    const [allContacts,setAllContacts]=useState([])
    const [billOptions,setBillOptions]=useState([])

useEffect(() => {
// representation of the numbers 27 for investor, 26 for family, 28 for Equity & Help Inc and 29 for others
      const filtermethod=(type)=>{
          if (type=='27'){
             return 'investor_bool'
          }
        else {
            return 'family_bool'
        }
      }

      if(billState.bill_choice=="29"){
        setEntitiesState(allContacts)
        setSelected([])
      }
      else if(billState.bill_choice=='28'){
        const contact=allContacts.filter(contact=>contact.id==48)
        setEntitiesState(contact)
        setSelected(contact)
        // setTaxtate({...taxState,bill_choice:48})
      }
      else{
          setSelected([])
          const name=filtermethod(billState.bill_choice)
          const data=allContacts?.filter(contact=>contact[name])
          data&&setEntitiesState(data)
      }

   }, [billState.bill_choice,allContacts])

    const getOptions = async() =>  {
        const data=await Bills.getOptions()
        let options=data.actions.POST.bill_choice.choices
        setBillOptions(options.filter(option=>["E&H Payment","Family Payment","Investor Payment","Other"].includes(option.display_name)))
        // setTaxOptionsState(data.actions.POST)

    }
    
    const CreateBill = async(body) =>  {
       await Bills.createBill(body)
       props.setToggle(!props.toggle)

    }

    const handleDates = (event, name) => {
        setbillState({
            ...billState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };

    const handleEdit = (event) => {
        const { name, value } = event.target
        setbillState({
            ...billState,
            [name]: value
        })
    }

    const handleValueChange = (event, name) => {
        const value = event.value
        setbillState({
            ...billState,
            [name]: value
        })
    }

    useEffect(() => {
        setAllContacts(Object.values(props.contactList))
    }, [props.contactList])

    
    useEffect(() => {
        setbillState({
            ...billState,
            "trust_id": props.id,
            "line_choice": "misc",
            "paid_bill": true,
            "bill_choice": "26",
            "date_received": moment().format("YYYY-MM-DD"),
        })
        getOptions()
    }, [props.trust])
    
    const onSubmit = () => {
        CreateBill(billState)
        setIsLarge(false)
    }
    
    // console.log("The bill state", billState)

    return (
        <React.Fragment>
            <OverlayTrigger overlay={<Tooltip>Add funds to this Trust account</Tooltip>} style={{ float: "right" }}>
                <Button className="shadow-1 theme-bg border border-0" size="sm" onClick={() => setIsLarge(true)}>
                    Add Funds
                </Button>
            </OverlayTrigger>
            <Modal size="lg" show={isLarge} onHide={() => setIsLarge(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Funds</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Date</Form.Label>
                            <Col>
                                <Datetime
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    initialValue={moment()}
                                    timeFormat={false}
                                    name="date_received"
                                    onChange={event => handleDates(event, "date_received")} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Type</Form.Label>
                            <Col>
                                <Form.Control
                                    name="bill_choice"
                                    onChange={handleEdit}
                                    value={billState.bill_choice}
                                    as="select">
                                        <option value=""></option>
                                        { billOptions.length!=0&&
                                        billOptions.map(data => (
                                            <option value={data.value} key={data.value}>{data.display_name}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Entity Name</Form.Label>
                            <Col>
                                {/* <Form.Control
                                    name="entity"
                                    onChange={handleEdit} 
                                    /> */}

                                        <Typeahead
                                            id="full_name"
                                            name="entity"
                                            labelKey="full_name"
                                            onChange={(entity)=>{
                                                entity.length!=0&&handleEdit({target:{name:'entity',value:entity[0].id}})
                                                setSelected(entity)
                                            }
                                        }
                                            options={entitiesState}
                                            placeholder="Choose an entity..."
                                            selected={selected}
                                            />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Amount</Form.Label>
                            <Col>
                                <NumberFormat
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    // Name needs to be the field that is being updated
                                    onValueChange={(defaultValue, name) => handleValueChange(defaultValue, name='credit')}
                                    className="form-control"
                                    fixedDecimalScale={true}
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
                                    <Button className="shadow-1 theme-bg border border-0" onClick={() => setIsLarge(false)}>
                                        Cancel
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Save Changes</Tooltip>} style={{ float: "right" }}>
                                    <Button className="shadow-1 theme-bg border border-0" onClick={onSubmit}>
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


const mapStateToProps = state => ({
    contactList: state.contactReducer.contactList
})
export default connect(mapStateToProps, null)(BillAddFundsModal)