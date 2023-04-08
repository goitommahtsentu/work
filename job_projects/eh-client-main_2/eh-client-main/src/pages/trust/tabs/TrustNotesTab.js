import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { connect,useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getTrust, updateTrustList } from '../../../store/action_calls';


import {Trusts} from '../../../services';
import httpService from '../../../services/httpService';
const NotesTab = props => {
    // State management
    const [trustState, setTrustState] = useState([])
    const [ehNotesState, setEhNotesState] = useState()
    const [presNotesState, setPresNotesState] = useState()


    const dispatch=useDispatch()
    const updateEhNotes = async(id) => {
        const data=await Trusts.updateTrust(props.id,ehNotesState)
        data&&dispatch(updateTrustList(data))
    }
    
    const updatePresNotes = async(id) => {
        const data=await Trusts.updateTrust(props.id,presNotesState)
        data&&dispatch(updateTrustList(data))
    }
    
    
    console.log("Trust State", trustState)
    console.log("EH Notes State", ehNotesState)
    console.log("Pres Notes State", presNotesState)
    
    
    // Reactively handle edit events
    const notesEdit = (event) => {
        // console.log("Event", event)
        const { name, value } = event.target
        if (name == 'easy_homes_notes') {
            setEhNotesState({
                ...ehNotesState,
                [name]: value
            })
        }else{
            setPresNotesState({
                ...presNotesState,
                [name]: value
            })
        }
        trustState[name] = value
    }
    
    const presNotesEdit = (event) => {
        // console.log("Event", event)
        const { name, value } = event.target
        setPresNotesState({
            ...presNotesState,
            [name]: value
        })
        trustState["prop_pres_notes"] = value
    }
    
    useEffect(() => {
        const source=httpService.getSource()
        const getNotes = async(id) => {
            const data=await Trusts.getTrust(id,source)
            setTrustState(data)
        // setEhNotesState(data.easy_homes_notes)
        // setPresNotesState(data.prop_pres_notes)
        }
        getNotes(props.id)
        updateEhNotes()
        updatePresNotes()
        return () => source.cancel();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col md={6}>
                    {/*this information will be always editable even in non editable view*/}
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label as="h5">
                            Easy Homes Notes:
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Some amount of text goes here as a basic note"
                            rows="10"
                            name="easy_homes_notes"
                            onChange={notesEdit}
                            onBlur={updateEhNotes}
                            onMouseOut={updateEhNotes}
                            value={trustState.easy_homes_notes ? trustState["easy_homes_notes"] : ''}
                        />
                        
                    </Form.Group>
                </Col>
                <Col md={6}>
                    {/*this information will be always editable even in non editable view*/}
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label as="h5"> Property Preservation Notes:</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Some amount of text goes here as a basic note"
                            rows="10"
                            name="prop_pres_notes"
                            onChange={notesEdit}
                            onBlur={updatePresNotes}
                            onMouseOut={updatePresNotes}
                            value={trustState.prop_pres_notes ? trustState["prop_pres_notes"] : ''}
                        />

                    </Form.Group>
                </Col>
            </Row>
        </React.Fragment>
    );
};

NotesTab.propTypes = {
    trust: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    trust: state.trustReducer.trust,
})

export default connect(mapStateToProps, { getTrust })(NotesTab);