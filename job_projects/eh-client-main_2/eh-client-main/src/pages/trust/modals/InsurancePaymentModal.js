import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

import Datetime from 'react-datetime';
import moment from 'moment';


import {Bills,Contacts} from '../../../services';
import { Typeahead } from 'react-bootstrap-typeahead';
import httpService from '../../../services/httpService';
import { connect } from 'react-redux';

const InsurancePaymentModal = props => {
    const [isLarge, setIsLarge] = useState(false);
    const [insuranceState, setInsuranceState] = useState({});
    const [optionsState, setOptions] = useState({});

    const [selected, setSelected] = useState([]);
    const [entitiesState, setEntitiesState] = useState([]);

    const [allContacts,setAllContacts]=useState([])
    const [billOptions,setBillOptions]=useState([])

useEffect(() => {
// representation of the numbers 27 for investor, 26 for family, 28 for Equity & Help Inc and 29 for others
      console.log('insuranceState.bill_choice',insuranceState.bill_choice)
      const filtermethod=(type)=>{
          if (type=='27'){
             return 'investor_bool'
          }
        else{
            return 'family_bool'
        }
      }

      if(insuranceState.bill_choice=="29"){
        setEntitiesState(allContacts)
        setSelected([])
      }
      else if(insuranceState.bill_choice=='28'){
        const contact=allContacts.filter(contact=>contact.id==48)
        setEntitiesState(contact)
        setSelected(contact)
      }
      else{
          setSelected([])
          const name=filtermethod(insuranceState.bill_choice)
          const data=allContacts?.filter(contact=>contact[name])
          data&&setEntitiesState(data)
      }

   }, [insuranceState.bill_choice,allContacts])

    const getOptions = async() =>  {
        const data=await Bills.getOptions()
        let options=data.actions.POST.bill_choice.choices
        setBillOptions(options.slice(options.length-4,options.length))
        // setTaxOptionsState(data.actions.POST)

    }

    const CreateInsurance = async(body) =>  {
        await Bills.createBill(body)
         props.setToggle(!props.toggle)
    }

    const handleDates = (event, name) => {
        setInsuranceState({
            ...insuranceState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };

    const handleEdit = (event) => {
        const { name, value } = event.target
        setInsuranceState({
            ...insuranceState,
            [name]: value
        })
    }

    const handleValueChange = (event, name) => {
        const value = event.value
        setInsuranceState({
            ...insuranceState,
            [name]: value
        })
    }


    useEffect(() => {
        setAllContacts(Object.values(props.contactList))
    }, [props.contactList])

    useEffect(() => {
        setInsuranceState({
            ...insuranceState,
            "trust_id": props.id,
            "paid_bill": true,
            "line_choice": "ins",
            "bill_choice": "13",
            "date_received": moment().format("YYYY-MM-DD"),

        })
        getOptions()
    }, [props.trust])

    const onSubmit = () => {
        CreateInsurance(insuranceState);
        setIsLarge(false);
    }

    // console.log("The insurance state", insuranceState)

    return (
        <React.Fragment>
            <OverlayTrigger overlay={<Tooltip>Make a payment toward insurance</Tooltip>} style={{ float: "right" }}>
                <Button className="shadow-1 theme-bg border border-0" size="sm" onClick={() => setIsLarge(true)}>
                    Pay Insurance Bill
                </Button>
            </OverlayTrigger>
            <Modal size="lg" show={isLarge} onHide={() => setIsLarge(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Insurance Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Received Date</Form.Label>
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
                                    defaultValue="Daily Insurance"
                                    value={insuranceState.bill_choice}
                                    as="select">
                                    {billOptions.length!=0&&
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
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Payment Amount</Form.Label>
                            <Col>
                                <NumberFormat
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    // Name needs to be the field that is being updated
                                    onValueChange={(defaultValue, name) => handleValueChange(defaultValue, name='debit')}
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
export default connect(mapStateToProps, null)(InsurancePaymentModal)