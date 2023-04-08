import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tab, Badge, Tabs, Tooltip } from 'react-bootstrap';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { GET_CHATTER } from '../../store/actions';

import { store } from '../../store/index';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import {orderBy} from 'lodash'

import {Chatters} from '../../services';
const Chatter = props => {

    dayjs.extend(relativeTime);

    const [chatterState, setChatterState] = useState([])
    const [allState,setAllState]=useState([])
    const [postState, setPostState] = useState({})
    const [filterBy,setFilterBy]=useState({
        notes:true,
        qual:false,
        changes:false
    })

    const getList = async(id) => {
        const data=await Chatters.getChattersForContact(id)
        setChatterState(data)
    }


useEffect(()=>{
    const tmpState=[]
    if(filterBy.notes){
      tmpState.push(...chatterState.filter(chatter=>chatter.chatter_type=='2'))
    } 
    if(filterBy.qual){
        tmpState.push(...chatterState.filter(chatter=>chatter.chatter_type=='1'))
    }
    if(filterBy.changes){
        props.changes&&tmpState.push(...props.changes.map(change=>{ return {...change,date:change.time_stamp} }))
    }
   setAllState( orderBy(tmpState, ['date'],['desc']))
},[filterBy,chatterState,props.changes])

    useEffect(() => {
        getList(props.id)
    }, [props.id])

    const postChatter = async(body) => {
        //console.log("Chatter Body", body)

        const bodyFormData = new FormData();
        bodyFormData.append('contact_id', body.contact_id);
        bodyFormData.append('message_text', body.message_text);
        bodyFormData.append('chatter_type', body.chatter_type);
        const data=await Chatters.createChatter(bodyFormData)
        setPostState({...postState,'message_text':''})
        setChatterState([
            data,
            ...chatterState
        ])
    }

    const handleEdit = (event) => {
        const { name, value } = event.target
        setPostState({
            ...postState,
            [name]: value,
            "contact_id": props.id,
            "date": getCurrentDateTime,
            "chatter_type": "2"
        })
    }

    const onSubmit = () => {
        postChatter(postState)
    }

    const getCurrentDateTime = () => {
        return {
            now: moment().format('YYYY-DD-MM HH:mm:ss'),
        };
    }


    //console.log("Chatter", postState)

    return (
        <Col md={12} lg={3} xl={3}>
            <Card>
                <Card.Body>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows="3" placeholder="Write your message"
                            onChange={handleEdit}
                            value={postState.message_text}
                            name="message_text"
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    onSubmit()
                                }
                              }}
                        />
                    </Form.Group>
                    <div className="float-left mb-2">
                            <span style={{color:filterBy.notes?'#04a9f5':'#888',padding:'0.2em',cursor:'pointer'}}
                            onClick={()=>setFilterBy({...filterBy,notes:!filterBy.notes})}
                            >Notes</span>
                          <span style={{color:filterBy.qual?'#04a9f5':'#888',padding:'0.2em',cursor:'pointer'}}
                            onClick={()=>setFilterBy({...filterBy,qual:!filterBy.qual})}
                            >Qual</span>
                      <span style={{color:filterBy.changes?'#04a9f5':'#888',padding:'0.2em',cursor:'pointer'}}
                            onClick={()=>setFilterBy({...filterBy,changes:!filterBy.changes})}
                            >Changes</span>
                    </div>
                    <div className="float-right mb-2">
                        <OverlayTrigger overlay={<Tooltip>Attach a File</Tooltip>} style={{ float: "right" }}>
                            <i className="fa fa-paperclip f-20 mr-2"
                            />
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip>Send</Tooltip>} style={{ float: "right" }}>
                            <i className="fa fa-paper-plane text-c-blue f-20 mr-2"
                                onClick={onSubmit}
                            />
                        </OverlayTrigger>
                    </div>
                    <br />
                    {allState &&
                        <ul className="task-list">
                            {allState.map(data => (
                                <li key={data.id}>
                                    <i className="task-icon bg-c-green" />
                                    <h6>
                                        <p className="text-muted">{moment(data.date || data.time_stamp).format('l LT')}<Badge className="float-right text-white f-11 theme-bg2">Username</Badge></p>
                                    </h6>
                                    {data.message_text&&<p>{data.message_text}</p>}
                                    {data.changed_field&&<p>Changed Field: {data.changed_field}</p>}
                                    {data.old_value&&<p>Old Value: {data.old_value}</p>}
                                    {data.new_value&&<p>New Value: {data.new_value}</p>}
                                </li>
                            ))}
                        </ul>
                    }
                </Card.Body>
            </Card>
        </Col>
    )
}

export default Chatter;