import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

import Datetime from 'react-datetime';
import moment from 'moment';


import {OwnerShips} from '../../../../services'

const OwnershipModal = props => {
    const [isLarge, setIsLarge] = useState(false);
    const [ownerState, setOwnertate] = useState({});
    const [ownerOptionsState, setOwnerOptionsState] = useState({});


    const getOptions = async() =>  {
        const data =await OwnerShips.getOptions()
        setOwnerOptionsState(data.actions.POST)

    }

    const handleDates = (event, name) => {
        setOwnertate({
            ...ownerState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };

    const handleEdit = (event) => {
        console.log("Event", event)
        const { name, value } = event.target
        setOwnertate({
            ...ownerState,
            [name]: value
        })
    }

    const handleValueChange = (event, name) => {
        console.log("Event", event, "name", name)
        const value = event.value
        setOwnertate({
            ...ownerState,
            [name]: value
        })
    }

    const CreateOwnerShip =async (body) =>  {
        await OwnerShips.createOwnerShip(body)
        setIsLarge(false)
        props.setToggle(!props.toggle)

    }

    useEffect(() => {
        setOwnertate({
            ...ownerState,
            "trust_id": props.trust.id,
            "purchased_from_id": props.trust.owner,
            "ownership_date": moment().format("YYYY-MM-DD"),
            "ownership_type": "2",
            "currency_type": "1",
            "sale_price": props.trust.investor_price

            
        })
        getOptions()
    }, [props.trust])

    const onSubmit = () => {
        CreateOwnerShip(ownerState)
        setIsLarge(false)
    }

    // console.log("The owner state", ownerState)

    return (
        <React.Fragment>
            <OverlayTrigger overlay={<Tooltip>Sell To Investor, Buy Back, Purchase, etc</Tooltip>} style={{ float: "right" }}>
                <Button className="shadow-1 theme-bg border border-0" size="sm" onClick={() => setIsLarge(true)}>
                    Change Ownership
                </Button>
            </OverlayTrigger>
            <Modal size="lg" show={isLarge} onHide={() => setIsLarge(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Change Ownership</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Date</Form.Label>
                            <Col>
                            <Datetime
                                dateFormat="MM/DD/YYYY"
                                closeOnSelect={true}
                                timeFormat={false}
                                initialValue={moment()}
                                name="ownership_date"
                                onChange={event => handleDates(event, "ownership_date")} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Type</Form.Label>
                            <Col>
                            <Form.Control
                                    name="ownership_type"
                                    onChange={handleEdit}
                                    value={ownerState.ownership_type}
                                    as="select">
                                    {   ownerOptionsState.ownership_type &&
                                        ownerOptionsState.ownership_type.choices.map(data => (
                                            <option value={data.value} key={data.value}>{data.display_name}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Owner</Form.Label>
                            <Col>
                                <Form.Control
                                    name="owner_id"
                                    validate
                                    onChange={handleEdit} 
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Purchased From</Form.Label>
                            <Col>
                                <Form.Control
                                    name="purchased_from_id"
                                    defaultValue={props.trust && props.trust.owner}
                                    onChange={handleEdit}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Sale Price</Form.Label>
                            <Col>
                                <NumberFormat
                                    defaultValue={`${props.trust && props.trust.investor_price}`}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    // Name needs to be the field that is being updated
                                    onValueChange={(defaultValue, name) => handleValueChange(defaultValue, name='sale_price')}
                                    className="form-control"
                                    fixedDecimalScale={true}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Currency</Form.Label>
                            <Col>
                                <Form.Control
                                    name="currency_type" 
                                    onChange={handleEdit}
                                    value={ownerState.currency_type}
                                    as="select">
                                        {   ownerOptionsState.currency_type &&
                                        ownerOptionsState.currency_type.choices.map(data => (
                                            <option value={data.value} key={data.value}>{data.display_name}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Description</Form.Label>
                            <Col>
                                <Form.Control
                                    name="description"
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

export default OwnershipModal;