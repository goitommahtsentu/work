import React, { useState, useEffect,createRef } from 'react';
import { Row, Col, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

import Datetime from 'react-datetime';
import moment from 'moment';

import { store } from '../../../store/index';
import { useDispatch } from 'react-redux';

import { Typeahead } from 'react-bootstrap-typeahead';
import {Bills,Contacts} from '../../../services';
import httpService from '../../../services/httpService';

import { connect } from 'react-redux';

const TaxBillModal = props => {
    const [isLarge, setIsLarge] = useState(false);

    const [taxState, setTaxtate] = useState({});
    const [taxOptionsState, setTaxOptionsState] = useState({});
    const [selected, setSelected] = useState([]);
    const [allContacts,setAllContacts]=useState([])
    const [entitiesState, setEntitiesState] = useState([]);
    const [billOptions,setBillOptions]=useState([])
    useEffect(() => {
        // 25 means family payout
        console.log('taxState.bill_choice',taxState)
        let data=[]
        if (taxState.bill_choice!='25'){
            data=allContacts.filter(contact=>contact.tag_ids.includes(4))
          }
        else{
            data=allContacts.filter(contact=>contact.family_bool)
        }
          
          setEntitiesState(data)

   }, [taxState.bill_choice,allContacts])
    
    const getOptions = async() =>  {
        const data=await Bills.getOptions()
        let options=data.actions.POST.bill_choice.choices.filter(data => (data.display_name.includes('Tax Bill') || data.display_name.includes('Family Payout')))
        setBillOptions(options)
        // setTaxOptionsState(data.actions.POST)
    }
    
    
    const handleDates = (event, name) => {
        setTaxtate({
            ...taxState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };
    
    const handleEdit = (event) => {
        const { name, value } = event.target
        setTaxtate({
            ...taxState,
            [name]: value
        })
    }
    const handleValueChange = (event, name) => {
        const value = event.value
        setTaxtate({
            ...taxState,
            [name]: value
        })
    }
    
    const CreateTaxShip = async(body) =>  {
        await Bills.createBill(body)
        props.setToggle(!props.toggle)
    }
    
    useEffect(() => {
        Object.keys(props.contactList).length!=0&&setAllContacts(Object.values(props.contactList))
    }, [props.contactList])

    useEffect(() => {
     
        setTaxtate({
            ...taxState,
            "trust_id": props.id,
            "paid_bill": false,
            "line_choice": "tax",
            "bill_choice": "1",
            "date_received": moment().format("YYYY-MM-DD"),
        })
        getOptions()
      }, [props.trust])

    const onSubmit = () => {
        CreateTaxShip(taxState)
        setIsLarge(false)
    }

    // console.log("The tax state", taxState)

    return (
        <React.Fragment>
            <OverlayTrigger overlay={<Tooltip>Create Tax Bill for this Trust</Tooltip>} style={{ float: "right" }}>
                <Button className="shadow-1 theme-bg border border-0" size="sm" onClick={() => setIsLarge(true)}>
                    Add Tax Bill
                </Button>
            </OverlayTrigger>
            <Modal size="lg" show={isLarge} onHide={() => setIsLarge(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Tax Bill</Modal.Title>
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
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Due Date</Form.Label>
                            <Col>
                            <Datetime
                                dateFormat="MM/DD/YYYY"
                                closeOnSelect={true}
                                timeFormat={false}
                                name="due_date"
                                onChange={event => handleDates(event, "due_date")} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Type</Form.Label>
                            <Col>
                                <Form.Control
                                    name="bill_choice"
                                    onChange={handleEdit}
                                    value={taxState.bill_choice}
                                    as="select">
                                      {billOptions.length!=0&&
                                        billOptions.map(data =><option value={data.value} key={data.value}>{data.display_name}</option>)
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
                                                entity&&handleEdit({target:{name:'entity',value:entity[0].id}})
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
export default connect(mapStateToProps, null)(TaxBillModal)